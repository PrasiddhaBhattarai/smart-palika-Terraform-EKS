# ---------------- metrics helm chart --------------
resource "helm_release" "metrics_server" {
  name = "metrics-server"

  repository = var.helm_metrics_server_repository
  chart      = var.helm_metrics_server_chart
  namespace  = "kube-system"
  version    = var.helm_metrics_server_version

  values = [file("${path.module}/values/metrics-server.yaml")]

  # depends_on = [aws_eks_node_group.this]
}

# resource "helm_release" "metrics_server" → Defines a Terraform-managed Helm release named metrics_server.
# 
# name → Sets the name of the Helm release to metrics-server inside Kubernetes.
# 
# repository → Specifies the Helm repository from which the Metrics Server chart is downloaded.
# 
# chart → Specifies the name of the Helm chart to install.
# 
# namespace → Installs the Metrics Server resources into the Kubernetes kube-system namespace.
# 
# version → Specifies the Helm chart version to install (3.13.1), not the Metrics Server application version.
# 
# values → Loads your custom Helm configuration from values/metrics-server.yaml and applies it to the chart.
# 
# depends_on → Tells Terraform to install Metrics Server only after the EKS node group general has been created.
