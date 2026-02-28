# Chirui Huang's Personal Website

A minimal, clean personal website built with Jekyll.

## 🚀 Quick Start - View Your Website

### Step 1: Install Jekyll (First Time Only)
If you haven't already, install Jekyll:
```bash
# Check if Ruby is installed
ruby -v

# Install Bundler if not installed
gem install bundler

# Navigate to your project
cd "/Users/cheerie/Documents/Cheerie Personal Website/chirui-personal-website"

# Install all dependencies
bundle install
```

### Step 2: Start the Local Preview Server
```bash
# Make sure you're in the project directory
cd "/Users/cheerie/Documents/Cheerie Personal Website/chirui-personal-website"

# Start the server with live reload (auto-refresh browser on changes)
bundle exec jekyll serve --livereload

# Alternative: Start without live reload
bundle exec jekyll serve
```

### Step 3: Open Your Website in Browser
Once the server starts, open your browser and go to:
- **http://localhost:4000** or
- **http://127.0.0.1:4000**

### Step 4: Make Changes and See Them Live
1. Keep the terminal running (don't close it)
2. Edit any file in VS Code (HTML, CSS, config, etc.)
3. Save the file
4. Your browser will automatically refresh (if using `--livereload`)

### Stop the Server
When you're done, press `Ctrl + C` in the terminal

---

## 🛠️ Troubleshooting

### Problem: "bundle: command not found"
**Solution:**
```bash
gem install bundler
```

### Problem: "Could not find gem 'jekyll'"
**Solution:**
```bash
cd "/Users/cheerie/Documents/Cheerie Personal Website/chirui-personal-website"
bundle install
```

### Problem: "Address already in use" or "Port 4000 is in use"
**Solution:** Kill the existing server or use a different port:
```bash
# Use a different port (e.g., 4001)
bundle exec jekyll serve --port 4001

# Or find and kill the process using port 4000
lsof -ti:4000 | xargs kill -9
```

### Problem: Changes don't appear in browser
**Solution:**
1. Do a hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
2. Stop the server (`Ctrl + C`) and restart it
3. Clear browser cache
4. Make sure you're editing files in the correct folder

### Problem: Ruby version issues
**Solution:**
```bash
# Check Ruby version (needs 2.5.0 or higher)
ruby -v

# If needed, install/update Ruby using Homebrew (Mac)
brew install ruby
```

---

## 📁 Website Structure & Pages

Your website has 5 main pages:
- **Profile** (`/profile/`) — About you, CV, contact info
- **Research** (`/research/`) — Research papers and reports
- **Podcasts** (`/podcasts/`) — Podcast episodes
- **Videos** (`/videos/`) — Video content
- **Tools** (`/tools/`) — Financial tools and calculators

---

## ✏️ How to Edit Your Website

### Edit Site Settings (Name, Email, Social Media)
**File:** `_config.yml`

Change your name, email, social media links:
```yaml
title: Chirui Huang
author-name: Chirui Huang
author-email: Fredykraft7@gmail.com
social-instagram: cheerie.huang
social-youtube: FredyKraft
social-linkedin: chirui-h-595ba6270
```

**Important:** After editing `_config.yml`, you must restart the server!

### Edit Page Content
Edit these HTML files directly:
- `profile.html` — Your profile page
- `research.html` — Research page
- `podcasts.html` — Podcasts page
- `videos.html` — Videos page
- `tools.html` — Tools page

### Change Colors
**File:** `_sass/0-settings/_colors.scss`

Current primary color: Light green (`#7BD389`)

### Add Images or Files
1. Create an `assets/` or `images/` folder if it doesn't exist
2. Put your images, PDFs, etc. there
3. Reference them in your pages: `/assets/your-file.pdf`

---

## 🌐 Deploy Your Website Online

### Option 1: GitHub Pages (Free & Easy)
```bash
# Initialize git (first time only)
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

Then enable GitHub Pages in your repository settings.

### Option 2: Push Updates to Existing Repository
```bash
git add .
git commit -m "Update: describe your changes"
git push origin main
```

---

## 🎨 Customize Colors

**Location:** `_sass/0-settings/_colors.scss`

Current primary color: **Light green (#7BD389)**

Change the color values to customize your site's appearance.

---

## � Support This Project

If you find this website template useful, consider supporting my work:

- 💳 **PayPal**: [paypal.me/saygoodnight88](https://paypal.me/saygoodnight88)
- 💵 **Zelle**: saygoodnight88@gmail.com

Your support helps me create more content and maintain this website!

---

## �📞 Contact & Author

**Chirui Huang**  
📧 Fredykraft7@gmail.com  
💼 [LinkedIn](https://www.linkedin.com/in/chirui-h-595ba6270)  
📸 Instagram: [@cheerie.huang](https://instagram.com/cheerie.huang)  
📺 YouTube: [FredyKraft](https://youtube.com/@FredyKraft)

