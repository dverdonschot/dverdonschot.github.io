import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';
import matter from 'gray-matter';

const POSTS_DIR = './posts';
const SRC_DIR = './src';
const TEMPLATES_DIR = './src/templates';
const DIST_DIR = './dist';
const PUBLIC_DIR = './public';
const IMAGES_DIR = './images';
const SITE_URL = 'https://dverdonschot.github.io';
const SITE_TITLE = 'Dennis Verdonschot';
const SITE_DESCRIPTION = 'Developer who loves building things for the web';

// Configure marked for better output
marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: true,
  mangle: false
});

// Load and cache templates
let templatesCache = {};

async function loadTemplate(name) {
  if (!templatesCache[name]) {
    templatesCache[name] = await fs.readFile(
      path.join(TEMPLATES_DIR, `${name}.html`),
      'utf-8'
    );
  }
  return templatesCache[name];
}

// Build complete page with header and footer
async function buildPage(contentTemplate, replacements) {
  const header = await loadTemplate('header');
  const footer = await loadTemplate('footer');

  // Apply replacements to content template first
  let content = contentTemplate;
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || '');
  }

  // Then insert header and footer
  content = content
    .replace(/\{\{HEADER\}\}/g, header)
    .replace(/\{\{FOOTER\}\}/g, footer);

  // Finally apply replacements to the complete page (for header/footer placeholders)
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || '');
  }

  return content;
}

// Calculate reading time (average 200 words per minute)
function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

// Ensure dist directory exists
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

// Copy directory recursively
async function copyDir(src, dest) {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

// Recursively find all markdown files
async function findMarkdownFiles(dir, fileList = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await findMarkdownFiles(fullPath, fileList);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      const relativePath = path.relative(POSTS_DIR, fullPath);
      fileList.push(relativePath);
    }
  }

  return fileList;
}

// Read and parse a markdown post
async function parsePost(relativePath) {
  const filepath = path.join(POSTS_DIR, relativePath);
  const content = await fs.readFile(filepath, 'utf-8');
  const { data, content: markdown } = matter(content);

  const html = marked.parse(markdown);
  const slug = path.basename(relativePath, '.md');
  const readingTime = calculateReadingTime(markdown);

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || new Date(),
    description: data.description || '',
    tags: data.tags || [],
    image: data.image || '',
    imageAlt: data.imageAlt || '',
    html,
    readingTime,
    filename: relativePath
  };
}

