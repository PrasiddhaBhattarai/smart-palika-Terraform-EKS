variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project_name" {
  type    = string
  default = "smart-palika"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "creator" {
  type    = string
  default = "user"
}

variable "batch" {
  type    = string
  default = "2"
}

# ---------------- VPC ----------------
variable "vpc_cidr" {
  type    = string
  default = "10.0.0.0/16"
}

variable "azs" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b"]
}

variable "public_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.0.0/24", "10.0.1.0/24"]
}

variable "private_app_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "private_db_subnet_cidrs" {
  type    = list(string)
  default = ["10.0.20.0/24", "10.0.21.0/24"]
}

variable "single_nat_gateway" {
  description = "Use one shared NAT Gateway for dev to save cost"
  type        = bool
  default     = true
}

# ---------------- EKS ----------------
variable "eks_cluster_version" {
  type    = string
  default = "1.36"
}

variable "eks_node_instance_types" {
  type    = list(string)
  default = ["t3.medium"]
}

variable "eks_node_desired_size" {
  type    = number
  default = 2
}

variable "eks_node_min_size" {
  type    = number
  default = 2
}

variable "eks_node_max_size" {
  type    = number
  default = 4
}

variable "eks_node_capacity_type" {
  type    = string
  default = "ON_DEMAND"
}


# ---------------- RDS ----------------
variable "rds_engine_version" {
  type    = string
  default = "16.4"
}

variable "rds_instance_class" {
  type    = string
  default = "db.t3.medium"
}

variable "rds_allocated_storage" {
  type    = number
  default = 50
}

variable "rds_multi_az" {
  type    = bool
  default = true
}

variable "rds_db_name" {
  type    = string
  default = "appdb"
}

variable "rds_db_username" {
  type    = string
  default = "dbadmin"
}

variable "rds_deletion_protection" {
  type    = bool
  default = false
}



# ---------------- EKS-addons ----------------
#helm metrics_server

variable "eks_helm_metrics_server_repository" {
  description = "Metrics Server Helm repository"
  type        = string
  default     = "https://kubernetes-sigs.github.io/metrics-server/"
}

variable "eks_helm_metrics_server_chart" {
  description = "Metrics Server Helm chart name"
  type        = string
  default     = "metrics-server"
}

variable "eks_helm_metrics_server_version" {
  description = "Metrics Server Helm chart version"
  type        = string
  default     = "3.13.1"
}

# heml_cluster_autoscaler

variable "eks_helm_cluster_autoscaler_repository" {
  description = "Metrics Server Helm repository"
  type        = string
  default     = "https://kubernetes.github.io/autoscaler"
}

variable "eks_helm_cluster_autoscaler_chart" {
  description = "Metrics Server Helm chart name"
  type        = string
  default     = "cluster-autoscaler"
}

variable "eks_helm_cluster_autoscaler_version" {
  description = "Metrics Server Helm chart version"
  type        = string
  default     = "9.59.0"
}

# helm_aws_lb_controller

variable "eks_helm_aws_lbc_repository" {
  description = "Metrics Server Helm repository"
  type        = string
  default     = "https://aws.github.io/eks-charts"
}

variable "eks_helm_aws_lbc_chart" {
  description = "Metrics Server Helm chart name"
  type        = string
  default     = "aws-load-balancer-controller"
}

variable "eks_helm_aws_lbc_version" {
  description = "Metrics Server Helm chart version"
  type        = string
  default     = "3.4.3"
}

variable "k8s_redis_url" {
  type      = string
  sensitive = true
  default = ""
}

variable "k8s_jwt_secret" {
  type      = string
  sensitive = true
  default = ""
}

variable "k8s_cron_secret" {
  type      = string
  sensitive = true
  default = ""
}

variable "k8s_cloudinary_cloud_name" {
  type      = string
  sensitive = true
  default = ""
}

variable "k8s_cloudinary_api_key" {
  type      = string
  sensitive = true
  default = ""
}

variable "k8s_cloudinary_api_secret" {
  type      = string
  sensitive = true
  default = ""
}

variable "k8s_email_user" {
  type      = string
  sensitive = true
  default = ""
}

variable "k8s_email_pass" {
  type      = string
  sensitive = true
  default = ""
}

# ---------------- ElastiCache ----------------
# variable "cache_engine" {
#   description = "redis or valkey"
#   type        = string
#   default     = "valkey"
# }

# variable "cache_engine_version" {
#   type    = string
#   default = "7.2"
# }

# variable "cache_node_type" {
#   type    = string
#   default = "cache.t3.medium"
# }

# variable "cache_num_nodes" {
#   type    = number
#   default = 2
# }


# ---------------- Route 53 ----------------
variable "domain_name" {
  description = "Root domain, e.g. example.com"
  type        = string
  default     = "example.com"
}

variable "create_hosted_zone" {
  description = "Create a new hosted zone (true) or use an existing one (false)"
  type        = bool
  default     = false
}

variable "app_record_name" {
  description = "Fully qualified hostname to point at the ALB, e.g. dev.example.com"
  type        = string
  default     = "dev.example.com"
}

variable "alb_dns_name" {
  type = string
  default = ""
}

variable "alb_zone_id" {
  type = string
  default = ""
}
