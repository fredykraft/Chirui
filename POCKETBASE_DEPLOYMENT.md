# 🚀 PocketBase Deployment Guide (PocketHost)

This guide will help you deploy your PocketBase backend to PocketHost so your forms work on your public GitHub Pages website.

## Why Deploy PocketBase?

Your forms currently use `http://127.0.0.1:8090` (localhost), which **only works on your computer**. To make forms work on your public website at `https://optmo.org/`, you need to deploy PocketBase to a cloud service.

---

## Option 1: PocketHost (Recommended - Easiest)

**PocketHost** is specifically designed for hosting PocketBase applications.

### Step 1: Sign Up for PocketHost

1. Go to: **https://pockethost.io**
2. Click "Sign Up" (or "Get Started")
3. Create a free account
4. Verify your email

### Step 2: Create a New Instance

1. Log in to PocketHost
2. Click **"Create Instance"** or **"New Instance"**
3. Choose a name for your instance (e.g., `chirui-website`)
4. Select the **Free tier** (should be default)
5. Click **"Create"**

### Step 3: Get Your PocketBase URL

After creating the instance, you'll get a URL like:
```
https://chirui-website.pockethost.io
```

**Copy this URL!** You'll need it in the next steps.

### Step 4: Set Up Your Database

1. Click on your instance in PocketHost dashboard
2. Click **"Open Admin"** or visit your URL: `https://your-instance.pockethost.io/_/`
3. Create an admin account (use your same email and password as local, or new ones)
4. **Create the required collections** (same as you did locally):
   - `contacts`
   - `newsletter_subscribers`
   - `comments`
   - `users` (auth collection)

**Important:** Use the same field configurations as your local setup! See [POCKETBASE_SETUP.md](POCKETBASE_SETUP.md) for detailed collection setup.

### Step 5: Migrate Your Local Data (Optional)

If you want to keep your existing data:

1. On your computer, go to: `pb_data/data.db`
2. Download your database backup from PocketHost
3. Use a SQLite tool to merge data, or:
4. Start fresh (recommended if you only have test data)

### Step 6: Update Your Website Configuration

Edit the file: **`js/pocketbase-config.js`**

**Find this line:**
```javascript
// window.POCKETBASE_URL = 'YOUR-POCKETBASE-URL';
```

**Change it to:**
```javascript
window.POCKETBASE_URL = 'https://chirui-website.pockethost.io';
```
*(Replace with YOUR actual PocketHost URL)*

**Make sure to UNCOMMENT it** (remove the `//` at the start).

### Step 7: Configure CORS (If Needed)

PocketHost usually handles CORS automatically, but if you have issues:

1. Go to PocketHost admin panel
2. Settings → Application → CORS
3. Add your GitHub Pages URL: `https://fredykraft.github.io`

### Step 8: Rebuild and Deploy

```bash
# Rebuild your Jekyll site
rm -rf _site
bundle exec jekyll build

# Commit changes
git add js/pocketbase-config.js _includes/javascripts.html js/pocketbase-integration.js js/user-auth.js
git commit -m "feat: Add PocketBase production deployment support"

# Push to GitHub
git push origin main
```

### Step 9: Test Your Forms

1. Wait 1-2 minutes for GitHub Pages to rebuild
2. Visit: **https://optmo.org/**
3. Try submitting:
   - Contact form
   - Newsletter subscription
   - A comment
   - User registration (if applicable)
4. Check your PocketHost admin panel to verify submissions appear

---

## Option 2: Railway.app

**Railway** offers $5/month free credit and is good for developers.

### Quick Steps:

1. Sign up at **https://railway.app**
2. Click **"New Project"**
3. Search for **"PocketBase"** template
4. Deploy (uses your $5 free credit)
5. Get your Railway URL (e.g., `https://yourapp.railway.app`)
6. Follow Steps 6-9 from PocketHost instructions above

**Pros:**
- More control over server
- Can run other services alongside PocketBase

**Cons:**
- Slightly more technical
- Credit-based (must monitor usage)

---

## Option 3: Fly.io

**Fly.io** offers a free tier with some limitations.

### Quick Steps:

1. Install flyctl: `brew install flyctl` (macOS)
2. Sign up: `flyctl auth signup`
3. Create `fly.toml` configuration file
4. Deploy: `flyctl launch`
5. Get your Fly.io URL
6. Follow Steps 6-9 from PocketHost instructions above

**Pros:**
- True free tier (not credit-based)
- Good performance

