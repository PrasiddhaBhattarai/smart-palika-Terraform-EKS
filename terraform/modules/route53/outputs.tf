output "zone_id" {
  value = local.zone_id
}

output "record_fqdn" {
  value = aws_route53_record.app.fqdn
}

# output "name_servers" {
#   description = "Name servers for the zone, only populated when create_zone = true"
#   value       = var.create_zone ? aws_route53_zone.this[0].name_servers : []
# }
