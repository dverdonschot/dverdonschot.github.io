# Image Guidelines for Blog Posts

This guide provides comprehensive standards and best practices for adding images to blog posts.

## Image Format Standards

### Recommended Formats

1. **WebP** (Primary recommendation)
   - Modern format with superior compression
   - Supports transparency and animation
   - Best for photos and graphics
   - Browser support: All modern browsers
   - Use for: Hero images, thumbnails, content images

2. **JPEG** (Fallback for photos)
   - Excellent compression for photographs
   - No transparency support
   - Universal browser support
   - Use for: Photographic content when WebP unavailable

3. **PNG** (For specific use cases)
   - Lossless compression
   - Supports transparency
   - Larger file sizes
   - Use for: Screenshots, diagrams, images requiring transparency

4. **SVG** (For vector graphics)
   - Scalable without quality loss
   - Small file sizes for simple graphics
   - Use for: Icons, logos, diagrams, illustrations

## Image Dimensions

### Hero Images
- **Recommended size**: 1600x900 pixels (16:9 aspect ratio)
- **Maximum file size**: 300KB (WebP), 500KB (JPEG)
- **Minimum size**: 1200x675 pixels

### Thumbnails
- **Recommended size**: 800x450 pixels (16:9 aspect ratio)
- **Maximum file size**: 150KB (WebP), 250KB (JPEG)
- **Minimum size**: 600x338 pixels

### Content Images
- **Maximum width**: 1200 pixels
- **Maximum file size**: 200KB per image
- **Aspect ratio**: Maintain original, or use 16:9, 4:3, or 1:1

## File Naming Conventions

