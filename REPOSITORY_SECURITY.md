# 🔒 Repository Security Guide

This document explains what files are safe to commit to this public repository and which files contain sensitive data.

## ✅ Safe to Commit (Public)

These files are included in the repository and contain NO sensitive data:

### Configuration Files
- `.gitignore` - Specifies which files to ignore
- `_config.yml` - Public Jekyll configuration
- `Gemfile` - Ruby dependencies

### Template Files
- `ADMIN_PASSWORD.md.template` - Password template (no real password)
- `ADMIN_ANALYTICS_GUIDE.md.template` - Guide template (no real password)

### Database Schema
- `pb_migrations/*.js` - Database schema definitions only (no actual data)
  - Contains field definitions (name, email fields, etc.)
  - Safe to share as they don't contain user data
  - Helps recreate database structure

### Application Code
- `js/pocketbase-integration.js` - API integration code
  - Uses localhost URL `http://127.0.0.1:8090` (safe)
  - No passwords or API keys embedded
- Other JavaScript, HTML, CSS files

## 🚫 NEVER Commit (Private)

These files are in `.gitignore` and contain sensitive information:

### Authentication & Passwords
- `ADMIN_PASSWORD.md` - Local private notes (never commit)
- `admin-analytics.html` - Local-only admin page if you keep password checks client-side
- `ADMIN_ANALYTICS_GUIDE.md` - Local private notes (never commit)

### PocketBase Files
- `pocketbase` - The executable binary
- `pb_data/` - Database files with actual user data
  - Contains all form submissions
  - Contains email addresses
  - Contains comments and messages
- `pocketbase.log` - May contain sensitive logs

### Development & Security Files
- `_config_dev.yml` - Local development config
- `SECURITY_SETUP.md` - Setup instructions (may contain sensitive info)
- `SECURITY_ACTION_REQUIRED.md` - May contain sensitive instructions
- `COOKIE_TRACKING_GUIDE.md` - May contain analytics details
- `_config.local.yml` - Local configuration
- `*.local.*` - Any local files
- `*.secret.*` - Any secret files

### Build & Cache
- `_site/` - Built website (regenerated, may contain sensitive data)
- `.sass-cache/` - CSS cache
- `.jekyll-cache/` - Jekyll cache
- `.DS_Store` - macOS system files

## 🔍 How to Verify Before Committing

Always check what you're about to commit:

```bash
# See what files will be committed
git status

# See the actual changes
git diff

# Verify sensitive files are ignored
git check-ignore -v admin-analytics.html ADMIN_PASSWORD.md pb_data/ pocketbase
```

## 🛡️ Security Best Practices

1. **Before Committing:**
   - Run `git status` to review files
   - Run `git diff` to review changes
   - Never use `git add .` without reviewing

2. **Passwords:**
   - Never hardcode passwords in committed files
   - Use template files with placeholders
   - Store real credentials in a password manager (not in repository files)

3. **Database:**
   - Never commit `pb_data/` folder
   - Migration files are safe (schema only)
   - Never commit database backups

4. **API Keys:**
   - Never commit API keys or tokens
   - Use environment variables for production
   - Keep local config separate

## 📝 What to Do If You Accidentally Commit Sensitive Data

If you accidentally commit sensitive data:

1. **Don't push to GitHub yet!**
2. Remove the file from git history:
   ```bash
   git rm --cached <filename>
   git commit --amend -m "Remove sensitive file"
   ```
3. Change any exposed passwords immediately
4. If already pushed, consider the password compromised and change it

## 🌐 Production Deployment

For production deployment:

1. Update `PB_URL` in `js/pocketbase-integration.js` to your production PocketBase URL
2. Deploy PocketBase to a secure server
3. Use HTTPS for all API communications
4. Set up proper CORS policies
5. Regular database backups (stored securely, not in git)

## ✅ Current Status

- ✅ All sensitive files are properly ignored
- ✅ No passwords in committed files
- ✅ No database data in repository
- ✅ Templates use placeholders only
- ✅ PocketBase executable and data excluded

---

**Last Updated:** March 1, 2026

**For Questions:** Contact fredykraft7@gmail.com
