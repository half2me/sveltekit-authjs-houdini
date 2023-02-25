resource "aws_cognito_user_pool" "pool" {
  name                     = var.name
  mfa_configuration        = "OFF"
  auto_verified_attributes = ["email"]
  username_attributes      = ["email"]

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  schema {
    name                     = "email"
    attribute_data_type      = "String"
    developer_only_attribute = false
    mutable                  = true
    required                 = true

    string_attribute_constraints {
      max_length = "2048"
      min_length = "0"
    }
  }

  password_policy {
    minimum_length                   = 8
    require_lowercase                = false
    require_numbers                  = false
    require_symbols                  = false
    require_uppercase                = false
    temporary_password_validity_days = 7
  }
}

resource "aws_cognito_user_pool_domain" "domain" {
  user_pool_id = aws_cognito_user_pool.pool.id
  domain       = var.name
}

resource "aws_cognito_user_pool_client" "client" {
  name         = var.name
  user_pool_id = aws_cognito_user_pool.pool.id

  id_token_validity      = 5 # deliberately set to the lowest value for testing
  access_token_validity  = 5 # deliberately set to the lowest value for testing
  refresh_token_validity = 365

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }

  prevent_user_existence_errors = "ENABLED"

  generate_secret                      = true
  enable_token_revocation              = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_scopes = [
    "aws.cognito.signin.user.admin",
    "email",
    "openid",
    "profile",
  ]

  supported_identity_providers = ["COGNITO"]
  callback_urls = [
    "http://localhost:5173/auth/callback/cognito",
  ]
  logout_urls = [
    "http://localhost:5173/auth/logout",
  ]
}

resource "aws_cognito_identity_pool" "pool" {
  allow_classic_flow               = false
  allow_unauthenticated_identities = true
  identity_pool_name               = var.name

  cognito_identity_providers {
    client_id               = aws_cognito_user_pool_client.client.id
    provider_name           = aws_cognito_user_pool.pool.endpoint
    server_side_token_check = false
  }
}

resource "aws_cognito_identity_pool_roles_attachment" "roles" {
  identity_pool_id = aws_cognito_identity_pool.pool.id

  roles = {
    "authenticated" = aws_iam_role.authenticated.arn
  }
}

resource "aws_iam_role_policy" "authenticated" {
  name   = "${var.name}-authenticated"
  role   = aws_iam_role.authenticated.id
  policy = data.aws_iam_policy_document.authenticated.json
}

resource "aws_iam_role" "authenticated" {
  name = "${var.name}-authenticated"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "cognito-identity.amazonaws.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "cognito-identity.amazonaws.com:aud": "${aws_cognito_identity_pool.pool.id}"
        },
        "ForAnyValue:StringLike": {
          "cognito-identity.amazonaws.com:amr": "authenticated"
        }
      }
    }
  ]
}
EOF
}

data "aws_iam_policy_document" "authenticated" {
  version = "2012-10-17"
  statement {
    actions = [
      "appsync:GraphQL"
    ]

    effect = "Allow"

    resources = ["${module.appsync.appsync_graphql_api_arn}/types/*"]
  }
}

resource "aws_cognito_user" "testuser" {
  user_pool_id             = aws_cognito_user_pool.pool.id
  username                 = "testuser@gmail.com"
  password                 = "testpassword"
  message_action           = "SUPPRESS"
  desired_delivery_mediums = ["EMAIL"]

  attributes = {
    email          = "testuser@gmail.com"
    email_verified = true
  }
}