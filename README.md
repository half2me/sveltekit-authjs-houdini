# Live demo

Check out the demo site at https://sveltekit-authjs-houdini.pages.dev You can login with the testuser credentials in `cognito.tf`

# setup your own environment

Navigate to the `tf` directory and run these commands to setup the environment on AWS

```
terraform init
terraform apply
terraform output > ../.env
```

This will also create the test user, you can see the credentials at the end of `tf/cognito.tf`

Install the dependencies with: `npm i`
You can now run the site in development mode with `npm run dev`
