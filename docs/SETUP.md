# Setup Guide

Follow these steps to get your personal site up and running on GitHub Pages.

## Prerequisites

- Node.js 18+ installed
- A GitHub account
- Git installed

## Local Setup

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/yourusername/your-site.git
   cd your-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Customize your site**
   - Edit `src/index.html` - Replace "Your Name" and personal info
   - Edit `src/about.html` - Add your actual bio
   - Update all instances of "yourusername" with your GitHub username
   - Update email and social links

4. **Write your first post**
   - Create a new `.md` file in `posts/` directory
   - Use the frontmatter format (see existing examples)
   - Write your content in Markdown

5. **Build the site**
   ```bash
   npm run build
   ```
   This creates the `dist/` folder with your static site.

6. **Preview locally**
   ```bash
   npm run serve
   ```
   Open http://localhost:8000 in your browser

## GitHub Pages Setup

1. **Create a new GitHub repository**
   - Go to https://github.com/new
   - Name it: `yourusername.github.io` (replace with your username)
   - Make it public
   - Don't initialize with README (you already have one)

2. **Push your code**
   ```bash
   git remote add origin https://github.com/yourusername/yourusername.github.io.git
   git add .
   git commit -m "Initial commit"
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository settings
   - Click "Pages" in the sidebar
   - Under "Build and deployment":
     - Source: "GitHub Actions"
   - Save

4. **Wait for deployment**
   - Go to the "Actions" tab
   - Watch the workflow run (takes ~1-2 minutes)
   - Once complete, your site will be live at `https://yourusername.github.io`

## Writing Posts

### Create a new post

1. Create a file in `posts/` with format: `YYYY-MM-DD-post-slug.md`
   ```
   posts/2025-11-17-my-new-post.md
   ```

2. Add frontmatter at the top:
   ```markdown
   ---
   title: My Awesome Post
   date: 2025-11-17
   description: A brief description for SEO and previews
   tags: [web, tutorial, javascript]
   ---
   ```

3. Write your content in Markdown below the frontmatter

4. Commit and push:
   ```bash
   git add posts/2025-11-17-my-new-post.md
   git commit -m "Add new post: My Awesome Post"
   git push
   ```

5. GitHub Actions automatically rebuilds and deploys your site!

## Customization Tips

### Change colors/theme
Edit `src/css/variables.css` - change the CSS custom properties

### Add new pages
1. Create a new HTML file in `src/` (e.g., `src/projects.html`)
2. Copy the header/footer from existing pages
3. Add link to navigation in all pages
4. Rebuild

### Add analytics
Add Google Analytics or similar to the `<head>` of your templates

### Add comments
Consider adding:
- GitHub Discussions
- Utterances (GitHub issues as comments)
- Giscus (GitHub Discussions as comments)

### Custom domain
1. Buy a domain
2. Add a `CNAME` file to `public/` directory with your domain
3. Configure DNS with your domain provider
4. Enable HTTPS in GitHub Pages settings

## Troubleshooting

### Site not deploying
- Check the Actions tab for error messages
- Ensure you've enabled GitHub Pages with "GitHub Actions" as source
- Verify `package.json` and `build.js` are committed

### Styles not loading
- Check that CSS paths start with `/` (e.g., `/css/main.css`)
- Clear browser cache
- Check browser console for 404 errors

### Posts not showing up
- Ensure frontmatter is formatted correctly
- Check that the date format is valid (YYYY-MM-DD)
- Run `npm run build` locally to check for errors

## Updating Your Site

Every time you push to `main`, GitHub Actions automatically:
1. Installs dependencies
2. Runs the build script
3. Deploys the `dist/` folder to GitHub Pages

So your workflow is simply:
```bash
# Make changes
git add .
git commit -m "Update about page"
git push

# Wait ~1-2 minutes and your changes are live!
```

## Need Help?

- Check existing posts for Markdown examples
- Read the [Marked.js documentation](https://marked.js.org/)
- Browse [GitHub Pages docs](https://docs.github.com/pages)
- Open an issue on GitHub if you're stuck

## Next Steps

- Delete the sample posts or edit them
- Write your real "About" page
- Customize the design to match your style
- Add your first real blog post
- Share your site!

Happy blogging! 🚀
