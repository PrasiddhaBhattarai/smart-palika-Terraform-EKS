variable "project_name" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "private_db_subnet_ids" {
  type = list(string)
}

variable "allowed_security_group_id" {
  description = "Security group ID (e.g. EKS cluster/node SG) allowed to reach Redis/Valkey on 6379"
  type        = string
}

variable "engine" {
  description = "redis or valkey"
  type        = string
  default     = "valkey"
}

variable "engine_version" {
  type    = string
  default = "7.2"
}

variable "node_type" {
  type    = string
  default = "cache.t3.medium"
}

variable "num_cache_clusters" {
  description = "Number of nodes: 1 primary + N-1 replicas"
  type        = number
  default     = 2
}

variable "automatic_failover_enabled" {
  type    = bool
  default = true
}

variable "at_rest_encryption_enabled" {
  type    = bool
  default = true
}

variable "transit_encryption_enabled" {
  type    = bool
  default = true
}
