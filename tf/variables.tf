variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-2"
}
variable "name" {
  description = "Name of the project"
  type        = string
}
variable "google_app_id" {
  type = string
}
variable "google_app_secret" {
  type      = string
  sensitive = true
}