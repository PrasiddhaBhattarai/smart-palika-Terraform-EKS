locals {
  name = "${var.project_name}-${var.environment}"
}

resource "aws_elasticache_subnet_group" "this" {
  name       = "${local.name}-cache-subnet-group"
  subnet_ids = var.private_db_subnet_ids
}

resource "aws_security_group" "cache" {
  name        = "${local.name}-cache-sg"
  description = "Allow Redis/Valkey access from EKS nodes only"
  vpc_id      = var.vpc_id

  ingress {
    description     = "Redis/Valkey from EKS"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [var.allowed_security_group_id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${local.name}-cache-sg"
  }
}

resource "aws_elasticache_replication_group" "this" {
  replication_group_id = "${local.name}-cache"
  description           = "Redis/Valkey replication group for ${local.name}"

  engine         = var.engine
  engine_version = var.engine_version
  node_type      = var.node_type
  port           = 6379

  num_cache_clusters = var.num_cache_clusters

  subnet_group_name = aws_elasticache_subnet_group.this.name
  security_group_ids = [aws_security_group.cache.id]

  automatic_failover_enabled = var.automatic_failover_enabled
  multi_az_enabled           = var.automatic_failover_enabled

  at_rest_encryption_enabled = var.at_rest_encryption_enabled
  transit_encryption_enabled = var.transit_encryption_enabled

  apply_immediately = false

  tags = {
    Name = "${local.name}-cache"
  }
}
