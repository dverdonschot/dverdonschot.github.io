# Nostr Integration Design Document

## Overview

This document outlines the design for integrating the blog with Nostr (Notes and Other Stuff Transmitted by Relays), a decentralized social protocol. The integration will automatically publish blog posts to Nostr as long-form content, expanding reach without relying on commercial social media platforms.

## What is Nostr?

Nostr is a simple, open protocol that enables truly censorship-resistant and global social media. Key characteristics:

- **Decentralized**: No central server, uses relays to distribute content
- **Cryptographic Identity**: Users are identified by public/private key pairs
- **Relay-based**: Multiple relays propagate messages
- **Open Protocol**: Anyone can build clients and relays

## Goals

1. **Controlled Publishing**: Publish blog posts to Nostr with global and per-post control
2. **Long-form Content**: Use NIP-23 (Nostr Implementation Possibility #23) for long-form articles
3. **Discoverability**: Make blog content available to Nostr users
4. **Seamless Integration**: Fit naturally into existing build process
5. **Flexible Configuration**:
   - Global enable/disable toggle (disabled by default)
   - Per-post opt-in/opt-out control via frontmatter
   - Easy setup with environment variables

## Nostr Protocol Basics

### Event Structure

Nostr uses "events" as the fundamental data structure. Each event contains:

```json
{
  "id": "<32-byte hex event id>",
  "pubkey": "<32-byte hex public key>",
  "created_at": "<unix timestamp>",
  "kind": <integer>,
  "tags": [["tag1", "value1"], ["tag2", "value2"]],
  "content": "<content>",
  "sig": "<signature>"
}
```

### Relevant NIPs (Nostr Implementation Possibilities)

- **NIP-01**: Basic protocol flow
- **NIP-23**: Long-form content (articles/blog posts)
  - Uses `kind: 30023` (parameterized replaceable event)
  - Supports markdown content
  - Includes metadata tags for title, summary, image, published date
  - Uses `d` tag for unique identifier (allows updates)

## Architecture Design

### Components

```
┌─────────────────────────────────────────────────────────┐
│                     Build Process                        │
│                      (build.js)                          │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ├─ Parse Markdown Posts
                  ├─ Generate HTML Pages
                  ├─ Generate RSS Feed
                  │
                  └─ NEW: Publish to Nostr
                         ↓
                    ┌─────────────────────┐
                    │ Nostr Publisher     │
                    │ (nostr-publisher.js)│
                    └──────────┬──────────┘
                               │
                               ├─ Create NIP-23 Events
                               ├─ Sign with Private Key
                               └─ Publish to Relays
                                  ↓
                    ┌──────────────────────────┐
                    │    Nostr Relays          │
                    │  (wss://relay1.com)      │
                    │  (wss://relay2.com)      │
                    └──────────────────────────┘
```

### File Structure

```
dverdonschot.github.io/
├── build.js                    # Main build script (modified)
├── nostr-publisher.js          # NEW: Nostr publishing logic
├── .env                        # NEW: Nostr configuration
├── .env.example                # NEW: Template for configuration
├── posts/                      # Blog posts (existing)
├── .nostr-published/           # NEW: Track published posts
│   └── published-events.json   # Event IDs and post mapping
└── package.json                # Updated with nostr dependencies
```

## Implementation Plan

### Phase 1: Core Infrastructure

#### 1.1 Dependencies

Add Nostr libraries to `package.json`:

```json
{
  "dependencies": {
    "nostr-tools": "^2.x.x",  // Official Nostr client library
    "dotenv": "^16.x.x"        // Environment variable management
  }
}
```

**nostr-tools** provides:
- Event signing and verification
- Relay connection handling
- NIP implementations
- Key management utilities

#### 1.2 Environment Configuration

Create `.env` file (gitignored):

```bash
# Nostr Configuration
NOSTR_PRIVATE_KEY=<hex-encoded-private-key>
NOSTR_RELAYS=wss://relay.damus.io,wss://nos.lol,wss://relay.nostr.band

# Publishing preferences (DISABLED BY DEFAULT for preparation phase)
NOSTR_PUBLISH_ENABLED=false
NOSTR_REPUBLISH_ON_UPDATE=true

# Default behavior for posts without explicit nostr frontmatter
# opt-in: only publish posts with nostr: true
# opt-out: publish all posts except those with nostr: false
NOSTR_DEFAULT_BEHAVIOR=opt-in
```

Create `.env.example` template:

```bash
# Nostr Configuration
# Generate a private key using: npx nostr-keygen
NOSTR_PRIVATE_KEY=your_private_key_here

# Comma-separated list of Nostr relay URLs
NOSTR_RELAYS=wss://relay.damus.io,wss://nos.lol,wss://relay.nostr.band

# Publishing preferences (DISABLED BY DEFAULT)
# Set to true when you're ready to start publishing
NOSTR_PUBLISH_ENABLED=false
NOSTR_REPUBLISH_ON_UPDATE=true

# Default behavior for posts without explicit nostr frontmatter
# opt-in: only publish posts with nostr: true (RECOMMENDED for starting out)
# opt-out: publish all posts except those with nostr: false
NOSTR_DEFAULT_BEHAVIOR=opt-in
```

Update `.gitignore`:

```
.env
.nostr-published/
```

### Phase 2: Nostr Publisher Module

Create `nostr-publisher.js`:

#### 2.1 Core Functions

```javascript
import { SimplePool, getPublicKey, finalizeEvent, generateSecretKey } from 'nostr-tools';
import 'dotenv/config';

/**
 * Initialize Nostr publisher
 */
class NostrPublisher {
  constructor() {
    this.privateKey = process.env.NOSTR_PRIVATE_KEY;
    this.publicKey = getPublicKey(this.privateKey);
    this.relays = process.env.NOSTR_RELAYS.split(',');
    this.pool = new SimplePool();
    this.enabled = process.env.NOSTR_PUBLISH_ENABLED === 'true';
  }

  /**
   * Create NIP-23 long-form content event from blog post
   */
  createLongFormEvent(post) {
    // Use nostrDate if specified, otherwise use post date
    const publishDate = post.nostrDate || post.date;
    const timestamp = Math.floor(new Date(publishDate).getTime() / 1000);

    // Event structure for NIP-23
    const event = {
      kind: 30023,
      created_at: timestamp,
      tags: [
        ['d', post.slug],                          // Unique identifier
        ['title', post.title],                     // Article title
        ['published_at', String(timestamp)],       // Use nostrDate or date
        ['summary', post.description],             // Description
        ['t', ...post.tags],                       // Topic tags
        ['client', 'dverdonschot-blog'],          // Client identifier
      ],
      content: post.markdown,                      // Full markdown content
      pubkey: this.publicKey,
    };

    // Add image tag if available
    if (post.image) {
      event.tags.push(['image', `https://dverdonschot.github.io${post.image}`]);
    }

    // Add canonical URL
    event.tags.push(['r', `https://dverdonschot.github.io/blog/${post.slug}.html`]);

    return finalizeEvent(event, this.privateKey);
  }

  /**
   * Publish event to all relays
   */
  async publishToRelays(event) {
    const results = await Promise.allSettled(
      this.pool.publish(this.relays, event)
    );

    return {
      success: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
      total: results.length
    };
  }

  /**
   * Check if post has been published
   */
  async hasBeenPublished(slug) {
    // Query relays for existing event with this slug
    // Implementation TBD
  }

  /**
   * Check if post should be published based on frontmatter and global settings
   */
  shouldPublishPost(post) {
    if (!this.enabled) {
      return { shouldPublish: false, reason: 'Global publishing disabled' };
    }

    // Check post frontmatter for explicit nostr setting
    if (post.nostr === true) {
      return { shouldPublish: true, reason: 'Explicitly enabled in frontmatter' };
    }

    if (post.nostr === false) {
      return { shouldPublish: false, reason: 'Explicitly disabled in frontmatter' };
    }

    // No explicit setting - use default behavior
    const defaultBehavior = process.env.NOSTR_DEFAULT_BEHAVIOR || 'opt-in';

    if (defaultBehavior === 'opt-in') {
      return { shouldPublish: false, reason: 'Opt-in mode: nostr not set in frontmatter' };
    } else {
      return { shouldPublish: true, reason: 'Opt-out mode: nostr not set in frontmatter' };
    }
  }

  /**
   * Publish blog post to Nostr
   */
  async publishPost(post) {
    const { shouldPublish, reason } = this.shouldPublishPost(post);

    if (!shouldPublish) {
      return { skipped: true, reason, post: post.slug };
    }

    try {
      const event = this.createLongFormEvent(post);
      const results = await this.publishToRelays(event);

      return {
        success: true,
        eventId: event.id,
        post: post.slug,
        relays: results
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        post: post.slug
      };
    }
  }

  /**
   * Publish multiple posts
   */
  async publishPosts(posts) {
    const results = [];

    for (const post of posts) {
      const result = await this.publishPost(post);
      results.push(result);

      // Rate limiting: wait 100ms between posts
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  }

  /**
   * Close connections
   */
  async close() {
    this.pool.close(this.relays);
  }
}

