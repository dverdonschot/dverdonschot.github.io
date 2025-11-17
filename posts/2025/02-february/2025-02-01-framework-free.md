---
title: Why I Chose a Framework-Free Approach
date: 2025-02-01
description: Thoughts on building without JavaScript frameworks
tags: [web, opinion, javascript]
---

# Why I Chose a Framework-Free Approach

After years of working with various JavaScript frameworks, I decided to build my personal site without any of them. Here's why.

## The Framework Fatigue is Real

Don't get me wrong - I love React, Vue, and other frameworks. They're incredibly powerful tools for building complex applications. But for a personal blog and portfolio? It felt like overkill.

### The Problems I Wanted to Avoid

- **Build complexity** - webpack configs, transpilation, bundling
- **Dependencies** - npm install taking minutes, security alerts
- **Breaking changes** - updating major versions, migration guides
- **Over-engineering** - Do I really need a virtual DOM for blog posts?

## What I Gained

By going framework-free, I got:

### 1. Instant Loading

No JavaScript bundle to download and parse. The browser can render everything immediately. My entire site is under 50KB including CSS.

### 2. Zero Dependencies (Almost)

For local development, I only need:
- `marked` - to convert Markdown to HTML
- `gray-matter` - to parse frontmatter

That's it. No build tools, no transpilers, no bundlers.

### 3. Longevity

This site will work exactly the same in 10 years. No framework updates, no breaking changes, no deprecation warnings.

### 4. Learning Experience

Working directly with the web platform taught me:
- Modern CSS features I didn't know existed
- Native Web APIs that replaced libraries
- How much browsers can do out of the box

## Modern CSS is Incredibly Powerful

Here are features that replaced what I'd usually reach for JavaScript:

```css
/* Dark mode without JavaScript */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0f172a;
  }
}

/* Responsive without media queries */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

/* Fluid typography */
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
}
```

## When Frameworks Make Sense

I still use frameworks professionally! They're perfect for:

- Complex interactive applications
- Real-time collaboration tools
- Large teams with shared component libraries
- Projects requiring rich interactivity

But for content-focused sites like blogs and documentation, plain HTML/CSS often works better.

## The Middle Ground

You don't have to choose all-or-nothing. You can:

1. Start with static HTML/CSS
2. Add sprinkles of JavaScript where needed
3. Use Web Components for reusable elements
4. Progressively enhance as requirements grow

## Conclusion

Building without a framework forced me to really understand the web platform. It reminded me that **simple solutions are often the best solutions**.

The web is already pretty great on its own. Sometimes we just need to get out of its way.

---

*What's your take? Do you prefer frameworks or vanilla approaches? Let me know on [Twitter](https://twitter.com/yourusername)!*