// Get all posts sorted by date
async function getAllPosts() {
  const mdFiles = await findMarkdownFiles(POSTS_DIR);
  const posts = await Promise.all(mdFiles.map(parsePost));
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Escape XML special characters
function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Generate RSS feed
async function generateRSS(posts) {
  const items = posts.map(post => {
    const pubDate = new Date(post.date).toUTCString();
    const link = `${SITE_URL}/blog/${post.slug}.html`;
    
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
  }).join('\n');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

  await fs.writeFile(path.join(DIST_DIR, 'rss.xml'), rss);
}

// Generate sitemap
async function generateSitemap(posts) {
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'weekly' },
    { url: '/about.html', priority: '0.8', changefreq: 'monthly' },
    { url: '/blog.html', priority: '0.9', changefreq: 'weekly' }
  ];

  const postPages = posts.map(post => ({
    url: `/blog/${post.slug}.html`,
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: new Date(post.date).toISOString().split('T')[0]
  }));

  const allPages = [...staticPages, ...postPages];

  const urls = allPages.map(page => `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ''}
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  await fs.writeFile(path.join(DIST_DIR, 'sitemap.xml'), sitemap);
}

// Generate a blog post page
async function generatePostPage(post) {
  const template = await loadTemplate('post');

  const dateFormatted = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const tagsHtml = post.tags.map(tag =>
    `<span class="tag">${tag}</span>`
  ).join('');

  const readingTimeHtml = post.readingTime > 0
    ? ` <span class="text-secondary">· ${post.readingTime} min read</span>`
    : '';

  const heroImageHtml = post.image
    ? `
        <div class="post-hero-image">
          <img src="${post.image}" alt="${post.imageAlt}" loading="lazy">
        </div>
      `
    : '';

  const html = await buildPage(template, {
    TITLE: post.title,
    DATE: dateFormatted,
    TAGS: tagsHtml,
    CONTENT: post.html,
    DESCRIPTION: post.description,
    SLUG: post.slug,
    READING_TIME: readingTimeHtml,
    HERO_IMAGE: heroImageHtml,
    META_DESCRIPTION: post.description,
    META_TITLE: post.title,
    PAGE_TITLE: `${post.title} - Dennis Verdonschot`,
    PAGE_URL: `blog/${post.slug}.html`,
    OG_TYPE: 'article',
    EXTRA_CSS: '\n  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css" media="(prefers-color-scheme: dark)">\n  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css" media="(prefers-color-scheme: light)">',
    EXTRA_SCRIPTS: '\n  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>\n  <script>hljs.highlightAll();</script>'
  });

  const postDir = path.join(DIST_DIR, 'blog');
  await ensureDir(postDir);
  await fs.writeFile(path.join(postDir, `${post.slug}.html`), html);
}

// Generate blog index page
async function generateBlogIndex(posts) {
  const template = await fs.readFile(path.join(SRC_DIR, 'blog.html'), 'utf-8');
  
  const postsHtml = posts.length > 0 ? posts.map(post => {
    const dateFormatted = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const tagsHtml = post.tags.map(tag => 
      `<span class="tag">${tag}</span>`
    ).join('');
    
    const imageHtml = post.image
      ? `
        <div class="post-card-image">
          <img src="${post.image}" alt="${post.imageAlt}" loading="lazy">
        </div>
      `
      : '';
    
    return `
      <article class="post-card">
        ${imageHtml}
        <div class="post-card-content">
          <h2><a href="/blog/${post.slug}.html">${post.title}</a></h2>
          <time datetime="${post.date}">${dateFormatted}</time> · ${post.readingTime} min read
          ${post.description ? `<p class="description">${post.description}</p>` : ''}
          <div class="tags">${tagsHtml}</div>
        </div>
      </article>
    `;
  }).join('\n') : '<p>No posts yet. Write your first post in the <code>posts/</code> directory!</p>';
  
  const html = template.replace('{{POSTS}}', postsHtml);
  await fs.writeFile(path.join(DIST_DIR, 'blog.html'), html);
  
  // Also create /blog/index.html for GitHub Pages routing
  const blogDir = path.join(DIST_DIR, 'blog');
  await ensureDir(blogDir);
  await fs.writeFile(path.join(blogDir, 'index.html'), html);
}

// Generate home page with recent posts
async function generateHomePage(posts) {
  const template = await fs.readFile(path.join(SRC_DIR, 'index.html'), 'utf-8');
  
  const recentPosts = posts.slice(0, 3);
  const recentPostsHtml = recentPosts.length > 0 ? recentPosts.map(post => {
    const dateFormatted = new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const tagsHtml = post.tags.map(tag => 
      `<span class="tag">${tag}</span>`
    ).join('');
    
    const imageHtml = post.image
      ? `
        <div class="post-card-image">
          <img src="${post.image}" alt="${post.imageAlt}" loading="lazy">
        </div>
      `
      : '';
    
    return `
      <article class="post-card">
        ${imageHtml}
        <div class="post-card-content">
          <h2><a href="/blog/${post.slug}.html">${post.title}</a></h2>
          <time datetime="${post.date}">${dateFormatted}</time> · ${post.readingTime} min read
          ${post.description ? `<p class="description">${post.description}</p>` : ''}
          <div class="tags">${tagsHtml}</div>
        </div>
      </article>
    `;
  }).join('\n') : '<p>No posts yet. Write your first post in the <code>posts/</code> directory!</p>';
  
  const html = template.replace('{{RECENT_POSTS}}', recentPostsHtml);
  await fs.writeFile(path.join(DIST_DIR, 'index.html'), html);
}

// Copy static files
async function copyStatic() {
  const srcFiles = await fs.readdir(SRC_DIR, { withFileTypes: true });
  
  for (const file of srcFiles) {
    if (file.isFile() && !['post-template.html', 'index.html', 'blog.html'].includes(file.name)) {
      await fs.copyFile(
        path.join(SRC_DIR, file.name),
        path.join(DIST_DIR, file.name)
      );
    } else if (file.isDirectory()) {
      await copyDir(
        path.join(SRC_DIR, file.name),
        path.join(DIST_DIR, file.name)
      );
    }
  }
  
  // Copy about.html to /aboutme/index.html for GitHub Pages routing
  const aboutmeDir = path.join(DIST_DIR, 'aboutme');
  await ensureDir(aboutmeDir);
  const aboutHtml = await fs.readFile(path.join(SRC_DIR, 'about.html'), 'utf-8');
  await fs.writeFile(path.join(aboutmeDir, 'index.html'), aboutHtml);
  
  // Copy public assets if they exist
  try {
    await copyDir(PUBLIC_DIR, path.join(DIST_DIR, 'assets'));
  } catch (err) {
    console.log('No public directory found, skipping assets copy');
  }
  
  // Copy images directory to dist/images
  try {
    await copyDir(IMAGES_DIR, path.join(DIST_DIR, 'images'));
    console.log('   ✓ Copied images directory');
  } catch (err) {
    console.log('No images directory found, skipping images copy');
  }
}

// Main build function
async function build() {
  console.log('🏗️  Building site...\n');
  
  // Clean dist directory
  await fs.rm(DIST_DIR, { recursive: true, force: true });
  await ensureDir(DIST_DIR);
  
  // Copy static files
  console.log('📁 Copying static files...');
  await copyStatic();
  
  // Get all posts
  console.log('📝 Processing blog posts...');
  const posts = await getAllPosts();
  console.log(`   Found ${posts.length} posts`);
  
  // Generate post pages
  for (const post of posts) {
    await generatePostPage(post);
    console.log(`   ✓ ${post.slug}`);
  }
  
  // Generate blog index
  console.log('📋 Generating blog index...');
  await generateBlogIndex(posts);
  
  // Generate home page
  console.log('🏠 Generating home page...');
  await generateHomePage(posts);
  
  // Generate RSS feed
  console.log('📡 Generating RSS feed...');
  await generateRSS(posts);
  
  // Generate sitemap
  console.log('🗺️  Generating sitemap...');
  await generateSitemap(posts);
  
  // Create .nojekyll file for GitHub Pages
  await fs.writeFile(path.join(DIST_DIR, '.nojekyll'), '');
  
  console.log('\n✨ Build complete! Output in ./dist/\n');
}

// Run build
build().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