**Cons:**
- Most technical option
- Requires command-line setup

---

## Comparison Table

| Service | Free Tier | Ease of Use | Best For |
|---------|-----------|-------------|----------|
| **PocketHost** | ✅ Yes | ⭐⭐⭐⭐⭐ Easiest | Beginners, quick setup |
| **Railway** | $5 credit/month | ⭐⭐⭐⭐ Easy | Developers, scalable projects |
| **Fly.io** | ✅ Yes (limited) | ⭐⭐⭐ Moderate | Technical users, control-focused |

---

## Testing Before Going Live

Before updating your live website, test locally:

1. Edit `js/pocketbase-config.js` with your production URL
2. Run: `bundle exec jekyll serve`
3. Visit: `http://localhost:4000`
4. Test all forms
5. Check PocketHost admin panel for submissions

If everything works locally with the production URL, it will work on GitHub Pages!

---

## Security Checklist

After deployment:

- ✅ Keep your PocketHost/Railway/Fly.io admin password secure
- ✅ Don't commit admin credentials to GitHub
- ✅ Use HTTPS only (all providers give you this)
- ✅ Review API rules to ensure proper permissions
- ✅ Monitor form submissions for spam
- ✅ Keep PocketBase updated (check provider dashboard)

---

## Troubleshooting

### Forms Still Don't Work After Deployment

**Check 1:** Verify `pocketbase-config.js` is uncommented
```javascript
// ❌ WRONG (commented):
// window.POCKETBASE_URL = 'https://yourapp.pockethost.io';

// ✅ CORRECT (uncommented):
window.POCKETBASE_URL = 'https://yourapp.pockethost.io';
```

**Check 2:** Open browser DevTools (F12) → Console tab
- Look for errors when submitting forms
- Common error: `CORS` or `NetworkError`

**Check 3:** Verify collections exist on production
- Go to your PocketHost admin panel
- Check all 4 collections are created with correct fields

**Check 4:** Test the API directly
```bash
# Replace with your URL
curl -X POST https://yourapp.pockethost.io/api/collections/contacts/records \
  -H "Content-Type: application/json" \
  -d '{"name":"Test", "email":"test@example.com", "message":"Testing", "submitted_at":"2026-03-01"}'
```

Should return: `{"id":"...", "name":"Test", ...}`

### "Unauthorized" or "Forbidden" Errors

- Check API Rules in PocketBase admin panel
- Create rule should be empty (allows public access)
- List/View/Update/Delete should be admin only

### Forms Work Locally But Not on GitHub Pages

- Clear browser cache (Ctrl+Shift+Delete)
- Wait 2-3 minutes for GitHub Pages to rebuild
- Check that you committed AND pushed `pocketbase-config.js`

---

## Cost Estimates

### PocketHost Free Tier
- **Cost:** $0/month
- **Limits:** 
  - 1 GB storage
  - Community support
  - Shared resources
- **Perfect for:** Personal websites, portfolios, small projects

### Railway
- **Cost:** $5 credit/month (free)
- **After credit:** ~$5-10/month depending on usage
- **Perfect for:** Projects that may scale

### Fly.io
- **Cost:** Free tier
- **Limits:**
  - 3 shared CPUs
  - 256 MB RAM
  - 1 GB storage
- **Perfect for:** Technical users wanting control

---

## Migration Path (Future)

If you outgrow the free tier:

1. **Export your data** from PocketHost
2. **Deploy to a VPS** (DigitalOcean, Linode, etc.)
3. **Update `pocketbase-config.js`** with new URL
4. **Push to GitHub**

Your website code doesn't change - just the URL!

---

## Next Steps

1. ✅ Choose a provider (PocketHost recommended)
2. ✅ Follow the setup steps above
3. ✅ Update `pocketbase-config.js`
4. ✅ Test locally first
5. ✅ Deploy to GitHub
6. ✅ Test on live site
7. ✅ Monitor submissions

---

## Support Resources

- **PocketHost Docs:** https://pockethost.io/docs
- **PocketBase Docs:** https://pocketbase.io/docs
- **Railway Docs:** https://docs.railway.app
- **Fly.io Docs:** https://fly.io/docs

---

## Summary

**Simplest Path:**
1. Sign up at **PocketHost.io**
2. Create instance → Get URL
3. Set up collections (same as local)
4. Edit `js/pocketbase-config.js` with your URL
5. Commit and push
6. Test forms on your live site!

**Time Required:** ~15-20 minutes

**Your forms will work everywhere!** 🎉
