# Personal Site - Hybrid Static/Markdown Setup

A modern, framework-free personal website with blog support. Write posts in Markdown, build to static HTML via GitHub Actions.

## Features

- 🎨 Modern CSS with Grid, Flexbox, Container Queries
- 🌗 Dark/light mode
- 📝 Write blog posts in Markdown with frontmatter
- 🚀 Zero-framework - pure HTML/CSS/JS
- 🤖 Automatic building via GitHub Actions
- 📱 Fully responsive
- ♿ Accessible

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Write posts in `posts/*.md`

3. Build the site:
```bash
npm run build
```

4. Preview locally:
```bash
npm run serve
```

Open http://localhost:8000

## Writing Blog Posts

Create a new `.md` file in the `posts/` directory:

```markdown
---
title: My Awesome Post
date: 2025-01-15
description: A short description for SEO and previews
tags: [web, coding, tutorial]
---

# My Awesome Post

Your content here in Markdown...
```

## Deployment

Push to GitHub - GitHub Actions automatically builds and deploys to GitHub Pages.

## Project Structure

```
├── src/                  # Source files
│   ├── index.html
│   ├── about.html
│   ├── blog.html
│   └── css/
├── posts/               # Your blog posts (Markdown)
├── public/              # Static assets
├── dist/                # Built site (generated)
└── build.js             # Build script
```

## Customization

- **Colors/Theme**: Edit `src/css/variables.css`
- **Layout**: Edit HTML templates in `src/`
- **Content**: Edit Markdown files in `posts/`
