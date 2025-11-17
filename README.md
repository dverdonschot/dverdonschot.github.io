# Dennis Verdonschot's Personal Website

A modern, framework-free static site built with plain HTML, CSS, and JavaScript.

## Features

✨ **Modern & Clean Design**
- Responsive layout that works on all devices
- Dark/light theme with system preference detection
- Smooth animations and transitions

📝 **Markdown-Powered Blog**
- Write posts in Markdown with frontmatter
- Automatic syntax highlighting for code blocks
- Reading time estimation
- Tag support

🚀 **SEO & Performance**
- Auto-generated sitemap.xml
- RSS feed for subscribers
- Open Graph and Twitter Card meta tags
- Cache-busted CSS
- Semantic HTML

♿ **Accessibility**
- Skip-to-content links
- ARIA labels
- Keyboard navigation support
- Proper heading hierarchy

## Quick Start

```bash
# Install dependencies
npm install

# Build the site
npm run build

# Serve locally
npm run serve

# Or do both
npm run dev
```

Visit http://localhost:8000 to see your site.

## Project Structure

```
.
├── src/
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   ├── index.html     # Home page template
│   ├── blog.html      # Blog index template
│   ├── about.html     # About page
│   ├── post-template.html  # Blog post template
│   ├── 404.html       # Custom 404 page
│   └── robots.txt     # Search engine directives
├── posts/             # Markdown blog posts
│   └── 2025/          # Organized by year
├── public/            # Static assets (copied to dist/assets)
├── dist/              # Built site (generated)
└── build.js           # Build script
```

## Writing Blog Posts

Create a new Markdown file in `posts/` (organize by year/month if you like):

```markdown
---
title: My Awesome Post
date: 2025-01-15
description: A short description of the post
tags: [javascript, web-dev]
---

Your content here in **Markdown**!

\`\`\`javascript
console.log('Code blocks are syntax highlighted!');
\`\`\`
```

Then run `npm run build` to generate the HTML.

## Customization

### Colors & Theme
Edit `src/css/variables.css` to change colors, fonts, spacing, etc.

### Content
- Update `src/about.html` with your information
- Modify templates in `src/` to change layout
- Add your own pages by creating new HTML files

### Build Process
The `build.js` script handles:
- Markdown → HTML conversion
- Template replacement
- RSS feed generation
- Sitemap generation
- Static file copying

## Deployment

### GitHub Pages

1. Build your site: `npm run build`
2. Commit the `dist/` directory
3. In GitHub repo settings, set Pages source to the `dist/` folder
4. Your site will be live at `https://yourusername.github.io`

### GitHub Actions (Automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Tech Stack

- **No frameworks** - Just HTML, CSS, and vanilla JavaScript
- **Build Tools** - Node.js for the build script
- **Markdown** - `marked` for parsing, `gray-matter` for frontmatter
- **Syntax Highlighting** - highlight.js (via CDN)
- **Hosting** - GitHub Pages (free!)

## License

Feel free to fork and use this template for your own site!

## Credits

Built by [Dennis Verdonschot](https://github.com/dverdonschot)
