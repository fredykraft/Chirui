# Chirui Huang Personal Website

Personal website built with Jekyll and hosted on GitHub Pages.

## Live Site

- Public URL: https://fredykraft.github.io/Chirui/

## Local Development

### 1) Prerequisites

- Ruby (recommended: 3.x)
- Bundler

Install Bundler if needed:

```bash
gem install bundler
```

### 2) Install dependencies

```bash
cd /Users/cheerie/Documents/GitHub/Chirui
bundle install
```

### 3) Run local preview

Use both config files so local URLs work correctly:

```bash
bundle exec jekyll serve --config _config.yml,_config_dev.yml
```

Open:

- http://localhost:4000/

Stop server:

- `Ctrl + C`

## Project Structure

### Main Pages

- `index.html` — Home
- `profile.html` — Profile
- `research.html` — Research
- `podcasts.html` — Podcast
- `videos.html` — Video
- `tools.html` — Lab

### Layout and Includes

- `_layouts/default.html` — global page layout (header/footer)
- `_includes/header.html` — top navigation
- `_includes/head.html` — metadata and CSS includes

### Styling

- `_sass/` — SCSS source files
- `_sass/5-components/_header.scss` — header and nav styles

### JavaScript

- `js/main.js` — search, navigation interactions, UI behavior

## Configuration

Edit site-wide settings in `_config.yml`:

- `title`
- `description`
- `url`
- `baseurl` (currently `/Chirui` for GitHub Pages project site)
- social links and author fields

For local development overrides, use `_config_dev.yml` together with `_config.yml`.

## Deployment (GitHub Pages)

This repository is already connected to:

- `origin`: `https://github.com/fredykraft/Chirui.git`
- branch: `main`

Publish updates:

```bash
git add .
git commit -m "Describe your update"
git push origin main
```

GitHub Pages typically updates in 1–3 minutes.

## Troubleshooting

### `bundle: command not found`

```bash
gem install bundler
```

### Port 4000 already in use

```bash
lsof -ti:4000 | xargs kill -9
```

or run on another port:

```bash
bundle exec jekyll serve --port 4001 --config _config.yml,_config_dev.yml
```

### Changes not visible

1. Hard refresh browser (`Cmd + Shift + R`)
2. Restart Jekyll server
3. Confirm you edited files in this repo path: `/Users/cheerie/Documents/GitHub/Chirui`

## Support My Work

If you'd like to support my work and help me continue creating content, you can:

- 💜 **GitHub Sponsors**: [Sponsor @fredykraft](https://github.com/sponsors/fredykraft)
- 💳 **PayPal**: [paypal.me/chiruihuang079](https://www.paypal.me/chiruihuang079) or `chiruihuang079@gmail.com`

Your support helps me dedicate more time to research, content creation, and open-source projects!

## Collaborate With Me

I'm always open to collaboration opportunities! Whether you're interested in:

- 🤝 Research partnerships
- 🎙️ Podcast interviews or guest appearances
- 🎥 Video collaborations
- 💻 Open-source contributions
- 📝 Co-authoring articles or papers
- 🎤 Speaking engagements

Feel free to reach out:

- **Email**: Fredykraft7@gmail.com
- **LinkedIn**: [linkedin.com/in/chirui-h-595ba6270](https://www.linkedin.com/in/chirui-h-595ba6270)
- **GitHub Issues**: Open an issue in this repository for collaboration ideas

## Security Notes

- Do not commit secrets or private credentials.
- Keep sensitive docs and local-only files in `.gitignore`.
- If anything sensitive is exposed, rotate credentials immediately.