export default NostrPublisher;
```

### Phase 3: Integration with Build Process

#### 3.1 Modify build.js

Add Nostr publishing step:

```javascript
// Import at top
import NostrPublisher from './nostr-publisher.js';

// Add to parsePost() function to preserve markdown
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
    markdown,  // NEW: Preserve original markdown for Nostr
    readingTime,
    filename: relativePath,
    nostr: data.nostr,      // NEW: Per-post Nostr publishing control
    nostrDate: data.nostrDate  // NEW: Override Nostr publish date
  };
}

// Add new function after generateSitemap()
async function publishToNostr(posts) {
  console.log('📡 Publishing to Nostr...');

  try {
    const publisher = new NostrPublisher();

    if (!publisher.enabled) {
      console.log('   ⊘ Nostr publishing disabled');
      return;
    }

    const results = await publisher.publishPosts(posts);

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success && !r.skipped).length;
    const skipped = results.filter(r => r.skipped).length;

    console.log(`   ✓ Published: ${successful} posts`);
    if (failed > 0) console.log(`   ✗ Failed: ${failed} posts`);
    if (skipped > 0) console.log(`   ⊘ Skipped: ${skipped} posts`);

    await publisher.close();
  } catch (error) {
    console.error('   ✗ Nostr publishing error:', error.message);
  }
}

