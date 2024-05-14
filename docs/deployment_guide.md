# NestJS Application Deployment Guide

This guide will help you deploy your NestJS application using GitHub Actions. Follow the steps below to ensure a smooth deployment process.

## Prerequisites

1. Node.js installed
2. GitHub Actions set up in your repository
3. Newman installed for running Postman collections ( we can write our health scripts which would throw error if some APIs are not working)
4. Slack or Teams webhook URL for notifications (optional, after successful run, we can send the notification to the teams channel)
5. AWS CLI configured with access to S3 and EC2 (the AWS access keys and creds can be a part of secrets of GithubActions, if we need more security then we can employ the use of OIDC connection to github actions. Alternatively, we can use our self-hosted runners too...)
6. PM2 installed on the EC2 instance ( to run a deamon on the server to run our build )
7. Nginx installed and configured on the EC2 instance ( reverse proxy to serve our localhost:3000 apis to port 80. We have to write the forwarding rules for it )

## GitHub Actions Workflow

### 1. Basic Linting, Formatting, and Security Checks

- Set up GitHub Actions to run ESLint, Prettier, and Snyk checks.( these workflow becomes a required step to merge any PRs to the master/main branch )
- Ensure that all these checks pass before proceeding to the next steps.

### 2. Deploy to Development Environment

- Build your project and create a zip file of the build artifacts.
- Upload this zip file to an S3 bucket, including the PR number and date in the filename.
- Use AWS Systems Manager to send this zip file to the EC2 instance. (since we do have access to s3 and ec2 instances via tags, we will be able to do this step)
- Unzip the file on the EC2 instance and restart the PM2 process. (using SSM documents, this could be easily be achievable)

### 3. End-to-End Testing with Newman

- After deployment to the development environment, run your end-to-end tests using Newman.
- If the tests fail, send notifications to Slack or Teams.

### 4. Branch Protection Rules

- Set up branch protection rules in GitHub to ensure that only authorized reviewers can push code to the production branch.
- Require pull request reviews before merging.
- Specify the reviewers who are allowed to approve and merge pull requests.

### 5. Creating a Release Document

- After a successful deployment to production, create a release document.
- Document the changes, new features, and any other relevant information about the release.
