# Quick Start Cheat Sheet

## First Time Setup

```bash
# 1. Install dependencies
npm install

# 2. Build the site
npm run build

# 3. Preview locally
npm run serve
```

## Daily Workflow

```bash
# Write a new post
# Create: posts/2025-11-17-my-post.md

# Build and preview
npm run dev

# When happy, commit and push
git add .
git commit -m "Add new post"
git push
```

## Post Template

```markdown
---
title: Your Post Title
date: 2025-11-17
description: Brief description for SEO
tags: [tag1, tag2, tag3]
---

# Your Post Title

Your content here in Markdown...
```

## Key Commands

| Command | What it does |
|---------|-------------|
| `npm install` | Install dependencies (once) |
| `npm run build` | Build site to dist/ |
| `npm run serve` | Preview at http://localhost:8000 |
| `npm run dev` | Build + Serve in one command |

## File Structure

```
├── src/              # HTML templates & CSS
│   ├── index.html
│   ├── about.html
│   ├── blog.html
│   ├── post-template.html
│   └── css/
├── posts/           # Your blog posts (Markdown)
│   └── *.md
├── public/          # Static assets (images, etc)
├── dist/            # Built site (generated, don't edit)
└── build.js         # Build script
```

## Customization Checklist

- [ ] Replace "Your Name" everywhere
- [ ] Update social links (GitHub, Twitter, etc.)
- [ ] Update email address
- [ ] Write your About page content
- [ ] Add your profile photo to `public/images/`
- [ ] Customize colors in `src/css/variables.css`
- [ ] Delete or replace sample blog posts
- [ ] Update repository name in README.md

## Common Tasks

### Add a new page
1. Create `src/new-page.html`
2. Copy header/footer from existing pages
3. Add link to navigation
4. Build and test

### Change colors
Edit `src/css/variables.css`:
```css
:root {
  --color-accent: #2563eb; /* Change this */
}
```

### Add your photo
1. Put image in `public/images/profile.jpg`
2. Add to HTML: `<img src="/assets/images/profile.jpg">`

### Use custom domain
1. Add file `public/CNAME` with your domain
2. Configure DNS at your domain provider
3. Enable HTTPS in GitHub Pages settings

## GitHub Pages URLs

- Personal site: `https://username.github.io`
- Project site: `https://username.github.io/repo-name`

For project sites, update all absolute paths:
- `/css/main.css` → `/repo-name/css/main.css`

## Need Help?

1. Read SETUP.md for detailed instructions
2. Check README.md for project overview
3. Look at sample posts for Markdown examples
4. Check browser console for errors
5. Review GitHub Actions logs if deployment fails

## Pro Tips

- Write posts in advance with future dates
- Use descriptive filenames for posts
- Keep paragraphs short for readability
- Add images to break up text
- Preview before pushing
- Commit often with clear messages

---

Ready to start? Run `npm install` and dive in! 🚀
