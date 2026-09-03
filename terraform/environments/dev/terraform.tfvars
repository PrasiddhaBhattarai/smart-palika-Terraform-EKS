aws_region   = "us-east-1"
project_name = "smart-palika"
environment  = "dev"
creator      = "prasiddhabhattarai333@gmail.com"

# VPC
vpc_cidr                 = "10.0.0.0/16"
azs                      = ["us-east-1a", "us-east-1b"]
public_subnet_cidrs      = ["10.0.0.0/24", "10.0.1.0/24"]
private_app_subnet_cidrs = ["10.0.10.0/24", "10.0.11.0/24"]
private_db_subnet_cidrs  = ["10.0.20.0/24", "10.0.21.0/24"]
single_nat_gateway       = true

# EKS
eks_cluster_version     = "1.36"
eks_node_instance_types = ["t3.small"]
eks_node_desired_size   = 2
eks_node_min_size       = 2
eks_node_max_size       = 4
eks_node_capacity_type  = "ON_DEMAND"



# RDS
rds_engine_version      = "18.6"
rds_instance_class      = "db.t3.small"
rds_allocated_storage   = 20
rds_multi_az            = true
rds_db_name             = "smartPalikaDev"
rds_db_username         = "root"
rds_deletion_protection = true


#EKS-addons
eks_helm_metrics_server_repository = "https://kubernetes-sigs.github.io/metrics-server/"
eks_helm_metrics_server_chart      = "metrics-server"
eks_helm_metrics_server_version    = "3.13.1"

eks_helm_cluster_autoscaler_repository = "https://kubernetes.github.io/autoscaler"
eks_helm_cluster_autoscaler_chart      = "cluster-autoscaler"
eks_helm_cluster_autoscaler_version    = "9.59.0"

eks_helm_aws_lbc_repository = "https://aws.github.io/eks-charts"
eks_helm_aws_lbc_chart      = "aws-load-balancer-controller"
eks_helm_aws_lbc_version    = "3.4.3"

k8s_redis_url              = "redis://redis-service:6379"
k8s_jwt_secret             = "62ee96314e78f6319558bb75238f43b08faa2a8f4b1ffa69e9733e532eeb665b"
k8s_cron_secret            = "your_secure_cron_secret"
k8s_cloudinary_cloud_name  = "detqq6agd"
k8s_cloudinary_api_key     = "258312139365614"
k8s_cloudinary_api_secret  = "3OtId4uEixun-tr05BYwnnzNRvI"
k8s_email_user             = "smartpalika33@gmail.com"
k8s_email_pass             = "npzvocnldjnjczut"

# ElastiCache
# cache_engine         = "valkey"
# cache_engine_version = "7.2"
# cache_node_type      = "cache.t3.small"
# cache_num_nodes      = 2

# Route 53
domain_name        = "prasiddhabhattarai.com.np"
create_hosted_zone = false
app_record_name    = "www.prasiddhabhattarai.com.np"
alb_zone_id       = "Z35SXDOTRQ7X7K"
