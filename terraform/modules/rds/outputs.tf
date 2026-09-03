output "db_instance_id" {
  value = aws_db_instance.this.id
}

output "db_endpoint" {
  description = "Connection endpoint (host:port)"
  value       = aws_db_instance.this.endpoint
}

output "db_address" {
  description = "Hostname only"
  value       = aws_db_instance.this.address
}

output "db_port" {
  value = aws_db_instance.this.port
}

output "db_name" {
  value = aws_db_instance.this.db_name
}

output "master_user_secret_arn" {
  description = "Secrets Manager ARN holding the generated master password"
  value       = aws_db_instance.this.master_user_secret[0].secret_arn
}

output "db_username" {
  description = "Database master username"
  value       = aws_db_instance.this.username
}

output "security_group_id" {
  value = aws_security_group.rds.id
}
