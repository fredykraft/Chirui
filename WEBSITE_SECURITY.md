# Website Security Guide

This document outlines the security measures implemented for the Chirui Huang website and best practices for maintaining a secure public website.

## 🔒 Security Principles

### 1. **Sensitive Data Protection**

#### What is Sensitive?
- Admin credentials and passwords
- API keys and tokens
- Database connection strings
- Private configuration files
- Personal user data

#### How We Protect It
- **Before Committing**: All sensitive files are in `.gitignore`
  - `ADMIN_PASSWORD.md` - Contains admin credentials (NOT in repo)
  - `.env` files - Environment-specific configuration
  - `*.secret.*` - Any files marked as secret

- **In Storage**: GitHub Pages enforces HTTPS
  - All data in transit is encrypted
  - No sensitive data stored in client-side code

- **In Code**: Best practices implemented
  - No hardcoded API keys in JavaScript
  - No localhost fallbacks in production code
  - Environment variables for all configuration

### 2. **Backend Configuration Security**

#### PocketBase URL Configuration
The website uses PocketBase for data operations. The URL is configured securely:

```javascript
// ✅ SECURE: Environment-based configuration
window.POCKETBASE_URL = 'https://chirui-huang.pockethost.io';
```

**Never expose:**
- Local development URLs (localhost:8090)
- Development API keys
- Internal network addresses
- Unencrypted HTTP endpoints

### 3. **Authentication & Authorization**

#### Frontend Authentication
- Stored in `sessionStorage` / `localStorage` (NOT exposed in HTML)
- Auth tokens validated server-side
- Automatic cleanup on logout
- Token expiration handled by PocketBase

#### Admin Dashboard Security
- Password protected with base64 hash (stored locally only)
- Instructions for secure password management: [ADMIN_PASSWORD.md.template](ADMIN_PASSWORD.md.template)
- Never commit actual passwords to repository

### 4. **API Security**

#### CORS Protection
- Only trusted origins can access APIs
- Configure in PocketBase settings
- Server validates all requests

#### Request Validation
- All inputs validated on server-side
- Client-side validation for UX only
- Rate limiting on API endpoints

#### Data Transmission
- HTTPS enforced (HTTP not allowed)
- Secure headers configured
- No sensitive data in query parameters

## 📋 Deployment Checklist

### Before Going Live
- [ ] Remove all `.template` files from public directory
- [ ] Ensure `.gitignore` includes all sensitive files
- [ ] Verify no hardcoded passwords/keys in code
- [ ] Test HTTPS configuration
- [ ] Configure CORS in PocketBase
- [ ] Set proper security headers

### Environment Setup
```bash
# Set these in your deployment environment:
export POCKETBASE_URL='https://chirui-huang.pockethost.io'
export NODE_ENV='production'
```

### In HTML (`_includes/head.html` or deployment script)
```html
<!-- Configure PocketBase BEFORE loading scripts -->
<script>
  // Set from environment variable during build
  window.POCKETBASE_URL = 'https://chirui-huang.pockethost.io';
</script>
```

## 🛡️ Security Headers

Add these headers to your deployment:

```yaml
# For GitHub Pages, add to _config.yml if supported, or deployment server
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' translate.google.com translate-a.googleapis.com; style-src 'self' 'unsafe-inline'
Referrer-Policy: strict-origin-when-cross-origin
```

## 📁 File Permissions

### Repository Files
- Public files: All `.html`, `.js`, `.md` (except templates/secrets)
- Never commit: `ADMIN_PASSWORD.md`, `.env`, `*.secret`
- Templates only: `ADMIN_PASSWORD.md.template`, `_config_dev.yml`

### Protected Directories
```
✅ Public:
- js/ (non-sensitive scripts)
- css/
- index.html
- All documentation .md files

❌ Never Public:
- ADMIN_PASSWORD.md (not committed)
- Local development:8090 references (removed)
- Database credentials
- API keys
```

## 🔐 User Data Protection

### What Data We Collect
- Username (public profile)
- Email (private, for notifications)
- Profile information (name, bio)
- Location setting (for language preferences)
- Activity tracking (anonymous analytics)

### Storage
- Stored in PocketBase with field-level permissions
- Users can only access their own data
- Admins can access all data (with password protection)

### GDPR/Privacy Compliance
- Users can request their data
- Users can delete their account
- No data sold to third parties
- Privacy policy: [SECURITY_PRIVACY.md](SECURITY_PRIVACY.md)

## 🚨 Common Security Issues - Prevention

### Issue: Hardcoded Credentials
```javascript
// ❌ WRONG - Never do this!
const API_KEY = 'sk_live_abc123';
const DB_PASSWORD = 'letmein123';

// ✅ RIGHT - Use environment variables
const API_KEY = process.env.API_KEY;
const PB_URL = window.POCKETBASE_URL;
```

### Issue: Exposing Internal URLs
```javascript
// ❌ WRONG - Exposes development infrastructure
const PB_URL = 'http://localhost:8090';

// ✅ RIGHT - Use production endpoints
const PB_URL = window.POCKETBASE_URL;
```

### Issue: Insecure Storage
```javascript
// ❌ WRONG - Tokens visible in HTML/localStorage
<script>window.SECRET_TOKEN = 'abc123';</script>

// ✅ RIGHT - Secure storage with appropriate expiration
// Stored in sessionStorage/localStorage with no default values
```

## 🔄 Security Update Process

When updating the website:

1. **Code Review**
   - Check for hardcoded secrets
   - Verify no localhost URLs in production code
   - Confirm environment variables are used

2. **Before Commit**
   - Run: `git diff --cached | grep -i "password\|api_key\|token\|secret"`
   - Verify sensitive files are in `.gitignore`
   - Review commit message for sensitive info

3. **After Deployment**
   - Verify HTTPS is working
   - Check security headers in browser
   - Test authentication flows
   - Monitor error logs for information leaks

## 📚 Related Documentation

- [Security Action Required](SECURITY_ACTION_REQUIRED.md)
- [Security Setup Guide](SECURITY_SETUP.md)
- [Privacy & Data Protection](SECURITY_PRIVACY.md)
- [Admin Password Setup](ADMIN_PASSWORD.md.template)
- [PocketBase Deployment](POCKETBASE_DEPLOYMENT.md)

## 🆘 Security Incident Response

If you discover a security issue:

1. **Do Not** commit the issue to public repository
2. **Do Not** publicly disclose the vulnerability
3. **Do** contact the site owner immediately
4. **Do** provide detailed description and steps to reproduce
5. **Document** the fix before deployment

## ✅ Quick Security Audit

Run these checks regularly:

```bash
# Check for secrets in code
grep -r "password\|api_key\|token" js/ --include="*.js" | grep -v "// " | grep -v "node_modules"

# Check for localhost references
grep -r "localhost\|127.0.0.1" js/ --include="*.js" | grep -v "// localhost for development"

# Verify .gitignore is working
git status | grep -i "admin_password\|.env\|secret"

# Check files that might be committed
ls -la | grep -i "password\|secret\|env"
```

## 📝 Maintenance

- Review this document quarterly
- Update security practices as threats evolve
- Keep dependencies updated
- Monitor PocketBase security advisories
- Test authentication flows regularly

---

**Last Updated**: March 4, 2026  
**Next Review**: June 2026
