# Public Assets

Put your static assets here (images, fonts, files, etc.)

This directory gets copied to `dist/assets/` during the build.

## Structure

```
public/
├── images/
│   ├── profile.jpg
│   ├── og-image.png (for social media previews)
│   └── blog/
│       └── post-images/
├── fonts/ (if using custom fonts)
└── files/ (downloadable files)
```

## Usage in HTML

```html
<img src="/assets/images/profile.jpg" alt="Profile photo">
```

## Usage in Markdown posts

```markdown
![Alt text](/assets/images/blog/my-image.png)
```

## Optimization Tips

- Compress images before uploading
- Use modern formats (WebP, AVIF) with fallbacks
- Keep file sizes reasonable for fast loading
- Use descriptive filenames