### Pattern
\`\`\`
{post-slug}-{description}-{variant}.{ext}
\`\`\`

### Examples
- \`exploring-rust-hero.webp\` - Hero image for "Exploring Rust" post
- \`exploring-rust-thumbnail.webp\` - Thumbnail image
- \`exploring-rust-code-example-1.png\` - First code example screenshot
- \`exploring-rust-diagram.svg\` - Architecture diagram

### Rules
- Use lowercase only
- Use hyphens, not underscores or spaces
- Be descriptive but concise
- Include variant suffix (\`-hero\`, \`-thumbnail\`, \`-1\`, \`-2\`, etc.)
- Match the post slug for easy identification

## Folder Structure

### Organization
\`\`\`
images/
├── blog/
│   ├── 2025/
│   │   ├── exploring-rust-hero.webp
│   │   ├── exploring-rust-thumbnail.webp
│   │   ├── exploring-rust-code-1.png
│   │   └── data-structures-hero.webp
│   ├── 2024/
│   │   └── ...
│   └── shared/
│       ├── default-hero.webp
│       └── default-thumbnail.webp
├── assets/
│   ├── icons/
│   └── logos/
└── social/
    └── og-images/
\`\`\`

### Path Guidelines
- Organize by year: \`images/blog/YYYY/\`
- Use \`shared/\` for reusable images
- Keep social media images separate: \`images/social/\`
- Store site assets separately: \`images/assets/\`

## Frontmatter Integration

### Basic Image Configuration
\`\`\`yaml
---
title: "Exploring Rust for Systems Programming"
date: "2025-01-15"
heroImage: "/images/blog/2025/exploring-rust-hero.webp"
heroImageAlt: "Rust programming language logo with gears representing systems programming"
thumbnail: "/images/blog/2025/exploring-rust-thumbnail.webp"
thumbnailAlt: "Rust logo thumbnail"
---
\`\`\`

### Advanced Configuration
\`\`\`yaml
---
title: "Understanding Data Structures"
date: "2025-01-20"
heroImage: "/images/blog/2025/data-structures-hero.webp"
heroImageAlt: "Visual representation of binary tree and linked list data structures"
heroImageCredit: "Photo by Jane Developer"
heroImageCreditUrl: "https://unsplash.com/@janedev"
thumbnail: "/images/blog/2025/data-structures-thumbnail.webp"
thumbnailAlt: "Data structures thumbnail showing tree diagram"
ogImage: "/images/social/data-structures-og.png"
---
\`\`\`

### Required Fields
- \`heroImage\`: Absolute path from site root (starting with \`/\`)
- \`heroImageAlt\`: Descriptive alt text for accessibility

### Optional Fields
- \`thumbnail\`: Smaller version for lists/previews
- \`thumbnailAlt\`: Alt text for thumbnail
- \`heroImageCredit\`: Attribution for image source
- \`heroImageCreditUrl\`: Link to source/photographer
- \`ogImage\`: Custom Open Graph image for social sharing

## Alt Text Guidelines

### Writing Effective Alt Text

**DO:**
- Describe the content and function of the image
- Be specific and concise (aim for 125 characters or less)
- Include relevant context for the post
- Mention text visible in the image
- Describe actions or emotions if relevant

**DON'T:**
- Start with "Image of" or "Picture of"
- Include redundant information
- Be overly verbose
- Use alt text for decorative images (use empty alt="")

### Examples

**Good:**
\`\`\`yaml
heroImageAlt: "Rust crab mascot next to code snippet showing ownership system"
\`\`\`

**Better:**
\`\`\`yaml
heroImageAlt: "Rust's borrow checker preventing data race in multi-threaded code example"
\`\`\`

**Poor:**
\`\`\`yaml
heroImageAlt: "Image of Rust programming"
\`\`\`

### Context-Specific Alt Text
- **Code screenshots**: Describe what the code demonstrates
- **Diagrams**: Explain the relationships/flow being shown
- **Photos**: Describe relevant elements, not every detail
- **Charts**: State the key finding or trend

## Image Optimization

### Tools & Techniques

#### Online Tools
- **Squoosh**: https://squoosh.app/ - Google's image compression tool
- **TinyPNG**: https://tinypng.com/ - PNG and JPEG compression
- **CloudConvert**: https://cloudconvert.com/ - Format conversion

#### Command Line Tools
\`\`\`bash
# Convert to WebP with cwebp
cwebp -q 80 input.jpg -o output.webp

# Optimize JPEG with jpegoptim
jpegoptim --max=85 --strip-all input.jpg

# Optimize PNG with optipng
optipng -o7 input.png

# Batch convert to WebP
for img in *.jpg; do cwebp -q 80 "\$img" -o "\${img%.jpg}.webp"; done
\`\`\`

#### Build-Time Optimization
Consider adding automated optimization to your build process:
\`\`\`javascript
// Example using sharp in build.js
import sharp from 'sharp';

await sharp('input.jpg')
  .resize(1600, 900, { fit: 'cover' })
  .webp({ quality: 80 })
  .toFile('output.webp');
\`\`\`

### Optimization Checklist
- [ ] Resize to appropriate dimensions before uploading
- [ ] Compress images (target 80-85% quality for WebP/JPEG)
- [ ] Convert to WebP when possible
- [ ] Strip unnecessary metadata
- [ ] Use progressive/interlaced formats for large images
- [ ] Verify file size meets guidelines

## Storage Recommendations

### Git Repository (Current approach)
**Best for:**
- Small to medium sized blogs
- Images under 1MB each
- Total image assets under 100MB
- Simple deployment workflow

**Considerations:**
- Keep repository size manageable
- Optimize aggressively before committing
- Use Git LFS if assets exceed 100MB

### External CDN (Future consideration)
**Consider when:**
- Repository size exceeds 200MB
- Many high-resolution images needed
- Global audience requiring fast load times
- Video or large media files needed

**Options:**
- **Cloudinary**: Free tier available, automatic optimization
- **imgix**: Advanced image processing, real-time transforms
- **GitHub Releases**: Free, simple for large assets
- **Netlify Large Media**: Integrated with Git LFS

## Performance Considerations

### Lazy Loading
Images should be lazy loaded by default (browser native):
\`\`\`html
<img src="image.webp" alt="Description" loading="lazy">
\`\`\`

### Responsive Images
Consider providing multiple sizes:
\`\`\`html
<img
  srcset="
    /images/blog/2025/post-400.webp 400w,
    /images/blog/2025/post-800.webp 800w,
    /images/blog/2025/post-1600.webp 1600w
  "
  sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1600px"
  src="/images/blog/2025/post-800.webp"
  alt="Description"
  loading="lazy"
>
\`\`\`

### WebP with Fallback
\`\`\`html
<picture>
  <source srcset="/images/blog/2025/post-hero.webp" type="image/webp">
  <source srcset="/images/blog/2025/post-hero.jpg" type="image/jpeg">
  <img src="/images/blog/2025/post-hero.jpg" alt="Description" loading="lazy">
</picture>
\`\`\`

### Performance Budget
- **Hero image**: Maximum 300KB
- **Thumbnails**: Maximum 150KB
- **Total images per post**: Aim for under 2MB
- **LCP target**: Hero image should load in under 2.5s

## Accessibility Checklist

- [ ] All images have descriptive alt text
- [ ] Alt text is meaningful and concise
- [ ] Decorative images use empty alt=""
- [ ] Color is not the only means of conveying information
- [ ] Text in images is also available as real text
- [ ] Image links have descriptive alt text explaining destination
- [ ] Sufficient contrast for any text overlays
- [ ] Images don't flash or strobe (seizure risk)

## Quick Reference

| Image Type | Dimensions | Format | Max Size | Path |
|------------|------------|--------|----------|------|
| Hero | 1600x900 | WebP | 300KB | \`/images/blog/YYYY/post-slug-hero.webp\` |
| Thumbnail | 800x450 | WebP | 150KB | \`/images/blog/YYYY/post-slug-thumbnail.webp\` |
| Content | ≤1200px wide | WebP/PNG | 200KB | \`/images/blog/YYYY/post-slug-desc.webp\` |
| Diagram | Scalable | SVG | 50KB | \`/images/blog/YYYY/post-slug-diagram.svg\` |
| Screenshot | As needed | PNG | 200KB | \`/images/blog/YYYY/post-slug-screenshot.png\` |

## Example: Complete Post with Images

\`\`\`yaml
---
title: "Building a Markdown Parser in Rust"
date: "2025-01-30"
author: "Your Name"
excerpt: "Learn how to build a fast and efficient Markdown parser using Rust"
tags: ["rust", "parsing", "markdown"]
heroImage: "/images/blog/2025/markdown-parser-hero.webp"
heroImageAlt: "Code editor showing Rust implementation of Markdown parser with abstract document flow diagram in background"
thumbnail: "/images/blog/2025/markdown-parser-thumbnail.webp"
thumbnailAlt: "Markdown logo with Rust crab mascot"
---

# Building a Markdown Parser in Rust

In this post, we'll explore how to build a performant Markdown parser...

![Parser architecture diagram](/images/blog/2025/markdown-parser-diagram.svg)
*Figure 1: High-level architecture of our Markdown parser*

## Implementation Details

Here's the core parsing logic:

![Code screenshot showing parser implementation](/images/blog/2025/markdown-parser-code-1.png)
*Listing 1: Token recognition and parsing*

...
\`\`\`

## Additional Resources

- [WebP Documentation](https://developers.google.com/speed/webp)
- [WCAG Image Guidelines](https://www.w3.org/WAI/tutorials/images/)
- [MDN Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [Web.dev Image Optimization](https://web.dev/fast/#optimize-your-images)

---

**Last Updated**: 2025-01-30
**Maintainer**: Blog Development Team
