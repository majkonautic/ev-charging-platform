#!/bin/bash

# Update CloudFront distribution with custom domain and SSL
set -e

echo "🌐 Updating CloudFront with custom domain and SSL..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load distribution info
if [ ! -f "cloudfront-info.env" ]; then
    echo -e "${RED}❌ cloudfront-info.env not found. Run setup-basic-cloudfront.sh first.${NC}"
    exit 1
fi

source cloudfront-info.env

# Configuration
DOMAIN_NAME="ev-charging-platform.dev.codibly.com"
CERT_ARN="arn:aws:acm:us-east-1:168787218050:certificate/0ecdb1da-7348-416f-b562-79d3147031c2"

echo -e "${YELLOW}📋 Configuration:${NC}"
echo "   Distribution ID: ${DISTRIBUTION_ID}"
echo "   Custom Domain: ${DOMAIN_NAME}"
echo "   Certificate ARN: ${CERT_ARN}"

# Check SSL certificate status
echo -e "\n${YELLOW}🔍 Checking SSL certificate status...${NC}"
CERT_STATUS=$(aws acm describe-certificate --certificate-arn "${CERT_ARN}" --region us-east-1 --query 'Certificate.Status' --output text 2>/dev/null || echo "ERROR")

if [ "$CERT_STATUS" != "ISSUED" ]; then
    echo -e "${RED}❌ SSL Certificate not ready. Status: ${CERT_STATUS}${NC}"
    echo -e "${BLUE}💡 Please ensure DNS validation record is added:${NC}"
    echo "   _1ea69f526fd690d7f69fb022f96567f6.ev-charging-platform.dev.codibly.com"
    echo "   CNAME → _35c45fbfe75cf0b45089ed5172bd9eb0.xlfgrmvvlj.acm-validations.aws."
    exit 1
fi

echo -e "${GREEN}✅ SSL Certificate is issued and ready${NC}"

# Get current distribution config
echo -e "\n${YELLOW}📥 Getting current distribution configuration...${NC}"
aws cloudfront get-distribution-config --id "${DISTRIBUTION_ID}" > /tmp/current-dist.json

ETAG=$(jq -r '.ETag' /tmp/current-dist.json)
jq '.DistributionConfig' /tmp/current-dist.json > /tmp/dist-config.json

# Update configuration with custom domain and SSL
echo -e "${YELLOW}🔧 Updating configuration...${NC}"
jq --arg domain "${DOMAIN_NAME}" --arg cert_arn "${CERT_ARN}" '
.Aliases = {
  "Quantity": 1,
  "Items": [$domain]
} |
.ViewerCertificate = {
  "ACMCertificateArn": $cert_arn,
  "SSLSupportMethod": "sni-only",
  "MinimumProtocolVersion": "TLSv1.2_2021",
  "CertificateSource": "acm"
}
' /tmp/dist-config.json > /tmp/updated-dist-config.json

# Apply the update
echo -e "\n${YELLOW}🚀 Updating CloudFront distribution...${NC}"
aws cloudfront update-distribution \
  --id "${DISTRIBUTION_ID}" \
  --distribution-config file:///tmp/updated-dist-config.json \
  --if-match "${ETAG}" > /dev/null

echo -e "${GREEN}✅ CloudFront distribution updated successfully!${NC}"

# Clean up temp files
rm -f /tmp/current-dist.json /tmp/dist-config.json /tmp/updated-dist-config.json

echo -e "\n${YELLOW}🎉 Setup Complete!${NC}"
echo -e "Your EV Charging Platform is now available at:"
echo -e "   ${GREEN}https://${DOMAIN_NAME}${NC}"

echo -e "\n${YELLOW}📝 Final step:${NC}"
echo "Add DNS CNAME record:"
echo "   ${DOMAIN_NAME} → ${CLOUDFRONT_DOMAIN}"

echo -e "\n${BLUE}📊 Check deployment status:${NC}"
echo "aws cloudfront get-distribution --id ${DISTRIBUTION_ID} --query 'Distribution.Status'"

echo -e "\n${GREEN}🚀 Production deployment complete!${NC}"