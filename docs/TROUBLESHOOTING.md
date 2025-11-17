# Troubleshooting Guide

Common issues and how to fix them.

## Build Issues

### `npm install` fails

**Problem:** Dependencies won't install

**Solutions:**
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Try with legacy peer deps
npm install --legacy-peer-deps

# Update Node.js (requires 18+)
node --version  # Check version
# If < 18, update Node.js
```

### `npm run build` fails

**Problem:** Build script errors

**Check:**
1. Are you in the right directory?
   ```bash
   ls  # Should see package.json, build.js
   ```

2. Are dependencies installed?
   ```bash
   npm install
   ```

3. Check for syntax errors in Markdown files
   ```bash
   # Malformed frontmatter will break the build
   ```

**Common frontmatter issues:**
```markdown
# ❌ Wrong - Missing closing ---
---
title: My Post
date: 2025-01-15

# Content here

# ✅ Correct
---
title: My Post
date: 2025-01-15
---

# Content here
```

### Posts not appearing

**Problem:** New posts don't show up after building

**Checklist:**
- [ ] File is in `posts/` directory
- [ ] File ends with `.md`
- [ ] Frontmatter is properly formatted
- [ ] Date is valid (YYYY-MM-DD format)
- [ ] Ran `npm run build` after creating post

**Test:**
```bash
# List posts directory
ls posts/

# Check build output
npm run build
# Should see: "Found X posts"
```

## Deployment Issues

### GitHub Actions workflow fails

**Problem:** Deployment fails in GitHub

**Check Actions tab:**
1. Go to repository → Actions tab
2. Click failed workflow
3. Read error message

**Common causes:**

1. **Missing dependencies**
   ```yaml
   # Make sure .github/workflows/deploy.yml has:
   - name: Install dependencies
     run: npm ci
   ```

2. **GitHub Pages not enabled**
   - Settings → Pages
   - Source should be "GitHub Actions"

3. **Permissions issue**
   ```yaml
   # Workflow needs these permissions:
   permissions:
     contents: read
     pages: write
     id-token: write
   ```

### Site shows 404

**Problem:** GitHub Pages shows 404 error

**Solutions:**

1. **Wrong repository name**
   - For user site: Must be `username.github.io`
   - For project site: Can be any name

2. **GitHub Pages not enabled**
   - Settings → Pages
   - Enable GitHub Pages
   - Wait 1-2 minutes

3. **Branch issue**
   - Make sure you pushed to `main` branch
   - Check workflow is set to trigger on `main`

4. **Wait longer**
   - First deployment can take 5-10 minutes
   - Subsequent ones are faster (1-2 minutes)

### Changes not appearing

**Problem:** Pushed changes but site hasn't updated

**Steps:**
1. Check Actions tab - is workflow running?
2. Wait for green checkmark ✓
3. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Clear browser cache
5. Try incognito/private window

## Display Issues

### Styles not loading

**Problem:** Site looks unstyled

**Causes:**

1. **Wrong CSS path**
   ```html
   <!-- ❌ Wrong - relative path -->
   <link rel="stylesheet" href="css/main.css">
   
   <!-- ✅ Correct - absolute path -->
   <link rel="stylesheet" href="/css/main.css">
   ```

2. **Using project site path**
   For `username.github.io/project-name`:
   ```html
   <!-- Need to include repo name -->
   <link rel="stylesheet" href="/project-name/css/main.css">
   ```

3. **Browser cache**
   ```
   Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
   ```

### Dark mode not working

**Problem:** Theme toggle doesn't work

**Check:**
1. Browser console for JavaScript errors (F12)
2. localStorage permissions
3. Script is included in HTML

**Test:**
```javascript
// Open browser console (F12) and run:
localStorage.setItem('theme', 'dark')
location.reload()
```

### Images not showing

**Problem:** Images return 404

**Solutions:**

1. **Check image path**
   ```html
   <!-- ❌ Wrong -->
   <img src="images/photo.jpg">
   
   <!-- ✅ Correct -->
   <img src="/assets/images/photo.jpg">
   ```

2. **Verify image exists**
   ```bash
   ls public/images/
   ```

3. **Check build copied files**
   ```bash
   ls dist/assets/images/
   ```

4. **Case sensitivity matters**
   - `photo.jpg` ≠ `Photo.jpg`
   - Use lowercase filenames

## Local Preview Issues

### Port already in use

**Problem:** `npm run serve` fails - port 8000 in use

**Solutions:**
```bash
# Kill process on port 8000
# Mac/Linux:
lsof -ti:8000 | xargs kill -9

# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Or use different port:
npx http-server dist -p 8001
```

### Changes not appearing locally

**Problem:** Made changes but preview doesn't update

**Steps:**
1. Stop server (Ctrl+C)
2. Rebuild: `npm run build`
3. Restart server: `npm run serve`
4. Hard refresh browser

**Or use watch mode** (create script):
```json
// package.json
"scripts": {
  "watch": "nodemon --watch posts --watch src --exec 'npm run build'"
}
```

Then:
```bash
npm install -D nodemon
npm run watch  # Auto-rebuilds on changes
```

## Markdown Issues

### Code blocks not rendering

**Problem:** Code appears as plain text

**Solution:** Use proper fencing:
````markdown
```javascript
function hello() {
  console.log("Hello");
}
```
````

### Links broken

**Problem:** Internal links return 404

**Check:**
```markdown
# ❌ Wrong - missing .html
[About](/about)

# ✅ Correct
[About](/about.html)

# ❌ Wrong - relative
[Post](blog/my-post.html)

# ✅ Correct - absolute
[Post](/blog/my-post.html)
```

### Images in posts not showing

**Problem:** Markdown images return 404

**Solution:**
```markdown
# ❌ Wrong - relative path
![Alt](../images/photo.jpg)

# ✅ Correct - absolute path
![Alt](/assets/images/photo.jpg)
```

## Performance Issues

### Site loads slowly

**Checklist:**
- [ ] Compress images (<200KB each)
- [ ] Use modern image formats (WebP)
- [ ] Minimize CSS (already small)
- [ ] Enable GitHub Pages HTTPS

**Optimize images:**
```bash
# Use online tools:
# - TinyPNG.com
# - Squoosh.app
# - ImageOptim (Mac)
```

## Git Issues

### Can't push to GitHub

**Problem:** Push fails

**Common causes:**

1. **No remote set**
   ```bash
   git remote add origin https://github.com/username/repo.git
   ```

2. **Authentication issue**
   ```bash
   # Use personal access token, not password
   # Settings → Developer settings → Personal access tokens
   ```

3. **Branch doesn't exist**
   ```bash
   git push -u origin main
   ```

## Getting More Help

### Check browser console
```
F12 → Console tab
Look for red error messages
```

### Check GitHub Actions logs
```
Repository → Actions → Click workflow → Click job → Read logs
```

### Validate your setup
```bash
# Run these checks:
node --version    # Should be 18+
npm --version     # Should work
ls package.json   # Should exist
ls posts/         # Should have .md files
npm run build     # Should succeed
ls dist/          # Should have built files
```

### Common commands to reset

```bash
# Nuclear option - start fresh:
rm -rf node_modules package-lock.json dist
npm install
npm run build

# Clear git cache:
git rm -r --cached .
git add .
git commit -m "Reset"
```

## Still Stuck?

1. **Read the error message carefully** - it usually tells you what's wrong
2. **Check file paths** - 90% of issues are path-related
3. **Rebuild** - `npm run build` fixes most issues
4. **Clear cache** - browser cache causes confusion
5. **Compare with working example** - check the sample posts
6. **Start simple** - comment out code to isolate the problem

## Success Checklist

When everything works, you should see:

✅ `npm run build` completes without errors
✅ `dist/` folder contains HTML files
✅ `npm run serve` opens working site at localhost:8000
✅ GitHub Actions workflow shows green checkmark
✅ Site accessible at `username.github.io`
✅ Posts appear on blog page
✅ Styles load correctly
✅ Images display properly
✅ Theme toggle works

If you see all these ✅, you're good to go!
