# Either create a brand-new public hosted zone, or look up an existing one.
# resource "aws_route53_zone" "this" {
#   count = var.create_zone ? 1 : 0
#   name  = var.domain_name

#   tags = {
#     Name = var.domain_name
#   }
# }

data "aws_route53_zone" "existing" {
  # count        = var.create_zone ? 0 : 1
  name         = var.domain_name
  # private_zone = false
}

locals {
  # zone_id = var.create_zone ? aws_route53_zone.this[0].zone_id : data.aws_route53_zone.existing[0].zone_id
  zone_id = data.aws_route53_zone.existing.zone_id
}

# Alias record pointing the app hostname at the ALB
resource "aws_route53_record" "app" {
  zone_id = var.zone_id
  name    = var.record_name
  type    = "A"

  alias {
    name                   = var.alb_dns_name
    zone_id                = var.alb_zone_id
    evaluate_target_health = true
  }
}
