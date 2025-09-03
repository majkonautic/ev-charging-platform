#!/bin/bash

# CI/CD Deployment script for GitHub Actions
# This script is called by GitHub Actions workflow

set -e

echo "🚗 CI/CD Deployment: EV Charging Platform"

# Configuration from environment variables
BUCKET_NAME="${S3_BUCKET:-dev.codibly.com}"
PROJECT_PREFIX="ev-charging-platform"
REGION="${AWS_REGION:-us-east-1}"
DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "   S3 Bucket: ${BUCKET_NAME}"
echo "   Project Path: /${PROJECT_PREFIX}"
echo "   AWS Region: ${REGION}"
echo "   CloudFront Distribution: ${DISTRIBUTION_ID}"

# Verify required environment variables
if [ -z "$BUCKET_NAME" ] || [ -z "$DISTRIBUTION_ID" ]; then
    echo -e "${RED}❌ Missing required environment variables${NC}"
    echo "   Required: S3_BUCKET, CLOUDFRONT_DISTRIBUTION_ID"
    exit 1
fi

echo -e "${YELLOW}📁 Preparing deployment structure...${NC}"

# Create clean deployment directory
rm -rf ci-deploy-temp
mkdir -p ci-deploy-temp

# Copy files from public directory (GitHub Actions workspace)
if [ -d "public" ]; then
    cp -r public/* ci-deploy-temp/
    echo -e "${GREEN}✅ Files copied from public/ directory${NC}"
else
    echo -e "${RED}❌ public/ directory not found${NC}"
    exit 1
fi

# List files to be deployed
echo -e "${BLUE}📋 Files to deploy:${NC}"
find ci-deploy-temp -type f | sort

# Upload files with proper MIME types
echo -e "${YELLOW}📤 Uploading to S3: s3://${BUCKET_NAME}/${PROJECT_PREFIX}/${NC}"

# HTML files
echo "Uploading HTML files..."
aws s3 sync ci-deploy-temp/ s3://${BUCKET_NAME}/${PROJECT_PREFIX}/ \
  --delete \
  --exact-timestamps \
  --exclude "*" \
  --include "*.html" \
  --content-type "text/html; charset=utf-8" \
  --cache-control "public, max-age=3600"

# JavaScript files
echo "Uploading JavaScript files..."
aws s3 sync ci-deploy-temp/ s3://${BUCKET_NAME}/${PROJECT_PREFIX}/ \
  --exact-timestamps \
  --exclude "*" \
  --include "*.js" \
  --content-type "application/javascript; charset=utf-8" \
  --cache-control "public, max-age=86400"

# CSS files (if any)
echo "Uploading CSS files..."
aws s3 sync ci-deploy-temp/ s3://${BUCKET_NAME}/${PROJECT_PREFIX}/ \
  --exact-timestamps \
  --exclude "*" \
  --include "*.css" \
  --content-type "text/css; charset=utf-8" \
  --cache-control "public, max-age=86400"

# Other files
echo "Uploading remaining files..."
aws s3 sync ci-deploy-temp/ s3://${BUCKET_NAME}/${PROJECT_PREFIX}/ \
  --exact-timestamps \
  --exclude "*.html" \
  --exclude "*.js" \
  --exclude "*.css"

echo -e "${GREEN}✅ Files uploaded successfully${NC}"

# Invalidate CloudFront cache
echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "${DISTRIBUTION_ID}" \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)

echo -e "${GREEN}✅ CloudFront invalidation created: ${INVALIDATION_ID}${NC}"

# Cleanup
rm -rf ci-deploy-temp

echo -e "${GREEN}🎉 CI/CD Deployment completed successfully!${NC}"
echo -e "${BLUE}🌐 Your application is available at:${NC}"
echo "   https://ev-charging-platform.dev.codibly.com"
echo "   https://d33jfqhd90myjn.cloudfront.net"

echo -e "${YELLOW}⏳ Cache invalidation in progress. Changes will be live in 1-2 minutes.${NC}"