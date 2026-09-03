variable "project_name" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "environment" {
  type = string
}

variable "cluster_version" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "eks_cluster_name" {
  type = string
}

variable "helm_metrics_server_repository" {
  description = "Metrics Server Helm repository"
  type        = string
  default     = "https://kubernetes-sigs.github.io/metrics-server/"
}

variable "helm_metrics_server_chart" {
  description = "Metrics Server Helm chart name"
  type        = string
  default     = "metrics-server"
}

variable "helm_metrics_server_version" {
  description = "Metrics Server Helm chart version"
  type        = string
  default     = "3.13.1"
}

variable "helm_cluster_autoscaler_repository" {
  description = "Metrics Server Helm repository"
  type        = string
  default     = "https://kubernetes.github.io/autoscaler"
}

variable "helm_cluster_autoscaler_chart" {
  description = "Metrics Server Helm chart name"
  type        = string
  default     = "cluster-autoscaler"
}

variable "helm_cluster_autoscaler_version" {
  description = "Metrics Server Helm chart version"
  type        = string
  default     = "9.59.0"
}

variable "helm_aws_lbc_repository" {
  description = "Metrics Server Helm repository"
  type        = string
  default     = "https://aws.github.io/eks-charts"
}

variable "helm_aws_lbc_chart" {
  description = "Metrics Server Helm chart name"
  type        = string
  default     = "aws-load-balancer-controller"
}

variable "helm_aws_lbc_version" {
  description = "Metrics Server Helm chart version"
  type        = string
  default     = "3.4.3"
}


variable "k8s_redis_url" {
  type      = string
  sensitive = true
}

variable "k8s_jwt_secret" {
  type      = string
  sensitive = true
}

variable "k8s_cron_secret" {
  type      = string
  sensitive = true
}

variable "k8s_cloudinary_cloud_name" {
  type      = string
  sensitive = true
}

variable "k8s_cloudinary_api_key" {
  type      = string
  sensitive = true
}

variable "k8s_cloudinary_api_secret" {
  type      = string
  sensitive = true
}

variable "k8s_email_user" {
  type      = string
  sensitive = true
}

variable "k8s_email_pass" {
  type      = string
  sensitive = true
}



variable "db_address" {
  type = string
}

variable "db_port" {
  type = string
}

variable "db_name" {
  type = string
}

variable "db_username" {
  type = string
}

variable "db_secret_arn" {
  type = string
  sensitive = true
}