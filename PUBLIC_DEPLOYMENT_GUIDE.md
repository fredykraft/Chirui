# Public Website Deployment & Security Guide

## Overview

The Chirui Huang website is a secure, public-facing portfolio and blog with user authentication via PocketBase.

### Key Features
- ✅ Secure user registration and authentication
- ✅ Language adaptation (multi-language support)
- ✅ Location-based language preference
- ✅ User profile management
- ✅ Blog/research content
- ✅ Analytics (secure, anonymized)
- ✅ Anonymous comment submission

### Technology Stack
- **Frontend**: Jekyll static site generator (hosted on GitHub Pages)
- **Backend**: PocketBase (self-hosted or managed)
- **Authentication**: Token-based (PocketBase)
- **Storage**: Browser localStorage for preferences
- **Hosting**: GitHub Pages (HTTPS enforced)

## 🔒 Security Architecture

### Data Flow
```
User Browser (HTTPS)
    ↓
GitHub Pages (Static Site)
    ↓
PocketBase API (HTTPS) ← All requests authenticated
    ↓
Database (Secured by PocketBase)
```

### Sensitive Data
**What's Public**: Site content, blog posts, portfolio info
**What's Protected**: User data, authentication tokens, admin credentials

## 🚀 Deployment Instructions

### For GitHub Pages Deployment

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/Chirui.git
cd Chirui
```

2. **Configure Environment**
```bash
# Ensure _config.yml has:
url: "https://yourdomain.com"
baseurl: ""

# Ensure _includes/head.html has PocketBase URL configured:
window.POCKETBASE_URL = 'https://your-pocketbase.pockethost.io';
```

3. **Test Locally**
```bash
bundle exec jekyll serve --config _config_dev.yml
# Visit http://localhost:4000
```

4. **Deploy**
```bash
git add .
git commit -m "chore: prepare deployment"
git push origin main
# GitHub Actions builds and deploys automatically
```

5. **Verify Deployment**
```bash
# Check HTTPS
curl -I https://yourdomain.com

# Verify headers
curl -I https://yourdomain.com | grep -i "x-content-type\|x-frame\|strict-transport"

# Test auth
curl https://yourdomain.com/js/user-auth.js | grep "POCKETBASE_URL"
```

### For PocketBase Setup

1. **Deploy PocketBase**
```bash
# Use PocketBase cloud (recommended for beginners)
# Or self-host: https://pocketbase.io/docs/

# Get your PocketBase URL (format: https://xxx.pockethost.io)
```

2. **Configure Collections** (Done via Admin Panel)
   - `users` - Pre-configured with field-level permissions
   - `newsletter_subscribers`
   - `comments`
   - `Contacts`

3. **Set CORS** in PocketBase Admin
   - Add your domain to allowed origins
   - Example: `https://yourdomain.com`

4. **Test Connection**
```bash
# Check if PocketBase is accessible
curl https://your-pocketbase-url/api/health

# Should return: {"canBackup":true,"message":"OK"}
```

## 🛡️ Security Best Practices

### For Site Administrators

1. **Protect Admin Credentials**
   - Store admin password securely (password manager recommended)
   - Never commit `ADMIN_PASSWORD.md` to repository
   - Change password regularly

2. **Monitor Activity**
   - Check admin analytics regularly
   - Review user registrations for spam
   - Monitor error logs

3. **Keep Dependencies Updated**
   - GitHub Pages automatically updates Jekyll
   - Monitor PocketBase security advisories
   - Test updates in staging first

4. **Backup Data**
   - PocketBase backups configured
   - Regular exports of user data
   - Test restore procedures

### For Users

1. **Account Security**
   - Use strong, unique passwords
   - Don't share your password with anyone
   - Log out when using public computers

2. **Privacy**
   - Only provide required information
   - Review privacy policy before registering
   - Request data deletion if desired

3. **Responsible Use**
   - Don't spam or abuse the system
   - Respect other users' privacy
   - Follow terms of service

## 🚨 Troubleshooting

### "Backend features not working"
**Problem**: Authentication or form submission fails
**Solution**: Check if PocketBase URL is configured in `_includes/head.html`
```html
<script>
  window.POCKETBASE_URL = 'https://your-pocketbase-url';
</script>
```

### "Mixed content error" (Mixed HTTP/HTTPS)
**Problem**: Browser blocks insecure requests
**Solution**: Ensure all URLs use HTTPS
- [ ] GitHub Pages URL is HTTPS
- [ ] PocketBase URL is HTTPS
- [ ] CDN URLs are HTTPS

### "CORS errors"
**Problem**: API calls blocked by browser
**Solution**: Configure CORS in PocketBase
1. Go to PocketBase Admin → Settings
2. Add your domain to API Rules → Collection Rules
3. Allow all methods (GET, POST, PATCH, DELETE)

### "Users can't register"
**Problem**: Registration form doesn't work
**Solution**: 
1. Verify PocketBase collection permissions (migration: `1772465400_fix_public_create_permissions.js`)
2. Check browser console for detailed error
3. Test with `curl`:
```bash
curl -X POST https://your-pb-url/api/collections/users/records \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "testpass123",
    "passwordConfirm": "testpass123"
  }'
```

## 📊 Monitoring

### Key Metrics to Monitor
- **Site Performance**: Page load times, error rates
- **Security**: Failed login attempts, suspicious activity
- **User Engagement**: New registrations, active users
- **System Health**: API response times, uptime

### Tools
- GitHub Pages: Dashboard shows build status and traffic
- PocketBase: Admin panel shows detailed logs and metrics
- Google Analytics: User behavior and traffic sources
- Browser DevTools: Network requests and errors

## 🔄 Update Procedure

1. **Create Feature Branch**
```bash
git checkout -b feature/security-update
```

2. **Make Changes**
```bash
# Update files...
# Test locally with: bundle exec jekyll serve --config _config_dev.yml
```

3. **Review Security**
```bash
# Check for secrets
grep -r "password\|api_key\|token" js/ | grep -v "// "

# Check for development URLs
grep -r "localhost" js/
grep -r "127.0.0.1" js/
```

4. **Test**
- Verify all features work locally
- Test authentication flows
- Check performance

5. **Deploy**
```bash
git commit -m "feature: [description]"
git push origin feature/security-update
# Create pull request and merge to main
```

## 📚 Related Documentation

- [Website Security Guide](WEBSITE_SECURITY.md)
- [Deployment Security Checklist](DEPLOYMENT_SECURITY_CHECKLIST.md)
- [PocketBase Deployment Guide](POCKETBASE_DEPLOYMENT.md)
- [Privacy Policy](SECURITY_PRIVACY.md)
- [Security Setup](SECURITY_SETUP.md)

## 🆘 Support & Reporting Issues

### Report a Security Vulnerability
⚠️ **DO NOT** report security issues publicly

1. Email the site owner privately
2. Include detailed description and reproduction steps
3. Allow time for fixes before public disclosure
4. Do not publicly disclose the vulnerability

### Report a Bug
1. Open an issue with clear description
2. Include steps to reproduce
3. Specify browser and OS
4. Include error messages from console

### Get Help
- Check [FAQs](FAQ.md) first
- Review documentation
- Contact site owner for support

---

**Last Updated**: March 4, 2026  
**Maintained By**: [Your Name]  
**Contact**: [Your Email]
