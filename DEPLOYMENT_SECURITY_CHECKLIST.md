# Deployment Security Checklist

Use this checklist before deploying the website to production.

## 🔍 Code Security Review

- [ ] **No Hardcoded Secrets**
  - [ ] Run: `grep -r "password\|API_KEY\|secret" js/ --include="*.js"`
  - [ ] Run: `grep -r "api_key\|apiKey\|authToken" js/ --include="*.js"`
  - [ ] All results should be in comments or example code only
  - [ ] Review `.gitignore` for sensitive file patterns

- [ ] **No Development URLs in Production**
  - [ ] Run: `grep -r "localhost" js/ --include="*.js"`
  - [ ] Run: `grep -r "127.0.0.1" js/ --include="*.js"`
  - [ ] Run: `grep -r ":8090\|:3000\|:5000" js/ --include="*.js"`
  - [ ] All results should be in development-only comments
  - [ ] Verify `POCKETBASE_URL` uses HTTPS

- [ ] **Sensitive Files Not Committed**
  - [ ] `ADMIN_PASSWORD.md` exists in `.gitignore`
  - [ ] `.env` files in `.gitignore`
  - [ ] `*.secret.*` pattern in `.gitignore`
  - [ ] Run: `git status` - shows no sensitive files

- [ ] **Environment Variables Configured**
  - [ ] `POCKETBASE_URL` set to production endpoint
  - [ ] All API endpoints use HTTPS
  - [ ] No development/staging URLs in production build

## 🔐 Configuration & Credentials

- [ ] **PocketBase Configuration**
  - [ ] Update `POCKETBASE_URL` in `_includes/head.html` to production URL
  - [ ] PocketBase instance is configured with proper CORS
  - [ ] CORS origins restricted to your domain only
  - [ ] Run: `curl -I https://your-pocketbase-url/api/health` returns 200

- [ ] **Authentication Setup**
  - [ ] User registration is enabled (via `1772465400_fix_public_create_permissions.js`)
  - [ ] Admin password set and stored securely (not in repo)
  - [ ] Session timeout configured appropriately
  - [ ] Password hashing enabled on server

- [ ] **Database Security**
  - [ ] Field-level permissions configured in PocketBase
  - [ ] Users can only access their own data
  - [ ] Admins must authenticate to access analytics
  - [ ] No sensitive fields exposed publicly

## 🌐 HTTPS & SSL/TLS

- [ ] **HTTPS Enforced**
  - [ ] GitHub Pages HTTPS enabled
  - [ ] PocketBase endpoint is HTTPS only
  - [ ] No HTTP fallback routes
  - [ ] HSTS header enabled (max-age at least 31536000)

- [ ] **SSL Certificate**
  - [ ] GitHub Pages certificate is valid
  - [ ] Certificate not self-signed
  - [ ] Certificate covers all domains used
  - [ ] Certificate auto-renewal configured

## 🛡️ Security Headers

- [ ] **Headers Configured in `_includes/head.html`**
  - [ ] X-Content-Type-Options: nosniff
  - [ ] X-Frame-Options: SAMEORIGIN
  - [ ] X-XSS-Protection: 1; mode=block
  - [ ] Strict-Transport-Security configured
  - [ ] Content-Security-Policy configured
  - [ ] Referrer-Policy: strict-origin-when-cross-origin

- [ ] **Test Headers**
  - [ ] Run: `curl -I https://yoursite.com`
  - [ ] Verify all security headers present
  - [ ] Use: https://securityheaders.com for audit

## 📋 Data Protection

- [ ] **User Data**
  - [ ] Privacy policy linked from site
  - [ ] Data usage disclosed to users
  - [ ] Consent collected for tracking
  - [ ] No data sold to third parties

- [ ] **Cookies & Storage**
  - [ ] Cookie policy configured
  - [ ] User consent for non-essential cookies
  - [ ] Storage options (localStorage/sessionStorage) reviewed
  - [ ] No sensitive data in cookies

