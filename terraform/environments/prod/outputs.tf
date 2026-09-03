output "vpc_id" {
  value = module.vpc.vpc_id
}

output "eks_cluster_name" {
  value = module.eks.cluster_name
}

output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "eks_cluster_security_group_id" {
  value = module.eks.cluster_security_group_id
}

output "eks_alb_dns_name" {
  value = module.eks-addons.frontend_alb_dns_name
}

# output "rds_endpoint" {
#   value = module.rds.db_endpoint
# }

# output "rds_master_user_secret_arn" {
#   description = "Secrets Manager ARN with the generated RDS master password"
#   value       = module.rds.master_user_secret_arn
# }

# output "cache_primary_endpoint" {
#   value = module.elasticache.primary_endpoint_address
# }

output "app_url" {
  value = "https://${module.route53.record_fqdn}"
}

# output "route53_name_servers" {
#   description = "Only populated when create_hosted_zone = true; delegate your registrar to these"
#   value       = module.route53.name_servers
# }
