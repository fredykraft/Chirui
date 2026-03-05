# Security Quick Reference Card

**For Developers**: Print this and keep it handy when working on the website.

## 🎯 Remember

| Aspect | ✅ DO | ❌ DON'T |
|--------|-------|---------|
| **Credentials** | Use environment variables | Hardcode passwords/keys |
| **URLs** | Use `window.POCKETBASE_URL` | Hardcode localhost |
| **Data** | Validate on server | Trust client input |
| **Errors** | Log securely | Expose system details |
| **HTTPS** | Always use HTTPS | Fall back to HTTP |
| **Commits** | Review before pushing | Commit secrets |
| **Dependencies** | Keep updated | Ignore security advisories |

## 🔍 Pre-Commit Checks

Before committing changes:

```bash
# Check for secrets
grep -r "password\|API_KEY\|secret" js/ --include="*.js" | grep -v "//"

# Check for localhost
grep -r "localhost\|127.0.0.1" js/ --include="*.js"

# List files to commit
git status

# Review changes
git diff --cached
```

## 🚀 Configuration Template

### For JavaScript (PocketBase URLs)
```javascript
// ✅ CORRECT
const baseUrl = window.POCKETBASE_URL; // Set in head.html

// ❌ WRONG
const baseUrl = 'http://localhost:8090'; // Hardcoded
const baseUrl = 'http://127.0.0.1:8090'; // Development URL
const baseUrl = process.env.BACKEND_URL; // Won't work in browser
```

### For HTML (Configuration)
```html
<!-- ✅ CORRECT -->
<script>
  if (!window.POCKETBASE_URL) {
    window.POCKETBASE_URL = 'https://your-pocketbase-url';
  }
</script>

<!-- ❌ WRONG -->
<script>
  window.POCKETBASE_URL = 'http://localhost:8090'; // Dev URL in production!
</script>
```

## 📝 Sensitive Files List

❌ **NEVER commit these**:
- `ADMIN_PASSWORD.md` (actual password file)
- `.env` files
- `*.secret.*` files
- Development config files
- Database backups with data

✅ **OK to commit**:
- `ADMIN_PASSWORD.md.template` (template only)
- `_includes/head.html` (public config)
- Documentation files
- Migration scripts
- Source code

## 🔒 Security Headers

Check that these headers are in `_includes/head.html`:
```html
<meta http-equiv='X-Content-Type-Options' content='nosniff'>
<meta http-equiv='X-Frame-Options' content='SAMEORIGIN'>
<meta http-equiv='X-XSS-Protection' content='1; mode=block'>
<meta http-equiv='Content-Security-Policy' content="...">
```

## 🧪 Testing Checklist

```bash
# Test locally
bundle exec jekyll serve --config _config_dev.yml

# Verify configuration in browser
# Open DevTools → Console → type:
window.POCKETBASE_URL
# Should show: https://your-pocketbase-url (NOT localhost!)

# Test authentication
# Try register/login/logout flows

# Check for errors
# DevTools → Console → look for red errors
# DevTools → Network → check all requests use HTTPS
```

## 🚨 Common Mistakes

### ❌ Mistake #1: Development URL in Code
```javascript
// WRONG - Visible in public source
const url = 'http://localhost:8090/api';
```
**Fix**: Use `window.POCKETBASE_URL` set in `_includes/head.html`

### ❌ Mistake #2: Hardcoded Credentials
```javascript
// WRONG - Password in source!
const password = 'my-secret-password';
```
**Fix**: Use environment variables or server-side validation only

### ❌ Mistake #3: Exposing Error Details
```javascript
// WRONG - Leaks system information
catch (error) {
  console.log('Database password is ' + db.password);
}
```
**Fix**: Log safely - never include sensitive info
```javascript
catch (error) {
  console.error('Authentication failed');
  // Send to server for logging
}
```

