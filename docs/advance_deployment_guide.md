To ensure best security practices and to have a 99.9999% uptime, we can have a multiple availability zone setup.
Suppose if 1 AZ goes down then the NLB (network load balancer) is going to channel the traffic to another AZ.
This type of deployment is called as active-active or active-standby deployment. 


We could have a blue green deployment strategy too which could be incorporated to have a very minimal downtime if something goes wrong. 
To enhance security, we can have OIDC connection on a self-hosted github runners which would be faster, more reliable and provide better secruity aspects. 

Employ the use of Tags for deployment because in an auto-scaling mode we cannot target a single instance, for that we will have to target the tags as shown in the image attached in the docs/aws_architecture.jpg file.