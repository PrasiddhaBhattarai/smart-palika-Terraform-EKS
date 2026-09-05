locals {
  cluster_name = "${var.project_name}-${var.environment}"
}

module "vpc" {
  source = "../../modules/vpc"

  project_name             = var.project_name
  environment              = var.environment
  vpc_cidr                 = var.vpc_cidr
  azs                      = var.azs
  public_subnet_cidrs      = var.public_subnet_cidrs
  private_app_subnet_cidrs = var.private_app_subnet_cidrs
  private_db_subnet_cidrs  = var.private_db_subnet_cidrs
  eks_cluster_name         = local.cluster_name
  single_nat_gateway       = var.single_nat_gateway
}

# we have null_resource.ingress_cleanup in module/eks-addons/k8s_apply.tf
# it cleans ingress and resources created by ingress (alb, alb's sg, alb's eni)
# but it couldn't delete one of the sg
# as a result terraform couldn'd destroy vpc
# so we handle the sg deletion here
resource "null_resource" "post_eks_ingress_sg_cleanup" {
  triggers = {
    aws_region = var.aws_region
    vpc_id     = module.vpc.vpc_id
  }

  provisioner "local-exec" {
    when = destroy

    command = <<-EOT
      echo "Post-EKS-destroy: cleaning up any remaining k8s-* security groups..."
      for attempt in 1 2 3 4 5; do
        SG_IDS=$(aws ec2 describe-security-groups \
          --region ${self.triggers.aws_region} \
          --filters "Name=vpc-id,Values=${self.triggers.vpc_id}" \
          --query "SecurityGroups[?starts_with(GroupName, 'k8s-')].GroupId" \
          --output text 2>/dev/null || echo "")

        if [ -z "$SG_IDS" ]; then
          echo "No remaining k8s-* security groups."
          break
        fi

        for sg in $SG_IDS; do
          if aws ec2 delete-security-group --region ${self.triggers.aws_region} --group-id "$sg" 2>/dev/null; then
            echo "Deleted $sg"
          else
            echo "$sg still blocked (attempt $attempt/5)"
          fi
        done
        sleep 15
      done
    EOT
  }

  depends_on = [module.vpc]
}

module "eks" {
  source = "../../modules/eks"

  aws_region = var.aws_region

  project_name        = var.project_name
  environment         = var.environment
  cluster_name        = local.cluster_name
  cluster_version     = var.eks_cluster_version
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_app_subnet_ids
  public_subnet_ids   = module.vpc.public_subnet_ids
  node_instance_types = var.eks_node_instance_types
  node_desired_size   = var.eks_node_desired_size
  node_min_size       = var.eks_node_min_size
  node_max_size       = var.eks_node_max_size
  node_capacity_type  = var.eks_node_capacity_type
}

module "rds" {
  source = "../../modules/rds"

  project_name              = var.project_name
  environment               = var.environment
  vpc_id                    = module.vpc.vpc_id
  private_db_subnet_ids     = module.vpc.private_db_subnet_ids
  allowed_security_group_id = module.eks.cluster_security_group_id
  engine_version            = var.rds_engine_version
  instance_class            = var.rds_instance_class
  allocated_storage         = var.rds_allocated_storage
  db_name                   = var.rds_db_name
  db_username               = var.rds_db_username
  multi_az                  = var.rds_multi_az
  deletion_protection       = var.rds_deletion_protection

  depends_on = [module.eks]
}

module "eks-addons" {
  source = "../../modules/eks-addons"

  aws_region      = var.aws_region
  project_name    = var.project_name
  environment     = var.environment
  cluster_version = var.eks_cluster_version
  vpc_id          = module.vpc.vpc_id

  eks_cluster_name = module.eks.cluster_name

  helm_metrics_server_repository = var.eks_helm_metrics_server_repository
  helm_metrics_server_chart      = var.eks_helm_metrics_server_chart
  helm_metrics_server_version    = var.eks_helm_metrics_server_version

  helm_cluster_autoscaler_repository = var.eks_helm_cluster_autoscaler_repository
  helm_cluster_autoscaler_chart      = var.eks_helm_cluster_autoscaler_chart
  helm_cluster_autoscaler_version    = var.eks_helm_cluster_autoscaler_version


  k8s_redis_url             = var.k8s_redis_url
  k8s_jwt_secret            = var.k8s_jwt_secret
  k8s_cron_secret           = var.k8s_cron_secret
  k8s_cloudinary_cloud_name = var.k8s_cloudinary_cloud_name
  k8s_cloudinary_api_key    = var.k8s_cloudinary_api_key
  k8s_cloudinary_api_secret = var.k8s_cloudinary_api_secret
  k8s_email_user            = var.k8s_email_user
  k8s_email_pass            = var.k8s_email_pass



  db_address    = module.rds.db_address
  db_port       = module.rds.db_port
  db_name       = module.rds.db_name
  db_username   = module.rds.db_username
  db_secret_arn = module.rds.master_user_secret_arn

  depends_on = [module.eks, module.rds]
}

# module "elasticache" {
#   source = "../../modules/elasticache"

#   project_name               = var.project_name
#   environment                 = var.environment
#   vpc_id                      = module.vpc.vpc_id
#   private_db_subnet_ids       = module.vpc.private_db_subnet_ids
#   allowed_security_group_id   = module.eks.cluster_security_group_id
#   engine                       = var.cache_engine
#   engine_version               = var.cache_engine_version
#   node_type                    = var.cache_node_type
#   num_cache_clusters           = var.cache_num_nodes
# }

data "aws_route53_zone" "my_domain" {
  name = var.domain_name
}

module "route53" {
  source = "../../modules/route53"

  domain_name  = var.domain_name
  create_zone  = var.create_hosted_zone
  zone_id      = data.aws_route53_zone.my_domain.zone_id
  record_name  = var.app_record_name
  alb_dns_name = module.eks-addons.frontend_alb_dns_name
  alb_zone_id  = var.alb_zone_id

  depends_on = [module.eks-addons]
}
