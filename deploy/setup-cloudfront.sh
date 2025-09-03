#!/bin/bash

# Setup CloudFront distribution for EV Charging Platform
set -e

echo "🌐 Setting up CloudFront distribution..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BUCKET_NAME="dev.codibly.com"
PROJECT_PREFIX="ev-charging-platform"
DOMAIN_NAME="ev-charging-platform.dev.codibly.com"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "   S3 Bucket: ${BUCKET_NAME}"
echo "   Project Path: /${PROJECT_PREFIX}"
echo "   Domain: ${DOMAIN_NAME}"

# Step 1: Create CloudFront distribution
echo -e "\n${YELLOW}☁️  Creating CloudFront distribution...${NC}"

DISTRIBUTION_CONFIG='{
  "CallerReference": "ev-charging-platform-'$(date +%s)'",
  "Aliases": {
    "Quantity": 1,
    "Items": ["'${DOMAIN_NAME}'"]
  },
  "DefaultRootObject": "index.html",
  "Comment": "EV Charging Platform - Codibly Demo",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "ev-charging-s3-origin",
        "DomainName": "'${BUCKET_NAME}'.s3.amazonaws.com",
        "OriginPath": "/'${PROJECT_PREFIX}'",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "https-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "ev-charging-s3-origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "Compress": true
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      },
      {
        "ErrorCode": 403,
        "ResponsePagePath": "/index.html", 
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  "PriceClass": "PriceClass_100",
  "ViewerCertificate": {
    "CloudFrontDefaultCertificate": true
  }
}'

# Create the distribution
echo "$DISTRIBUTION_CONFIG" > /tmp/cf-config.json

aws cloudfront create-distribution \
  --distribution-config file:///tmp/cf-config.json \
  --output table \
  --query 'Distribution.{ID:Id,DomainName:DomainName,Status:Status}' || {
  
  echo -e "${RED}❌ Failed to create CloudFront distribution${NC}"
  echo -e "${BLUE}💡 Manual steps:${NC}"
  echo "1. Go to AWS CloudFront console: https://console.aws.amazon.com/cloudfront/"
  echo "2. Create new distribution"
  echo "3. Origin: ${BUCKET_NAME}.s3.amazonaws.com/${PROJECT_PREFIX}"
  echo "4. Origin path: /${PROJECT_PREFIX}"
  echo "5. Viewer protocol: Redirect HTTP to HTTPS"
  echo "6. Alternate domain name: ${DOMAIN_NAME}"
  echo "7. Default root object: index.html"
  exit 1
}

echo -e "${GREEN}✅ CloudFront distribution created!${NC}"

echo -e "\n${YELLOW}📝 Next steps:${NC}"
echo "1. Wait for distribution to deploy (10-15 minutes)"
echo "2. Set up SSL certificate for ${DOMAIN_NAME}"
echo "3. Configure DNS CNAME record"
echo "4. Test the deployment"

echo -e "\n${BLUE}📊 To check distribution status:${NC}"
echo "aws cloudfront list-distributions --query 'DistributionList.Items[?Comment==\`EV Charging Platform - Codibly Demo\`]'"

rm -f /tmp/cf-config.json