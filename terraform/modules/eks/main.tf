locals {
  name = "${var.project_name}-${var.environment}"
}

# ---------------- Cluster IAM role ----------------
resource "aws_iam_role" "cluster" {
  name = "${local.name}-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "eks.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "cluster_policy" {
  role       = aws_iam_role.cluster.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

# ---------------- EKS Cluster ----------------
resource "aws_eks_cluster" "this" {
  name     = var.cluster_name
  role_arn = aws_iam_role.cluster.arn
  version  = var.cluster_version

  vpc_config {
    # Amazon EKS creates cross-account elastic network interfaces in these subnets to allow communication between your worker nodes and the Kubernetes control plane.
    # 
    subnet_ids              = var.private_subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  # access_config controls how people/users are allowed to access your EKS cluster.
  access_config {

    # authentication is handled through an API/IAM-based mechanism, rather than traditional username/password authentication.
    authentication_mode                         = "API"

    # Give the person/role that creates this EKS cluster administrator permissions automatically
    bootstrap_cluster_creator_admin_permissions = true
  }

  tags = {
    Name = local.name
  }

  depends_on = [aws_iam_role_policy_attachment.cluster_policy]
}

# ---------------- Node group IAM role ----------------
resource "aws_iam_role" "node" {
  name = "${local.name}-eks-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "node_worker" {
  role       = aws_iam_role.node.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

resource "aws_iam_role_policy_attachment" "node_cni" {
  role       = aws_iam_role.node.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
}

resource "aws_iam_role_policy_attachment" "node_ecr" {
  role       = aws_iam_role.node.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# ---------------- Managed Node Group ----------------
resource "aws_eks_node_group" "this" {
  cluster_name    = aws_eks_cluster.this.name
  node_group_name = "${local.name}-ng"
  node_role_arn   = aws_iam_role.node.arn
  subnet_ids      = var.private_subnet_ids

  # we haven't specified version.
  # The resulting node group will normally use the cluster's Kubernetes version.

  instance_types = var.node_instance_types
  capacity_type  = var.node_capacity_type

  # no. of worker_nodes(ec2_instances)
  scaling_config {
    desired_size = var.node_desired_size
    min_size     = var.node_min_size
    max_size     = var.node_max_size
  }

  update_config {
    max_unavailable = 1
  }

  tags = {
    Name = "${local.name}-ng"
  }

  depends_on = [
    aws_iam_role_policy_attachment.node_worker,
    aws_iam_role_policy_attachment.node_cni,
    aws_iam_role_policy_attachment.node_ecr,
  ]

  # cluster-auto-scaler might change it so, we ignore
  lifecycle {
    ignore_changes = [scaling_config[0].desired_size]
  }
}

# ---------------- default Security Group --------------

# When you create an aws_eks_cluster, AWS provisions a security group behind the scenes called the cluster security group
# 
# Its original purpose is to allow the control plane and worker nodes to communicate with each other (kubelet ↔ API server, etc.).
# 
# Since our aws_eks_node_group doesn't specify a custom launch template with its own security groups, 
# EKS attaches that same cluster security group to the worker nodes' ENIs by default.
# 
#  That same SG is passed to ingress of rds and elasticache sg.