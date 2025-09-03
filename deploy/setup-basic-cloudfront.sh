#!/bin/bash

# Setup basic CloudFront distribution (without custom domain)
set -e

echo "🌐 Setting up basic CloudFront distribution..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BUCKET_NAME="dev.codibly.com"
PROJECT_PREFIX="ev-charging-platform"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "   S3 Bucket: ${BUCKET_NAME}"
echo "   Project Path: /${PROJECT_PREFIX}"

# Step 1: Create basic CloudFront distribution (no custom domain)
echo -e "\n${YELLOW}☁️  Creating basic CloudFront distribution...${NC}"

DISTRIBUTION_CONFIG='{
  "CallerReference": "ev-charging-basic-'$(date +%s)'",
  "DefaultRootObject": "index.html",
  "Comment": "EV Charging Platform - Codibly Demo (Basic)",
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
echo "$DISTRIBUTION_CONFIG" > /tmp/cf-basic-config.json

RESULT=$(aws cloudfront create-distribution \
  --distribution-config file:///tmp/cf-basic-config.json \
  --output json 2>/dev/null) || {
  
  echo -e "${RED}❌ Failed to create CloudFront distribution${NC}"
  exit 1
}

# Extract distribution info
DISTRIBUTION_ID=$(echo "$RESULT" | grep -o '"Id": "[^"]*"' | head -1 | sed 's/"Id": "\([^"]*\)"/\1/')
DOMAIN_NAME=$(echo "$RESULT" | grep -o '"DomainName": "[^"]*"' | head -1 | sed 's/"DomainName": "\([^"]*\)"/\1/')

echo -e "${GREEN}✅ CloudFront distribution created!${NC}"
echo -e "   ${YELLOW}Distribution ID:${NC} ${DISTRIBUTION_ID}"
echo -e "   ${YELLOW}CloudFront URL:${NC} https://${DOMAIN_NAME}"

# Save distribution info
echo "DISTRIBUTION_ID=${DISTRIBUTION_ID}" > cloudfront-info.env
echo "CLOUDFRONT_DOMAIN=${DOMAIN_NAME}" >> cloudfront-info.env

echo -e "\n${YELLOW}🌐 Your EV Charging Platform is now available at:${NC}"
echo -e "   ${GREEN}https://${DOMAIN_NAME}${NC}"

echo -e "\n${YELLOW}📝 Next steps for custom domain:${NC}"
echo "1. Create SSL certificate in AWS Certificate Manager"
echo "2. Update distribution to use custom domain + SSL"
echo "3. Configure DNS CNAME record"

echo -e "\n${BLUE}📊 To check distribution status:${NC}"
echo "aws cloudfront get-distribution --id ${DISTRIBUTION_ID} --query 'Distribution.Status'"

rm -f /tmp/cf-basic-config.json
echo -e "${GREEN}🎉 Setup complete!${NC}"