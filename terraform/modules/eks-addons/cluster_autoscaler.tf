# ---------------- pod_identity --------------
data "aws_eks_addon_version" "pod_identity_agent" {
  addon_name         = "eks-pod-identity-agent"
  kubernetes_version = var.cluster_version
  most_recent        = true
}

resource "aws_eks_addon" "pod_identity_agent" {
  cluster_name  = var.eks_cluster_name
  addon_name    = "eks-pod-identity-agent"
  addon_version = data.aws_eks_addon_version.pod_identity_agent.version
}
resource "time_sleep" "wait_for_pod_identity_webhook" {
  depends_on      = [aws_eks_addon.pod_identity_agent]
  create_duration = "30s"
}

# ---------------- cluster_autoscaler --------------
resource "aws_iam_role" "cluster_autoscaler" {
  name = "${var.eks_cluster_name}-cluster-autoscaler"

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

resource "aws_iam_policy" "cluster_autoscaler" {
  name = "${var.eks_cluster_name}-cluster-autoscaler"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "autoscaling:DescribeAutoScalingGroups",
          "autoscaling:DescribeAutoScalingInstances",
          "autoscaling:DescribeLaunchConfigurations",
          "autoscaling:DescribeScalingActivities",
          "autoscaling:DescribeTags",
          "ec2:DescribeImages",
          "ec2:DescribeInstanceTypes",
          "ec2:DescribeLaunchTemplateVersions",
          "ec2:GetInstanceTypesFromInstanceRequirements",
          "eks:DescribeNodegroup"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "autoscaling:SetDesiredCapacity",
          "autoscaling:TerminateInstanceInAutoScalingGroup"
        ]
        Resource = "*"
      },
    ]
  })
}

resource "aws_iam_role_policy_attachment" "cluster_autoscaler" {
  policy_arn = aws_iam_policy.cluster_autoscaler.arn
  role       = aws_iam_role.cluster_autoscaler.name
}

# this doesn't create mentioned service_account
# it should pre-exist
resource "aws_eks_pod_identity_association" "cluster_autoscaler" {
  cluster_name    = var.eks_cluster_name
  namespace       = "kube-system"
  service_account = "cluster-autoscaler"
  role_arn        = aws_iam_role.cluster_autoscaler.arn
}

resource "helm_release" "cluster_autoscaler" {
  name = "autoscaler"

  repository = var.helm_cluster_autoscaler_repository
  chart      = var.helm_cluster_autoscaler_chart
  namespace  = "kube-system"
  version    = var.helm_cluster_autoscaler_version

  # set is used to pass configuration values
  set = [
    {
    name  = "rbac.serviceAccount.name"
    value = "cluster-autoscaler"
  },
  {
    name  = "autoDiscovery.clusterName"
    value = var.eks_cluster_name
  },
  {
    name  = "awsRegion"
    value = var.aws_region
  }
  ]

  depends_on = [helm_release.metrics_server]
}

# set : passes config values to helm chart
# 
# rbac.serviceAccount.name → Sets the Kubernetes ServiceAccount name to cluster-autoscaler.
# also creates new Service-Account if doesn't exist
# 
# autoDiscovery.clusterName → Tells Cluster Autoscaler which EKS cluster to monitor for autoscaling.
# 
# awsRegion