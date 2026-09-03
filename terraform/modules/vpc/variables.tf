variable "project_name" {
  description = "Project/name prefix used for tagging resources"
  type        = string
}

variable "environment" {
  description = "Environment name (e.g. dev, staging, prod)"
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "azs" {
  description = "List of 2 availability zones to deploy into"
  type        = list(string)
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets, one per AZ"
  type        = list(string)
}

variable "private_app_subnet_cidrs" {
  description = "CIDR blocks for private app (EKS) subnets, one per AZ"
  type        = list(string)
}

variable "private_db_subnet_cidrs" {
  description = "CIDR blocks for private db subnets, one per AZ"
  type        = list(string)
}

variable "eks_cluster_name" {
  description = "Name of the EKS cluster, used for subnet discovery tags"
  type        = string
}

variable "single_nat_gateway" {
  description = "If true, use a single shared NAT Gateway instead of one per AZ (cheaper, less resilient)"
  type        = bool
  default     = false
}
