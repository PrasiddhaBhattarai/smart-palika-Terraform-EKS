locals {
  # manifests = fileset("${path.module}/../../../k8s", "*.yaml")
  k8s_path  = "${path.module}/../../../k8s"
  manifests = fileset(local.k8s_path, "*.yaml")
}

terraform {
  required_providers {
    kubectl = {
      source  = "gavinbunney/kubectl"
      version = ">= 1.7.0"
    }
  }
}
# Grant backend-pod Service Account to get secret-value for 

resource "aws_iam_role" "backend-pod" {
  name = "${var.eks_cluster_name}-backend-pod"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "sts:AssumeRole",
          "sts:TagSession"
        ]
        Principal = {
          Service = "pods.eks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "backend-pod" {
  name = "${var.eks_cluster_name}-backend-pod"

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Action" : [
          "secretsmanager:GetSecretValue"
        ],
        "Resource" : var.db_secret_arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "backend-pod" {
  policy_arn = aws_iam_policy.backend-pod.arn
  role       = aws_iam_role.backend-pod.name
}

# this doesn't create mentioned service_account
# it should pre-exist
resource "aws_eks_pod_identity_association" "backend-pod" {
  cluster_name    = var.eks_cluster_name
  namespace       = "sm-app"
  service_account = "backend-pod-sm"
  role_arn        = aws_iam_role.backend-pod.arn

  depends_on = [
    kubectl_manifest.backend-pod-ServiceAccount
  ]
}


# ----------- k8s apply using kubectl provider -------------

resource "kubectl_manifest" "namespace" {
  yaml_body = file("${local.k8s_path}/namespace.yaml")


  depends_on = [
    helm_release.aws_lbc
  ]
}

resource "kubectl_manifest" "backend-pod-ServiceAccount" {
  yaml_body = file("${local.k8s_path}/backend-pod-ServiceAccount.yaml")

  depends_on = [
    kubectl_manifest.namespace
  ]
}

resource "kubectl_manifest" "app-config" {
  yaml_body = file("${local.k8s_path}/app-config.yaml")


  depends_on = [
    kubectl_manifest.backend-pod-ServiceAccount
  ]
}

# data "aws_secretsmanager_secret_version" "db" {
#   secret_id = var.db_secret_arn
# }

# locals {
#   db_secret = jsondecode(
#     data.aws_secretsmanager_secret_version.db.secret_string
#   )

#   database_url = "postgres://${local.db_secret.username}:${local.db_secret.password}@${var.db_address}:${var.db_port}/${var.db_name}"
# }

resource "kubectl_manifest" "backend_secret" {
  yaml_body = yamlencode({
    apiVersion = "v1"
    kind       = "Secret"

    metadata = {
      name      = "backend-secret"
      namespace = "sm-app"
    }

    type = "Opaque"

    stringData = {
      REDIS_URL             = var.k8s_redis_url
      JWT_SECRET            = var.k8s_jwt_secret
      CRON_SECRET           = var.k8s_cron_secret
      CLOUDINARY_CLOUD_NAME = var.k8s_cloudinary_cloud_name
      CLOUDINARY_API_KEY    = var.k8s_cloudinary_api_key
      CLOUDINARY_API_SECRET = var.k8s_cloudinary_api_secret
      EMAIL_USER            = var.k8s_email_user
      EMAIL_PASS            = var.k8s_email_pass

      # DATABASE_URL = local.database_url

      AWS_REGION    = var.aws_region
      DB_ADDRESS    = var.db_address
      DB_PORT       = var.db_port
      DB_NAME       = var.db_name
      DB_SECRET_ARN = var.db_secret_arn
    }
  })

  depends_on = [
    kubectl_manifest.app-config
  ]
}


resource "kubectl_manifest" "app" {
  for_each = {
    for file in local.manifests : file => file
    if file != "namespace.yaml" && file != "ingress.yaml" && file != "app-config.yaml" && file != "backend-pod-ServiceAccount.yaml"
  }

  yaml_body = file("${local.k8s_path}/${each.value}")

  depends_on = [
    kubectl_manifest.backend_secret
  ]
}

resource "kubectl_manifest" "frontend_ingress" {
  yaml_body = file("${local.k8s_path}/ingress.yaml")

  depends_on = [
    kubectl_manifest.app
  ]
}

# so that tf destroy will delete the ingress automatically
resource "null_resource" "ingress_cleanup" {
  triggers = {
    eks_cluster_name = var.eks_cluster_name
    aws_region = var.aws_region
  }

  provisioner "local-exec" {
    
    # Terraform provisioners have a when setting that controls which lifecycle event triggers them
    # default value is create
    when    = destroy

    command = <<-EOT
      aws eks update-kubeconfig --name ${self.triggers.eks_cluster_name} --region ${self.triggers.aws_region} || true
      kubectl delete ingress frontend-ingress -n sm-app --ignore-not-found --timeout=60s || true
      sleep 30
    EOT
  }

  depends_on = [kubectl_manifest.frontend_ingress]
}

resource "null_resource" "wait_for_alb" {
  depends_on = [
    kubectl_manifest.frontend_ingress
  ]
  triggers = {
    eks_cluster_name = var.eks_cluster_name
    aws_region = var.aws_region
  }

  provisioner "local-exec" {
    command = <<-EOT
      aws eks update-kubeconfig --name ${self.triggers.eks_cluster_name} --region ${self.triggers.aws_region} || true
      echo "Waiting for ALB hostname..."

      for i in $(seq 1 60); do
        HOSTNAME=$(kubectl get ingress frontend-ingress \
          -n sm-app \
          -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null || true)

        if [ -n "$HOSTNAME" ]; then
          echo "ALB hostname: $HOSTNAME"
          exit 0
        fi

        echo "ALB hostname not ready yet ($i/60)"
        sleep 10
      done

      echo "Timed out waiting for ALB hostname"
      exit 1
    EOT
  }
}

data "kubernetes_ingress_v1" "frontend" {
  metadata {
    name      = "frontend-ingress"
    namespace = "sm-app"
  }
  depends_on = [null_resource.wait_for_alb]
}
