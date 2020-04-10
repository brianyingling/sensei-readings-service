# sensei-readings-service

## CI/CD
CircleCI handles deployment to the Kubernetes cluster

## Credentials
Note that AWS credentials are base64-encoded so if you change the credentials in AWS, be sure to run this command:

`echo -n <AWS KEY HERE> | base64`

Save the encoded key in the place where they are accessed.