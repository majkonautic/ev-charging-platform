#!/bin/bash

# Deploy EV Charging Platform to S3
# Usage: ./deploy-to-s3.sh

set -e

echo "🚗 Deploying EV Charging Platform to S3..."

# Configuration
BUCKET_NAME="dev.codibly.com"
PROJECT_PREFIX="ev-charging-platform"
REGION="us-east-1"
PROFILE="default"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📁 Preparing deployment files...${NC}"

# Create deployment directory structure
mkdir -p deploy/s3-upload

# Copy static files
echo "Copying static files..."
cp -r static/* deploy/s3-upload/

# Add configuration
cp config.js deploy/s3-upload/js/config.js

echo -e "${GREEN}✅ Files prepared for deployment${NC}"

echo -e "${YELLOW}☁️  Uploading to S3...${NC}"

# Upload HTML files with proper content-type
aws s3 cp deploy/s3-upload/ s3://${BUCKET_NAME}/${PROJECT_PREFIX}/ \
  --recursive \
  --content-type "text/html" \
  --exclude "*" \
  --include "*.html" \
  --region ${REGION} \
  --profile ${PROFILE}

# Upload CSS files
aws s3 cp deploy/s3-upload/ s3://${BUCKET_NAME}/${PROJECT_PREFIX}/ \
  --recursive \
  --content-type "text/css" \
  --exclude "*" \
  --include "*.css" \
  --region ${REGION} \
  --profile ${PROFILE}

# Upload JavaScript files
aws s3 cp deploy/s3-upload/ s3://${BUCKET_NAME}/${PROJECT_PREFIX}/ \
  --recursive \
  --content-type "application/javascript" \
  --exclude "*" \
  --include "*.js" \
  --region ${REGION} \
  --profile ${PROFILE}

# Upload image files
aws s3 cp deploy/s3-upload/ s3://${BUCKET_NAME}/${PROJECT_PREFIX}/ \
  --recursive \
  --content-type "image/png" \
  --exclude "*" \
  --include "*.png" \
  --region ${REGION} \
  --profile ${PROFILE}

# Upload any other files
aws s3 cp deploy/s3-upload/ s3://${BUCKET_NAME}/${PROJECT_PREFIX}/ \
  --recursive \
  --exclude "*.html" \
  --exclude "*.css" \
  --exclude "*.js" \
  --exclude "*.png" \
  --region ${REGION} \
  --profile ${PROFILE}

echo -e "${GREEN}✅ Upload complete!${NC}"

echo -e "${YELLOW}🌐 Setting up bucket website configuration...${NC}"

# Configure bucket for static website hosting (if not already configured)
aws s3 website s3://${BUCKET_NAME} \
  --index-document index.html \
  --error-document error.html \
  --region ${REGION} \
  --profile ${PROFILE} 2>/dev/null || echo "Website configuration may already exist"

echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo -e "🔗 Static files available at: ${YELLOW}https://${BUCKET_NAME}/${PROJECT_PREFIX}/index.html${NC}"

echo -e "\n${YELLOW}Next steps:${NC}"
echo "1. Configure CloudFront distribution"
echo "2. Set up SSL certificate"
echo "3. Configure DNS for ev-charging-platform.dev.codibly.com"