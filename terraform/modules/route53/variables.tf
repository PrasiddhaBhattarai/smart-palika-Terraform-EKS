variable "domain_name" {
  description = "Root domain name for the hosted zone (e.g. example.com)"
  type        = string
}

variable "create_zone" {
  description = "If true, create a new hosted zone. If false, look up an existing one by domain_name."
  type        = bool
  default     = false
}

variable "record_name" {
  description = "Fully qualified record name to create (e.g. app.example.com)"
  type        = string
}

variable "alb_dns_name" {
  type = string
}

# variable "alb_zone_id" {
#   type = string
# }

variable "zone_id" {
  type = string
}

variable "alb_zone_id" {
  type = string
  default = "Z35SXDOTRQ7X7K"
}