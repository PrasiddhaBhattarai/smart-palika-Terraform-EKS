## Terraform

## Terraform apply
``` bash
cd terraform/
terraform init -backend-config=../../backend/dev.tfbackend
terraform fmt
terraform validate
terraform plan -out=tfplan
terraform apply --auto-approve tfplan
```
## Terraform delete
- ALB and other ALB-related-resources created by ingress aren't tracked by terraform
- So terraform can't delete it
- and due it, the deletion of VPC and IGW gets stuck
- Hence explitly delete it using null_resource in modules/eks-addons/k8s_apply.tf
``` bash
terraform destroy
```
## Terraform Infrastructure

This directory contains the Terraform configuration used to provision and manage the AWS and Kubernetes infrastructure for the **Smart Palika** project.

---

## Architecture Overview

```text
                         Terraform
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
              dev                       prod
                │                         │
                └────────────┬────────────┘
                             │
                             ▼
                     Reusable Modules
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
         VPC                EKS                RDS
                             │
                             ▼
                       EKS Addons
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
       Metrics Server   Cluster Autoscaler  AWS Load
                                             Balancer
                                             Controller
                             │
                             ▼
                     Kubernetes Workloads
                             │
                             ▼
                         Ingress
                             │
                             ▼
                       AWS ALB
                             │
                             ▼
                         Route53
```

---

## Directory Structure

```text
terraform/
├── README.md
│
├── backend/
│   ├── dev.tfbackend
│   └── prod.tfbackend
│
├── environments/
│   ├── dev/
│   │   ├── backend.tf
│   │   ├── bootstrap.tfplan
│   │   ├── main.tf
│   │   ├── outputs.tf
│   │   ├── providers.tf
│   │   ├── terraform.tfvars
│   │   ├── terraform.tfvars.example
│   │   ├── tfplan
│   │   ├── variables.tf
│   │   └── versions.tf
│   │
│   ├── prod/
│   │   ├── backend.tf
│   │   ├── main.tf
│   │   ├── outputs.tf
│   │   ├── providers.tf
│   │   ├── terraform.tfvars
│   │   ├── terraform.tfvars.example
│   │   ├── variables.tf
│   │   └── versions.tf
│
└── modules/
    ├── eks/
    │
    ├── eks-addons/
    │   ├── aws_lb_controller.tf
    │   ├── cluster_autoscaler.tf
    │   ├── iam/
    │   │   └── AWS_LB_Controller.json
    │   ├── k8s_apply.tf
    │   ├── metrics_server.tf
    │   ├── output.tf
    │   ├── values/
    │   │   └── metrics-server.yaml
    │   └── variables.tf
    │
    ├── rds/
    │
    ├── route53/
    │
    └── vpc/
```

---

## Project Structure

The Terraform configuration is divided into two main layers:

## Environments

Located at:

```text
terraform/environments/
├── dev/
└── prod/
```

Each environment is an independent Terraform root module.

Environment configurations are responsible for:

- Defining environment-specific variables
- Configuring Terraform providers
- Configuring the Terraform backend
- Instantiating reusable modules
- Connecting module outputs to module inputs
- Defining environment-specific infrastructure settings

# Provider Architecture

The Terraform configuration uses:

- AWS Provider
- Helm Provider
- Kubernetes Provider
- Kubectl Provider

The architecture is:

```text
                         Terraform
                             │
             ┌───────────────┼────────────────┐
             │               │                │
             ▼               ▼                ▼
            AWS             Helm          Kubernetes
             │               │                │
             ▼               ▼                ▼
       AWS Resources    Helm Charts     Kubernetes API
                                             │
                                             ▼
                                           EKS
                                             │
                                             ▼
                                          kubectl
```

---

# AWS Provider

The AWS provider manages resources such as:

- VPC
- EKS
- RDS
- Route53
- IAM
- EKS Addons
- EKS Pod Identity
- Security Groups
- AWS infrastructure required by the application

---

# Helm Provider

The Helm provider installs Kubernetes applications packaged as Helm charts.

Currently used for:

