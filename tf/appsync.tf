module "appsync" {
  source              = "terraform-aws-modules/appsync/aws"
  name                = var.name
  schema              = file("../appsync/schema.graphql")
  authentication_type = "API_KEY"

  api_keys = {
    default = "2023-11-11T00:00:00Z"
  }

  additional_authentication_provider = {
    user_pool = {
      authentication_type = "AMAZON_COGNITO_USER_POOLS"

      user_pool_config = {
        user_pool_id = aws_cognito_user_pool.pool.id
      }
    }
  }

  datasources = {
    "none" = {
      type = "NONE"
    }
  }

  resolvers = {
    "Query.getUser" = {
      data_source       = "none"
      request_template  = file("../appsync/getUser.req.vtl")
      response_template = file("../appsync/getUser.res.vtl")
    }
  }
}
