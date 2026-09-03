# Terraform knows which provider a resource belongs to based on the resource type.
# 
# aws_* resources → use the aws provider
# eg: aws-s3_bucket
# helm_* resources → use the helm provider
# eg: helm_release

# But if same provider twice, use alias
# eg: two "aws" providers each for distinct region

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      "Creator"     = var.creator
      "Batch"       = var.batch
      "Project"     = var.project_name
      "Environment" = var.environment
      "ManagedBy"   = "terraform"
    }
  }
}

data "aws_eks_cluster_auth" "eks" {
  name = module.eks.cluster_name

  depends_on = [module.eks]

}

# data "aws_eks_cluster" "eks" {
#   name = module.eks.cluster_name
# }

provider "helm" {
  kubernetes = {
    host                   = module.eks.cluster_endpoint
    cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
    token                  = data.aws_eks_cluster_auth.eks.token
  }
}

provider "kubectl" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  token                  = data.aws_eks_cluster_auth.eks.token
  load_config_file       = false
}

provider "kubernetes" {
  host                   = module.eks.cluster_endpoint
  cluster_ca_certificate = base64decode(module.eks.cluster_certificate_authority_data)
  token                  = data.aws_eks_cluster_auth.eks.token
}

# host: EKS Kubernetes API server endpoint
# cluster_ca_certificate:	Allows Terraform to verify the EKS API server, its public CA certificate
# token:	Authenticates Terraform to Kubernetes