// Update main build() function
async function build() {
  console.log('🏗️  Building site...\n');

  // ... existing build steps ...

  // Generate sitemap
  console.log('🗺️  Generating sitemap...');
  await generateSitemap(posts);

  // NEW: Publish to Nostr
  await publishToNostr(posts);

  // Create .nojekyll file for GitHub Pages
  await fs.writeFile(path.join(DIST_DIR, '.nojekyll'), '');

  console.log('\n✨ Build complete! Output in ./dist/\n');
}
```

### Phase 4: Key Generation & Setup

#### 4.1 Key Generation Script

Create `scripts/generate-nostr-key.js`:

```javascript
import { generateSecretKey, getPublicKey } from 'nostr-tools/pure';
import { bytesToHex } from '@noble/hashes/utils';

console.log('Generating new Nostr key pair...\n');

const secretKey = generateSecretKey();
const publicKey = getPublicKey(secretKey);

console.log('Private Key (keep this SECRET!)');
console.log('================================');
console.log(bytesToHex(secretKey));
console.log('');

console.log('Public Key (your Nostr identity)');
console.log('=================================');
console.log(publicKey);
console.log('');

console.log('Add the private key to your .env file:');
console.log(`NOSTR_PRIVATE_KEY=${bytesToHex(secretKey)}`);
```

Add to package.json scripts:

```json
{
  "scripts": {
    "build": "node build.js",
    "serve": "npx http-server dist -p 8000 -o",
    "dev": "npm run build && npm run serve",
    "nostr:keygen": "node scripts/generate-nostr-key.js"
  }
}
```

### Phase 5: Publishing State Management

#### 5.1 Track Published Events

Create `.nostr-published/published-events.json`:

```json
{
  "posts": {
    "my-first-post": {
      "eventId": "abc123...",
      "publishedAt": "2025-11-16T10:00:00Z",
      "lastUpdated": "2025-11-16T10:00:00Z"
    }
  }
}
```

This allows:
- Avoiding duplicate publications
- Updating existing events (NIP-23 replaceable events)
- Tracking publishing history

## Configuration & Security

### Security Best Practices

1. **Private Key Protection**
   - Never commit `.env` file
   - Use environment variables in CI/CD
   - Consider using key management services in production

2. **GitHub Actions Secrets**
   - Store `NOSTR_PRIVATE_KEY` as repository secret
   - Access via `${{ secrets.NOSTR_PRIVATE_KEY }}`

3. **Backup Keys**
   - Store private key securely offline
   - Document recovery process

### Recommended Relay List

Start with popular, reliable relays:

- `wss://relay.damus.io` - Popular iOS client relay
- `wss://nos.lol` - Community relay
- `wss://relay.nostr.band` - Aggregator relay
- `wss://relay.snort.social` - Web client relay
- `wss://nostr.wine` - Paid relay (higher quality)

