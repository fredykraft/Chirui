# Deployment Issues and Solutions

## Issue 1: Forms Don't Work on Public Website ❌ CRITICAL

### The Problem
Your contact form, newsletter, and comments use PocketBase at `http://127.0.0.1:8090` (localhost). This ONLY works on your computer when PocketBase is running locally.

**GitHub Pages (your public website) CANNOT connect to localhost** because:
- GitHub Pages serves static files from GitHub's servers
- Your PocketBase runs on YOUR computer
- Visitors to optmo.org/ cannot access YOUR localhost

### The Solution (Choose One)

#### Option A: Deploy PocketBase to a Cloud Service (RECOMMENDED)

**Free/Low-Cost Options:**

1. **PocketHost** (Easiest - Built for PocketBase)
   - Website: https://pockethost.io
   - Free tier available
   - Steps:
     1. Create account at PocketHost
     2. Upload your `pb_data` folder or create new instance
     3. Get your public URL (e.g., https://yourapp.pockethost.io)
     4. Update `js/pocketbase-integration.js` and `js/user-auth.js` to use this URL

2. **Railway.app**
   - Free $5/month credit
   - Good for small projects
   - Deploy guide: https://railway.app/template/pocketbase

3. **Fly.io**
   - Free tier with 3 shared CPUs
   - More technical setup
   - Deploy guide: https://fly.io/docs/

4. **Render.com**
   - Free tier available
   - Easy deployment from GitHub

#### Option B: Use Alternative Form Services (No PocketBase needed)

If you don't want to deploy PocketBase:

1. **Formspree** - https://formspree.io
   - Free: 50 submissions/month
   - Replace form action with Formspree endpoint
   - No database needed

2. **Netlify Forms** - https://www.netlify.com/products/forms/
   - Deploy site to Netlify instead of GitHub Pages
   - Forms work automatically
   - Free: 100 submissions/month

3. **Google Forms**
   - Embed Google Forms
   - Free unlimited submissions
   - Responses go to Google Sheets

#### Option C: Keep Current Setup (Local Development Only)

If you only need forms to work when developing locally:
- Forms work when you run PocketBase locally
- Public website forms will show errors (not recommended for production)

### What Needs to Change

**File: `/js/pocketbase-integration.js`**
```javascript
// Current (localhost only):
const PB_URL = 'http://127.0.0.1:8090';

// Change to (public PocketBase):
const PB_URL = 'https://yourapp.pockethost.io'; // Or your deployed URL
```

**File: `/js/user-auth.js`**
```javascript
// Current (in constructor):
constructor(baseUrl = 'http://127.0.0.1:8090')

// Change to:
constructor(baseUrl = 'https://yourapp.pockethost.io')
```

---

## Issue 2: Search Index Shows "Unavailable" ⚠️

### The Problem
The search feature may be failing to load `/Chirui/search.json` on GitHub Pages.

### Troubleshooting Steps

1. **Verify search.json exists on GitHub Pages:**
   - Visit: https://optmo.org/search.json
   - Should show JSON with your pages/posts
   - If you see 404, the file isn't deploying

2. **Check browser console for errors:**
   - Open your website: https://optmo.org/
   - Press F12 to open Developer Tools
   - Click "Console" tab
   - Try typing in search box
   - Look for red error messages
   - Share any errors you see

3. **Verify Jekyll build includes search.json:**
   ```bash
   # Run this in terminal:
   find _site -name "search.json"
   ```
   Should output: `_site/search.json`

### Potential Fixes

If search.json returns 404 on GitHub Pages, rebuild and push:

```bash
# Clean and rebuild
rm -rf _site
bundle exec jekyll build

# Verify search.json was created
ls -la _site/search.json

# If it exists, commit and push
git add -A
git commit -m "fix: Ensure search.json is deployed"
git push origin main
```

### Testing Search Locally

Before deploying, test locally:

1. Start Jekyll server:
   ```bash
   bundle exec jekyll serve --port 4001
   ```

2. Visit: http://localhost:4001/Chirui/
3. Try searching - should work
4. Check console for any errors

---

## Quick Action Plan

### For Forms (Required for public site):

1. **Choose deployment option** (Option A recommended: PocketHost)
2. **Sign up** for chosen service
3. **Deploy PocketBase** or migrate to form service
4. **Update URLs** in `pocketbase-integration.js` and `user-auth.js`
5. **Test forms** on local site first
6. **Commit and push** changes to GitHub
7. **Test on public site**: https://optmo.org/

### For Search (Should already work):

1. **Test on public site**: https://optmo.org/
2. **Open browser console** (F12) and try searching
3. **If you see errors**, share them - I'll help fix
4. **If search.json returns 404**, rebuild and redeploy

---

## Current Status

✅ **Local Development (localhost:4000)**
- PocketBase: ✅ Works (localhost)
- Forms: ✅ Work (localhost PocketBase)
- Search: ✅ Should work
- User Auth: ✅ Works (localhost PocketBase)

❌ **Public Website (optmo.org/)**
- PocketBase: ❌ Not accessible (localhost only)
- Forms: ❌ Cannot submit (no backend)
- Search: ⚠️ Need to verify
- User Auth: ❌ Cannot work (no backend)

---

## Need Help?

**For PocketBase Deployment:**
1. Tell me which option you want (A, B, or C)
2. If Option A, tell me which service (PocketHost recommended)
3. I'll guide you through the setup

**For Search Issues:**
1. Visit: https://optmo.org/search.json
2. Tell me if you see JSON or a 404 error
3. Open your site and press F12, check the Console tab
4. Try searching and share any red error messages

---

## Security Note 🔒

When deploying PocketBase:
- **Keep admin email/password secure** - don't commit to GitHub
- **Use environment variables** for production URLs
- **Enable HTTPS** (all cloud services provide this)
- **Update CORS settings** in PocketBase to allow your GitHub Pages domain
