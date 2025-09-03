# 🚀 GitHub Actions CI/CD Setup Guide

## Overview

Your EV Charging Platform now has automatic deployment! Every time you push to the `main` branch, GitHub Actions will automatically deploy your changes to:
- **Production:** https://ev-charging-platform.dev.codibly.com
- **CDN:** https://d33jfqhd90myjn.cloudfront.net

## 🔧 Required GitHub Secrets

You need to add these secrets to your GitHub repository for the deployment to work:

### 1. Go to Repository Settings
1. Navigate to https://github.com/majkonautic/ev-charging-platform
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**

### 2. Add These Secrets

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `AWS_ACCESS_KEY_ID` | `[Your MCPServer Access Key]` | AWS IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | `[Your MCPServer Secret Key]` | AWS IAM user secret key |
| `AWS_REGION` | `us-east-1` | AWS region for S3 and CloudFront |
| `S3_BUCKET` | `dev.codibly.com` | S3 bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID` | `E3IS3A3VBVODW4` | CloudFront distribution ID |

## 🔑 How to Get Your AWS Keys

Your MCPServer IAM user already exists. You'll need to:

1. **Find existing access keys** in AWS IAM Console:
   - Go to AWS IAM Console → Users → MCPServer
   - Click **Security credentials** tab
   - Look for existing Access Keys

2. **Or create new access keys**:
   - In same location, click **Create access key**
   - Choose **Application running outside AWS**
   - Download the CSV or copy the keys immediately
   - **⚠️ Store securely - you won't see the secret key again!**

## 🚀 Deployment Workflow

### Automatic Triggers
The deployment runs automatically when:
- ✅ You push to `main` branch
- ✅ You merge a Pull Request to `main`
- ✅ You manually trigger from GitHub Actions tab

### Manual Deployment
You can also trigger deployments manually:
1. Go to **Actions** tab in your repository
2. Click **🚀 Deploy EV Charging Platform**
3. Click **Run workflow** → **Run workflow**

## 📋 What Happens During Deployment

1. **📥 Checkout Code** - Downloads latest code
2. **🔧 Configure AWS** - Sets up AWS credentials
3. **🗂️ Prepare Files** - Copies files from `public/` directory
4. **📤 Upload to S3** - Syncs files with proper MIME types:
   - HTML files: `text/html` with 1-hour cache
   - JavaScript files: `application/javascript` with 24-hour cache
   - CSS files: `text/css` with 24-hour cache
5. **🔄 Invalidate Cache** - Clears CloudFront cache for immediate updates
6. **✅ Success** - Your changes are live!

## 🔍 Monitoring Deployments

### Check Deployment Status
- Go to **Actions** tab in your repository
- Click on the latest deployment to see logs
- Green ✅ = successful deployment
- Red ❌ = failed deployment (check logs)

### Deployment Logs Show:
- Files being uploaded
- S3 sync progress
- CloudFront invalidation ID
- Final URLs where site is live

## ⚡ Quick Test

1. **Add secrets** to GitHub (steps above)
2. **Make a small change** to any file in `public/`
3. **Commit and push**:
   ```bash
   git add .
   git commit -m "Test automatic deployment"
   git push
   ```
4. **Watch deployment** in Actions tab
5. **Verify changes** at https://ev-charging-platform.dev.codibly.com

## 🛠️ Troubleshooting

### Common Issues

| Error | Cause | Solution |
|-------|-------|----------|
| `AWS credentials not found` | Missing secrets | Add AWS secrets to GitHub |
| `Access denied to S3` | Wrong IAM permissions | Verify MCPServer user has S3 access |
| `Distribution not found` | Wrong CloudFront ID | Verify `CLOUDFRONT_DISTRIBUTION_ID` |
| `Files not updating` | Cache not invalidated | Check invalidation in CloudFront console |

### Debug Steps
1. **Check deployment logs** in GitHub Actions
2. **Verify AWS credentials** work locally
3. **Test manual deployment** with local scripts
4. **Check CloudFront invalidation** in AWS console

## 🔐 Security Best Practices

✅ **What's Secure:**
- GitHub secrets are encrypted
- IAM user has minimal permissions
- No secrets committed to code
- HTTPS enforced everywhere

⚠️ **Important Notes:**
- Never commit AWS keys to code
- Rotate AWS keys periodically
- Monitor AWS CloudTrail for API calls
- Use least-privilege IAM policies

## 📊 Performance & Costs

### GitHub Actions Usage
- **Free Tier:** 2,000 minutes/month for public repos
- **Typical Deployment:** ~2-3 minutes
- **Monthly Cost:** $0 (within free tier)

### AWS Costs Remain the Same
- S3 + CloudFront: ~$0.53/month
- No additional costs for deployments

## 🎉 Next Steps

1. **✅ Set up secrets** (required for deployments)
2. **🧪 Test the pipeline** with a small change
3. **📝 Update README** with deployment badge (optional)
4. **🔔 Add notifications** (Slack/email for failures)
5. **🌟 Add preview deployments** for Pull Requests

## 📞 Support

If you encounter issues:
1. Check the **troubleshooting section** above
2. Review **GitHub Actions logs** for specific errors
3. Verify **AWS console** for resource status
4. Test **manual deployment scripts** locally

---

**🤖 Generated by Claude Code**  
*Your EV Charging Platform is now ready for continuous deployment!* 🚀