## Per-Post Frontmatter Control

Add these optional fields to your blog post frontmatter:

```yaml
---
title: My Blog Post
date: 2025-11-16
description: A great post
tags: [web, dev]

# Nostr-specific settings
nostr: true                    # Enable/disable Nostr publishing for this post
nostrDate: 2025-12-24          # Override publish date on Nostr (optional)
---
```

### Frontmatter Options

- **`nostr: true/false`** - Explicitly enable or disable Nostr publishing
  - If omitted, uses `NOSTR_DEFAULT_BEHAVIOR` from environment
  - `true` = always publish (even in opt-in mode)
  - `false` = never publish (even in opt-out mode)

- **`nostrDate: YYYY-MM-DD`** - Override the Nostr publish date
  - Useful for republishing old content on a schedule
  - Allows preparing Nostr presence with staged releases
  - If omitted, uses the post's `date` field
  - Format: ISO date string (YYYY-MM-DD)

### Example Use Cases

**Staggered release of existing content:**
```yaml
# Old blog post from November, publish to Nostr in December
title: My First Blog Post
date: 2025-11-16
nostr: true
nostrDate: 2025-12-24
```

**Private post (blog only, not on Nostr):**
```yaml
title: Personal Notes
date: 2025-12-20
nostr: false
```

**Default behavior (no explicit setting):**
```yaml
title: New Post
date: 2025-12-24
# Will use NOSTR_DEFAULT_BEHAVIOR (opt-in or opt-out)
```

## User Experience

### For Blog Readers on Nostr

When viewing posts via Nostr clients:

1. Full markdown content preserved
2. Images embedded (via URL)
3. Tags enable topic discovery
4. Canonical URL links back to website
5. Comments/reactions via Nostr protocol
6. Published date reflects `nostrDate` (or `date` if not specified)

### For Blog Author

1. Write posts as normal in `posts/` directory
2. Add `nostr: true` to posts you want on Nostr
3. Optionally set `nostrDate` to schedule/stage releases
4. Run `npm run build`
5. Posts with `nostr: true` published to Nostr
6. Updates republished automatically (replaceable events)

## Testing Strategy

### Phase 1: Local Testing

1. Generate test keys
2. Use test relays
3. Verify event structure
4. Check relay propagation

### Phase 2: Staging

1. Create staging environment
2. Test with real relays
3. Verify discoverability via Nostr clients

### Phase 3: Production

1. Monitor publishing success rates
2. Track relay response times
3. Validate content rendering in clients

## Future Enhancements

### Short-term

