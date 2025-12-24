import { SimplePool, getPublicKey, finalizeEvent } from 'nostr-tools';
import 'dotenv/config';

/**
 * Nostr Publisher - Publishes blog posts to Nostr as NIP-23 long-form content
 */
class NostrPublisher {
  constructor() {
    this.privateKey = process.env.NOSTR_PRIVATE_KEY;
    this.relays = (process.env.NOSTR_RELAYS || '').split(',').filter(r => r.trim());
    this.pool = new SimplePool();
    this.enabled = process.env.NOSTR_PUBLISH_ENABLED === 'true';
    this.defaultBehavior = process.env.NOSTR_DEFAULT_BEHAVIOR || 'opt-in';

    // Validate configuration
    if (this.enabled && !this.privateKey) {
      console.warn('⚠️  NOSTR_PUBLISH_ENABLED is true but NOSTR_PRIVATE_KEY is not set');
      this.enabled = false;
    }

    if (this.enabled && this.privateKey) {
      try {
        this.publicKey = getPublicKey(this.privateKey);
      } catch (error) {
        console.warn('⚠️  Invalid NOSTR_PRIVATE_KEY format');
        this.enabled = false;
      }
    }

    if (this.enabled && this.relays.length === 0) {
      console.warn('⚠️  NOSTR_PUBLISH_ENABLED is true but no relays configured');
      this.enabled = false;
    }
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
    if (this.defaultBehavior === 'opt-in') {
      return { shouldPublish: false, reason: 'Opt-in mode: nostr not set in frontmatter' };
    } else {
      return { shouldPublish: true, reason: 'Opt-out mode: nostr not set in frontmatter' };
    }
  }

  /**
   * Create NIP-23 long-form content event from blog post
   */
  createLongFormEvent(post) {
    // Use nostrDate if specified, otherwise use post date
    const publishDate = post.nostrDate || post.date;
    const timestamp = Math.floor(new Date(publishDate).getTime() / 1000);

    // Add footer to markdown content with link back to website
    const canonicalUrl = `https://dverdonschot.github.io/blog/${post.slug}.html`;
    const contentWithFooter = `${post.markdown}

---

*Originally published at [dverdonschot.github.io](${canonicalUrl})*`;

    // Event structure for NIP-23
    const event = {
      kind: 30023,
      created_at: timestamp,
      tags: [
        ['d', post.slug],                          // Unique identifier
        ['title', post.title],                     // Article title
        ['published_at', String(timestamp)],       // Use nostrDate or date
        ['summary', post.description],             // Description
        ['client', 'dverdonschot-blog'],          // Client identifier
      ],
      content: contentWithFooter,                  // Full markdown content with footer
      pubkey: this.publicKey,
    };

    // Add topic tags
    if (post.tags && post.tags.length > 0) {
      post.tags.forEach(tag => {
        event.tags.push(['t', tag]);
      });
    }

    // Add image tag if available
    if (post.image) {
      const imageUrl = post.image.startsWith('http')
        ? post.image
        : `https://dverdonschot.github.io${post.image}`;
      event.tags.push(['image', imageUrl]);
    }

    // Add canonical URL
    event.tags.push(['r', `https://dverdonschot.github.io/blog/${post.slug}.html`]);

    return finalizeEvent(event, this.privateKey);
  }

  /**
   * Publish event to all relays
   */
  async publishToRelays(event) {
    const publishPromises = this.pool.publish(this.relays, event);
    const results = await Promise.allSettled(publishPromises);

    return {
      success: results.filter(r => r.status === 'fulfilled').length,
      failed: results.filter(r => r.status === 'rejected').length,
      total: results.length,
      relays: this.relays
    };
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

      // Rate limiting: wait 100ms between posts to be respectful to relays
      if (result.success || result.skipped) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  /**
   * Close relay connections
   */
  async close() {
    this.pool.close(this.relays);
  }
}

export default NostrPublisher;