- Metrics Server
- Cluster Autoscaler
- AWS Load Balancer Controller

---

# Kubernetes Provider

The Kubernetes provider communicates with the Kubernetes API to manage Kubernetes resources.

---

# Kubectl Provider

The Kubectl provider applies raw Kubernetes YAML manifests from the project's `k8s/` directory.

---

## Modules

Located at:

```text
terraform/modules/
```

Modules contain reusable infrastructure definitions.

Current modules:

```text
modules/
├── vpc/
├── eks/
├── rds/
├── eks-addons/
└── route53/
```

The same modules are reused by both `dev` and `prod`.

---

## Environments

## Development

Location:

```text
terraform/environments/dev/
```

The development environment contains the Terraform configuration for development infrastructure.

## Production

Location:

```text
terraform/environments/prod/
```

The production environment contains the Terraform configuration for production infrastructure.

Each environment maintains its own Terraform state.

---

## backend
- have separate remote state files per environmets

---

## Terraform Apply Flow

The complete Terraform deployment can be summarized as:

```text
                         Terraform Apply
                                │
                                ▼
                         Create VPC
                                │
                                ▼
                         Create EKS
                                │
                                ▼
                       EKS Cluster Ready
                                │
                                ▼
                         Create RDS
                                │
                                ▼
                       Database Ready
                                │
                                ▼
                         EKS Addons
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
       Metrics Server    Cluster Autoscaler   AWS Load
                                              Balancer
                                              Controller
              │                 │                 │
              └─────────────────┼─────────────────┘
                                │
                                ▼
                    Kubernetes Application
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
          Namespace       ServiceAccount      Secrets
                                │
                                ▼
                         App Manifests
                                │
                                ▼
                             Ingress
                                │
                                ▼
                              AWS ALB
                                │
                                ▼
                            Route53
```

---

## Modules
| Module | Purpose |
| --- | --- |
| **vpc** | Creates the AWS **network infrastructure** — VPC, subnets, route tables, NAT/Internet gateways, etc. |
| **eks** | Creates the **Amazon EKS Kubernetes cluster**, including the control plane and worker/node configuration. |
| **eks-addons** | Installs and configures **Kubernetes add-ons** such as AWS Load Balancer Controller, Cluster Autoscaler, and Metrics Server. |
| **rds** | Creates and configures an **Amazon RDS database** for application data. |
| **elasticache** | Creates **ElastiCache** (typically Redis) for caching, sessions, or fast in-memory data. |
| **route53** | Manages **DNS records and hosted zones** using Amazon Route 53, e.g. mapping a domain to an application/load balancer. |

---

## EKS Addons Module

The `eks-addons` module is the most complex module in the infrastructure.

Location:

```text
terraform/modules/eks-addons/
```

It manages both AWS and Kubernetes resources.

The module manages:

- EKS Pod Identity Agent
- Metrics Server
- Cluster Autoscaler
- AWS Load Balancer Controller
- IAM roles
- IAM policies
- EKS Pod Identity associations
- Kubernetes namespace
- Kubernetes ServiceAccounts
- Kubernetes Secrets
- Kubernetes application manifests
- Kubernetes Ingress
- ALB readiness
- Ingress cleanup during Terraform destroy

---

## EKS Addons Architecture

```text
                         EKS Cluster
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              ▼               ▼                ▼
       Pod Identity       Helm Releases    Kubernetes
          Agent                                Resources
              │               │                │
              │        ┌──────┼──────┐         │
              │        │      │      │         │
              │        ▼      ▼      ▼         │
              │    Metrics  Cluster  AWS LBC   │
              │    Server   Autoscaler          │
              │                               │
              └───────────────┬───────────────┘
                              │
                              ▼
                     Application Workloads
                              │
                              ▼
                           Ingress
                              │
                              ▼
                         AWS ALB
```

---

## EKS Pod Identity

EKS Pod Identity allows Kubernetes workloads to access AWS services through IAM roles without storing AWS access keys inside containers.

The relationship is:

```text
Kubernetes Pod
      │
      ▼
Kubernetes ServiceAccount
      │
      ▼
EKS Pod Identity Association
      │
      ▼
IAM Role
      │
      ▼
AWS Service
```

This is used by:

- Cluster Autoscaler
- AWS Load Balancer Controller
- Backend application pods

---

## Metrics Server

File:

```text
modules/eks-addons/metrics_server.tf
```

Installation flow:

```text
Terraform
   │
   ▼
Helm Provider
   │
   ▼
Metrics Server Chart
   │
   ▼
kube-system Namespace
```

Metrics Server provides Kubernetes resource usage information.

---

## Cluster Autoscaler

File:

```text
modules/eks-addons/cluster_autoscaler.tf
```

Cluster Autoscaler automatically adjusts the number of EKS worker nodes according to workload requirements.

The basic flow is:

```text
Kubernetes Workload
        │
        ▼
Insufficient Node Capacity
        │
        ▼
Cluster Autoscaler
        │
        ▼
AWS Auto Scaling
        │
        ▼
EKS Node Group
        │
        ▼
Additional Capacity
```

The module configures:

- EKS Pod Identity Agent
- IAM role
- IAM policy
- IAM role-policy attachment
- EKS Pod Identity association
- Cluster Autoscaler Helm release

---

## AWS Load Balancer Controller

File:

```text
modules/eks-addons/aws_lb_controller.tf
```

The AWS Load Balancer Controller connects Kubernetes Ingress resources to AWS Application Load Balancers.

The traffic flow is:

```text
Kubernetes Ingress
       │
       ▼
AWS Load Balancer Controller
       │
       ▼
AWS Application Load Balancer
       │
       ▼
Kubernetes Service
       │
       ▼
Application Pods
```

The module creates:

- IAM role
- IAM policy
- IAM role-policy attachment
- EKS Pod Identity association
- Helm release

The IAM policy is stored at:

```text
modules/eks-addons/iam/AWS_LB_Controller.json
```

The Helm release configures:

```text
clusterName
serviceAccount.name
vpcId
```

The ServiceAccount is:

```text
aws-load-balancer-controller
```

---

## Applying Kubernetes Resources

File:

```text
modules/eks-addons/k8s_apply.tf
```

This module connects Terraform to the Kubernetes API and applies Kubernetes manifests.


# Common Commands

## Initialize Development

```bash
cd terraform/environments/dev

terraform init \
  -backend-config=../../backend/dev.tfbackend
```

## Initialize Production

```bash
cd terraform/environments/prod

terraform init \
  -backend-config=../../backend/prod.tfbackend
```

## Format

```bash
terraform fmt -recursive
```

## Validate

```bash
terraform validate
```

## Plan

```bash
terraform plan -out=tfplan
```

## Apply

```bash
terraform apply tfplan
```

## Destroy Plan

```bash
terraform plan -destroy -out=destroy.tfplan
```

## Destroy

```bash
terraform apply destroy.tfplan
```

---

# Infrastructure Summary

The Terraform configuration manages:

```text
AWS
│
├── VPC
│   ├── Public Subnets
│   ├── Private Application Subnets
│   ├── Private Database Subnets
│   └── NAT Gateway
│
├── EKS
│   ├── EKS Cluster
│   └── Worker Nodes
│
├── RDS
│   └── Application Database
│
├── IAM
│   ├── Cluster Autoscaler Role
│   ├── AWS Load Balancer Controller Role
│   └── Backend Pod Role
│
├── EKS Pod Identity
│
├── Route53
│
└── Application Load Balancer
```

Kubernetes resources:

```text
EKS
│
├── EKS Pod Identity Agent
│
├── Metrics Server
│
├── Cluster Autoscaler
│
├── AWS Load Balancer Controller
│
├── sm-app Namespace
│
├── Backend ServiceAccount
│
├── Backend Secret
│
├── Application Deployments
│
├── Services
│
└── Ingress
```

Terraform therefore manages both the **AWS infrastructure layer** and the **Kubernetes application infrastructure layer** as a single Infrastructure-as-Code workflow.