### ❌ Mistake #4: Trusting Client Input
```javascript
// WRONG - No validation!
const username = getUserInput();
db.query('SELECT * FROM users WHERE name = ' + username);
```
**Fix**: Validate on server-side always. Use parameterized queries.

### ❌ Mistake #5: Using HTTP Instead of HTTPS
```javascript
// WRONG - Unencrypted!
const url = 'http://api.example.com';
```
**Fix**: Always use HTTPS
```javascript
const url = 'https://api.example.com';
```

## 📚 Where to Find Things

| What | Where |
|------|-------|
| Configuration | `_includes/head.html` |
| Authentication | `js/user-auth.js` |
| Backend API | `js/pocketbase-integration.js` |
| Language System | `js/auto-language.js` |
| Dashboard | `dashboard.html` |
| Security Headers | `_includes/head.html` |
| Environment Config | `_config.yml` |

## 🎓 Learning Resources

- [WEBSITE_SECURITY.md](WEBSITE_SECURITY.md) - Full security guide
- [PUBLIC_DEPLOYMENT_GUIDE.md](PUBLIC_DEPLOYMENT_GUIDE.md) - Deployment guide
- [DEPLOYMENT_SECURITY_CHECKLIST.md](DEPLOYMENT_SECURITY_CHECKLIST.md) - Checklist

## 🆘 When Things Go Wrong

### Step 1: Check Configuration
```bash
# Verify POCKETBASE_URL in head.html
grep -A2 "POCKETBASE_URL" _includes/head.html
```

### Step 2: Check Browser Console
- Open DevTools (F12)
- Look for red error messages
- Check Network tab for failed requests

### Step 3: Check Git Status
```bash
# Make sure no secrets are staged
git status
git diff --cached | grep -i "password\|token\|secret"
```

### Step 4: Verify PocketBase Connection
```bash
# Test API
curl -I https://your-pocketbase-url/api/health
# Should return 200 OK
```

### Step 5: Check Logs
- GitHub Pages: Building... wait for completion
- PocketBase admin: Check request logs
- Browser console: Look for errors

## ✅ Daily Workflow

```bash
# 1. Start of day - pull latest
git pull origin main

# 2. Create feature branch
git checkout -b feature/my-change

# 3. Make changes and test locally
bundle exec jekyll serve --config _config_dev.yml
# Visit http://localhost:4000 and test

# 4. Before committing - security check
grep -r "localhost\|password\|secret" . --include="*.js" --include="*.html"

# 5. Commit securely
git add .
git commit -m "feat: [clear description]"

# 6. Push and create PR
git push origin feature/my-change
# Go to GitHub and open Pull Request
```

## 🔐 Password Recovery

If you forget the admin password:
1. Delete `ADMIN_PASSWORD.md`
2. Create new one using: `btoa('new-password')`
3. Update `admin-analytics.html`
4. Keep new file out of git (it's in .gitignore)

**Remember**: Don't commit the actual password file to git!

## 📞 Emergency Contacts

- **Security Issue**: Email owner privately
- **Deploy Failed**: Check build logs on GitHub
- **PocketBase Down**: Check PocketBase status/logs
- **Site Errors**: Check GitHub Pages build

---

### Quick Commands Reference

```bash
# Clone repo
git clone https://github.com/yourusername/Chirui.git

# Run locally
bundle exec jekyll serve --config _config_dev.yml

# Check for secrets
grep -r "password\|api\|token" js/ --include="*.js" | grep -v "//"

# View configuration
grep "POCKETBASE_URL" _includes/head.html

# Test API
curl https://your-pocketbase-url/api/health

# Clean Jekyll cache
rm -rf _site .jekyll-cache

# Format commit message
git commit -m "type: breaking? scope: description"
# Types: feat, fix, chore, docs, style, refactor, test, perf, security
```

---

**Last Updated**: March 4, 2026  
**Keep This Updated**: Review quarterly or when security practices change
