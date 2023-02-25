resource "random_password" "authjs_secret" {
  length = 16
}

output "AWS_COGNITO_USER_POOL_ID" {
  value = aws_cognito_user_pool.pool.id
}

output "AWS_COGNITO_USER_POOL_CLIENT_ID" {
  value = aws_cognito_user_pool_client.client.id
}

output "AWS_COGNITO_USER_POOL_CLIENT_SECRET" {
  value = nonsensitive(aws_cognito_user_pool_client.client.client_secret)
}

output "AWS_COGNITO_DOMAIN" {
  value = aws_cognito_user_pool_domain.domain.domain
}

output "AUTH_SECRET" {
  value = nonsensitive(random_password.authjs_secret.result)
}

output "PUBLIC_AWS_APPSYNC_API_KEY" {
  value = nonsensitive(module.appsync.appsync_api_key_key["default"])
}

output "PUBLIC_AWS_APPSYNC_ENDPOINT" {
  value = module.appsync.appsync_graphql_api_uris["GRAPHQL"]
}

output "PUBLIC_AWS_APPSYNC_WS_ENDPOINT" {
  value = module.appsync.appsync_graphql_api_uris["REALTIME"]
}