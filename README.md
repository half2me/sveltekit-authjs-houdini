# setup

Navigate to the `tf` directory and run these commands to setup the environment on AWS

```
terraform init
terraform apply
terraform output > ../.env
```

This will also create a test user, you can see the credentials at the end of `tf/cognito.tf`
