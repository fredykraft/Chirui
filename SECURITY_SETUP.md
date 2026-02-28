# 🔒 Security Setup Instructions

## ⚠️ IMPORTANT: Private Files Setup

This repository does **NOT** include sensitive credential files for security reasons. If you're the owner, follow these steps to set up your local environment:

## Required Private Files

The following files are **NOT** tracked in Git and must be created locally:

1. `ADMIN_PASSWORD.md` - Contains your admin dashboard password
2. `ADMIN_ANALYTICS_GUIDE.md` - Contains setup instructions with your password

## Setup Steps

### 1. Copy Template Files

```bash
# Copy the template files to create your private versions
cp ADMIN_PASSWORD.md.template ADMIN_PASSWORD.md
cp ADMIN_ANALYTICS_GUIDE.md.template ADMIN_ANALYTICS_GUIDE.md
```

### 2. Update With Your Information

Edit both files and replace placeholders:
- Replace `[YOUR_PASSWORD_HERE]` with your actual password
- Replace `YOUR_BASE64_HASH_HERE` with your password hash

### 3. Generate Password Hash

To generate the hash for `admin-analytics.html`:

1. Open browser console (F12 → Console)
2. Run:
   ```javascript
   btoa('YourActualPassword')
   ```
3. Copy the output
4. Update `admin-analytics.html` line 445:
   ```javascript
   var ADMIN_PASSWORD_HASH = 'YourBase64HashHere';
   ```

## Security Notes

✅ **Safe to commit:**
- `.gitignore` (blocks sensitive files)
- `*.template` files (contain placeholders only)
- `SECURITY_SETUP.md` (this file)

❌ **NEVER commit:**
- `ADMIN_PASSWORD.md` (contains actual password)
- `ADMIN_ANALYTICS_GUIDE.md` (contains actual password)
- `_config.local.yml` (if used for local settings)

## Verification

Check that sensitive files are ignored:

```bash
git status
# Should NOT show ADMIN_PASSWORD.md or ADMIN_ANALYTICS_GUIDE.md
```

## What If Sensitive Data Was Already Committed?

If you accidentally committed sensitive files:

### Option 1: Remove from Latest Commit
```bash
git rm --cached ADMIN_PASSWORD.md ADMIN_ANALYTICS_GUIDE.md
git commit -m "Remove sensitive files from tracking"
git push origin main
```

⚠️ **Note:** This only removes files from future commits. They remain in Git history.

### Option 2: Remove from All History (RECOMMENDED)

Use BFG Repo Cleaner to remove from entire history:

```bash
# Install BFG (Mac with Homebrew)
brew install bfg

# Clone a fresh copy
git clone --mirror https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Remove the files from all history
bfg --delete-files ADMIN_PASSWORD.md YOUR_REPO.git
bfg --delete-files ADMIN_ANALYTICS_GUIDE.md YOUR_REPO.git

# Clean up and force push
cd YOUR_REPO.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push --force
```

### Option 3: GitHub Secret Scanning

If passwords were exposed:
1. **Change your password immediately**
2. Generate a new hash
3. Update `admin-analytics.html` with new hash
4. Consider renaming payment accounts if exposed

## Additional Security

### Change Your Password

1. Choose a new strong password
2. Generate hash: `btoa('NewPassword')`
3. Update `admin-analytics.html`
4. Update `ADMIN_PASSWORD.md` (local only)
5. Commit and push the hash update

### Use Environment Variables (Advanced)

For production, consider using environment variables instead of hardcoded hashes.

## Questions?

- Review `.gitignore` to see what's excluded
- Check `git status` to verify nothing sensitive is staged
- Never share `ADMIN_PASSWORD.md` or `ADMIN_ANALYTICS_GUIDE.md`

---

**Last Updated:** February 28, 2026