- [ ] **Analytics**
  - [ ] Google Analytics configured securely
  - [ ] Personal data anonymized in analytics
  - [ ] Analytics not used to track individual users
  - [ ] Data retention policy set

## 🔗 Third-Party Services

- [ ] **PocketBase**
  - [ ] CORS properly configured
  - [ ] API rate limiting enabled
  - [ ] Request validation enabled
  - [ ] Backups configured

- [ ] **Google Translate**
  - [ ] Widget properly sandboxed
  - [ ] No data leakage to translation service
  - [ ] Alternative language support available

- [ ] **YouTube Embeds**
  - [ ] Videos use Privacy Enhanced mode
  - [ ] Embed code doesn't set cookies
  - [ ] User consent for video loading

## 🧪 Testing & Verification

- [ ] **Authentication Testing**
  - [ ] Registration works with valid data
  - [ ] Login/Logout functions correctly
  - [ ] Session persists across page reloads
  - [ ] Token validation on server-side
  - [ ] Unauthorized access returns 401

- [ ] **API Testing**
  - [ ] Test from different domain (CORS check)
  - [ ] Invalid tokens rejected
  - [ ] Rate limiting works
  - [ ] Error messages don't leak sensitive info

- [ ] **Security Testing**
  - [ ] No information disclosure in errors
  - [ ] No directory listing enabled
  - [ ] No backup files exposed (.bak, .old)
  - [ ] Run: https://observatory.mozilla.org/ for scoring

## 📊 Monitoring & Logging

- [ ] **Error Logging**
  - [ ] Errors logged securely
  - [ ] Logs don't contain sensitive data
  - [ ] Log retention policy set
  - [ ] Logs protected from unauthorized access

- [ ] **Security Monitoring**
  - [ ] Failed login attempts monitored
  - [ ] Unusual API activity alerted
  - [ ] Certificate expiration monitored
  - [ ] Backup integrity verified

## 📝 Documentation

- [ ] **Security Documentation**
  - [ ] [WEBSITE_SECURITY.md](WEBSITE_SECURITY.md) reviewed and updated
  - [ ] [SECURITY_PRIVACY.md](SECURITY_PRIVACY.md) current
  - [ ] Admin procedures documented (not in public repo)
  - [ ] Incident response plan created

- [ ] **Deployment Procedures**
  - [ ] Deployment checklist followed
  - [ ] Rollback plan documented
  - [ ] Version control properly used
  - [ ] Deployment logs kept

## 🚨 Emergency Response

- [ ] **Incident Plan**
  - [ ] Security contact information updated
  - [ ] Response procedures documented
  - [ ] Communication plan established
  - [ ] Rollback procedure tested

- [ ] **Vulnerability Management**
  - [ ] Dependency scanning enabled
  - [ ] Security patches applied promptly
  - [ ] Vulnerability disclosure policy published
  - [ ] Security team contacted immediately if issues found

## ✅ Final Checks

- [ ] **Pre-Deployment Review**
  - [ ] All items above completed
  - [ ] Code review completed
  - [ ] Security lead approved deployment
  - [ ] Rollback plan ready

- [ ] **Post-Deployment Verification**
  - [ ] Verify HTTPS working
  - [ ] Test authentication flows
  - [ ] Check all external links
  - [ ] Monitor error logs for issues
  - [ ] Performance testing completed

## 📋 Sign-off

**Deployment Date**: _______________

**Reviewer Name**: _______________

**Reviewer Signature**: _______________

**Notes**: 
```
[Add any notes about the deployment]
```

---

## 🔗 Related Checklists

- [Security Action Required](SECURITY_ACTION_REQUIRED.md)
- [Website Security Guide](WEBSITE_SECURITY.md)
- [PocketBase Deployment](POCKETBASE_DEPLOYMENT.md)

## 📞 Support

For security issues:
1. Do NOT post publicly
2. Contact site owner immediately
3. Provide detailed description and reproduction steps
4. Document the fix before deployment

---

**Last Updated**: March 4, 2026
