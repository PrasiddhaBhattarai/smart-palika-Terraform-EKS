output "frontend_alb_dns_name" {
  value = data.kubernetes_ingress_v1.frontend.status[0].load_balancer[0].ingress[0].hostname
}