1. **Draft Support**
   - Don't publish posts marked as drafts
   - Unpublish deleted posts

2. **Content Warnings**
   - Support NIP-36 content warnings
   - Add via frontmatter: `contentWarning: "technical"`

3. **Scheduled Publishing**
   - Automatically publish posts when `nostrDate` is reached
   - Useful for CI/CD scheduled runs

### Medium-term

1. **Rich Embeds**
   - Embed code blocks with syntax highlighting references
   - Link previews for external URLs

2. **Cross-posting**
   - Short summary as kind-1 note
   - Link to full NIP-23 article

3. **Analytics**
   - Track event propagation
   - Monitor engagement via reactions/comments

### Long-term

1. **Two-way Integration**
   - Fetch Nostr comments for posts
   - Display on website

2. **Web Monetization**
   - Lightning Network integration (NIP-57 zaps)
   - Accept tips via Lightning

3. **Decentralized Hosting**
   - Use Nostr for content distribution
   - Blossom/NIP-95 for media hosting

## Migration & Rollout

### Phase 1: Setup (Week 1)

- [ ] Install dependencies
- [ ] Generate Nostr keys
- [ ] Configure environment
- [ ] Implement nostr-publisher.js

### Phase 2: Integration (Week 1-2)

- [ ] Modify build.js
- [ ] Add state tracking
- [ ] Test with dummy posts

### Phase 3: Testing (Week 2)

- [ ] Publish test posts to testnet relays
- [ ] Verify in Nostr clients (Damus, Snort, Amethyst)
- [ ] Fix any formatting issues

### Phase 4: Production (Week 3)

- [ ] Publish existing posts to mainnet relays
- [ ] Monitor for 48 hours
- [ ] Document process

### Phase 5: Automation (Week 3)

- [ ] Add to CI/CD pipeline
- [ ] Configure GitHub Actions
- [ ] Enable automatic publishing

## Monitoring & Maintenance

### Success Metrics

1. **Publishing Success Rate**: >95% events published successfully
2. **Relay Availability**: >80% relays responding
3. **Content Integrity**: 100% posts readable in major clients

### Maintenance Tasks

1. **Weekly**: Check relay health
2. **Monthly**: Review unpublished posts
3. **Quarterly**: Update relay list
4. **Yearly**: Review and update dependencies

## References

### Documentation

- [NIP-01: Basic Protocol](https://github.com/nostr-protocol/nips/blob/master/01.md)
- [NIP-23: Long-form Content](https://github.com/nostr-protocol/nips/blob/master/23.md)
- [nostr-tools Documentation](https://github.com/nbd-wtf/nostr-tools)

### Tools

- [nostr.band](https://nostr.band) - Event explorer
- [Nostr Clients List](https://github.com/aljazceru/awesome-nostr#clients)
- [Relay List](https://nostr.watch)

### Community

- [Nostr GitHub](https://github.com/nostr-protocol/nostr)
- [NIPs Repository](https://github.com/nostr-protocol/nips)

## Cost Analysis

### Infrastructure Costs

- **Relay Hosting**: $0 (using public relays)
- **Key Management**: $0 (self-hosted)
- **Dependencies**: $0 (open source)

### Time Investment

- **Initial Setup**: 4-8 hours
- **Testing**: 2-4 hours
- **Maintenance**: 1-2 hours/month

### Benefits

- **Reach**: Access to growing Nostr user base
- **Ownership**: Full control over content and identity
- **Resilience**: Decentralized distribution
- **Future-proof**: Protocol-based, not platform-dependent

## Conclusion

This design provides a comprehensive plan for integrating Nostr publishing into the existing blog infrastructure. The implementation is:

- **Non-invasive**: Minimal changes to existing build process
- **Optional**: Can be disabled via environment variable
- **Standard-compliant**: Follows Nostr NIPs
- **Maintainable**: Clear separation of concerns
- **Extensible**: Foundation for future enhancements

The integration will enable blog content to reach the decentralized Nostr network while maintaining full ownership and control of the content and identity.
