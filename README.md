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