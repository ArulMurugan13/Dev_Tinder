
## Authentication
- POST - /signup
- POST - /login
- POST - /logout
- POST - /forgot password

## Profile
- GET - /profile/view
- PATCH - /profile/edit
- PATCH - /profile/ updatepassword

## connection request
- POST - /request/send/:status/:userId
- POST - /request/review/:status/:userId

## User

- GET -/user/requested
- GET - /user/connections

## Deployment in AWS

- create an EC2 instance 
    - select ubuntu - create key pair --> gives a pem file 
    - connect to instance
        - chmod 400 "Dev-Tinder-Secret.pem"
        - ssh -i "Dev-Tinder-Secret.pem" ubuntu@ec2-13-233-58-195.ap-south-1.compute.amazonaws.com
