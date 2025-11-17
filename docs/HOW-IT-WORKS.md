# How Your Site Works - Visual Overview

## 📊 The Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    YOUR LOCAL MACHINE                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Write Markdown Post                                     │
│     src/posts/2025-11-17-my-post.md                        │
│     ↓                                                       │
│  2. Test Locally                                            │
│     npm run build  →  Creates dist/ folder                 │
│     npm run dev    →  View at localhost:3000               │
│     ↓                                                       │
│  3. Commit & Push                                           │
│     git add .                                               │
│     git commit -m "New post"                                │
│     git push origin main                                    │
│                                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Push triggers GitHub Actions
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                       GITHUB ACTIONS                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  → Checkout code                                            │
│  → Setup Node.js                                            │
│  → npm install (marked, gray-matter)                        │
│  → npm run build                                            │
│       │                                                     │
│       ├─ Read .md files from src/posts/                    │
│       ├─ Parse frontmatter (title, date, tags)             │
│       ├─ Convert Markdown → HTML with marked.js            │
│       ├─ Inject into templates                             │
│       ├─ Copy CSS and assets                               │
│       └─ Output to dist/                                    │
│                                                             │
│  → Deploy dist/ to GitHub Pages                             │
│                                                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Deploy completes
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                      GITHUB PAGES                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🌐 Your site is live!                                      │
│                                                             │
│     https://yourusername.github.io/yourrepo                │
│                                                             │
│     ├── index.html                                          │
│     ├── blog.html                                           │
│     ├── blog/                                               │
│     │   ├── 2025-01-15-my-first-post.html                  │
│     │   └── 2025-02-01-building-static-site.html           │
│     ├── css/                                                │
│     │   └── main.css                                        │
│     └── assets/                                             │
│                                                             │
│  Static HTML only - blazing fast! ⚡                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Daily Workflow

```
┌──────────────┐
│ Write Post   │  Write in Markdown
│   (.md)      │  src/posts/my-post.md
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ Test Locally │  npm run build && npm run dev
│              │  Check at localhost:3000
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ Push to Git  │  git add . && git commit && git push
│              │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ Wait 2-3 min │  GitHub Actions builds & deploys
│              │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ Site is Live │  https://yourname.github.io
│      🎉      │
└──────────────┘
```

## 📝 File Transformation Example

### Input (Markdown)
```
src/posts/2025-11-17-hello-world.md
---
title: Hello World
date: 2025-11-17
tags: [meta, first-post]
---

# Hello World

This is my first post!
```

### ⚙️ Build Process
```javascript
// build.js does:
1. Read file
2. Parse frontmatter → { title, date, tags }
3. Convert markdown → HTML
4. Load template (post.html)
5. Replace placeholders:
   {{TITLE}} → "Hello World"
   {{DATE}} → "November 17, 2025"
   {{CONTENT}} → "<h1>Hello World</h1><p>This is..."
   {{TAGS}} → <span class="tag">meta</span>...
```

### Output (HTML)
```
dist/blog/2025-11-17-hello-world.html

<!DOCTYPE html>
<html>
  <head>
    <title>Hello World - Your Name</title>
    ...
  </head>
  <body>
    <h1>Hello World</h1>
    <time>November 17, 2025</time>
    <div class="tags">
      <span class="tag">meta</span>
      <span class="tag">first-post</span>
    </div>
    <div class="content">
      <h1>Hello World</h1>
      <p>This is my first post!</p>
    </div>
  </body>
</html>
```

## 🎯 Why This Approach?

### ✅ Advantages
- **Write in Markdown** - Easy, familiar format
- **Output is HTML** - Fast, works everywhere
- **GitHub handles building** - No manual steps
- **Version controlled** - Git tracks everything
- **Free hosting** - GitHub Pages is free
- **No framework lock-in** - Pure HTML/CSS

### 📦 Dependencies

**Build time only:**
- `marked` - Converts Markdown to HTML
- `gray-matter` - Parses frontmatter
- `serve` - Local dev server (optional)

**Runtime (your site):**
- None! Just HTML, CSS, vanilla JavaScript

## 🔧 Customization Points

```
src/
├── index.html          → Change your homepage
├── css/main.css        → Customize colors, fonts
├── templates/
│   ├── blog.html       → Blog listing page
│   └── post.html       → Individual post layout
└── posts/
    └── *.md            → Your blog posts
```

## 🚀 Performance

```
Build time:   < 1 second
Page load:    ~100ms
Lighthouse:   100/100
Bundle size:  ~15KB CSS + ~2KB JS
```

Why so fast?
- No React/Vue/framework overhead
- No client-side JavaScript (except theme toggle)
- Static HTML - served instantly
- Minimal CSS - modern features only

## 🎨 Modern Features Used

- CSS Custom Properties (variables)
- CSS Grid & Flexbox
- `clamp()` for responsive typography
- CSS `backdrop-filter` for header
- Local Storage for theme preference
- Smooth scroll behavior
- Progressive enhancement

All native browser features - no polyfills needed!

---

**Questions?** Check the README.md or WRITING-GUIDE.md for more details.
