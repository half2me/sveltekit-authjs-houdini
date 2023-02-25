provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      project = var.name
    }
  }
}