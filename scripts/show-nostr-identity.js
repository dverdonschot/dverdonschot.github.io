import { getPublicKey } from 'nostr-tools/pure';
import { npubEncode } from 'nostr-tools/nip19';
import 'dotenv/config';

const privateKey = process.env.NOSTR_PRIVATE_KEY;

if (!privateKey) {
  console.error('❌ NOSTR_PRIVATE_KEY not found in .env file');
  console.log('\nRun: npm run nostr:keygen');
  process.exit(1);
}

try {
  const publicKey = getPublicKey(privateKey);
  const npub = npubEncode(publicKey);

  console.log('Your Nostr Identity');
  console.log('==================\n');

  console.log('Public Key (hex):');
  console.log(publicKey);
  console.log('');

  console.log('Public Key (npub - share this!):');
  console.log(npub);
  console.log('');

  console.log('📍 Share your npub on:');
  console.log('   - Your website/blog');
  console.log('   - Twitter/X bio');
  console.log('   - GitHub profile');
  console.log('   - Other social media');
  console.log('');

  console.log('🔍 People can follow you by searching for your npub in:');
  console.log('   - Damus (iOS)');
  console.log('   - Amethyst (Android)');
  console.log('   - Snort.social (Web)');
  console.log('   - Primal.net (Web)');
  console.log('   - Iris.to (Web)');
  console.log('');

  console.log('📰 Your long-form posts will appear on:');
  console.log('   - https://habla.news');
  console.log('   - https://highlighter.com');
  console.log('   - https://yakihonne.com');
  console.log('');

  console.log(`🔗 Direct links to your profile:`);
  console.log(`   https://primal.net/p/${npub}`);
  console.log(`   https://snort.social/p/${npub}`);
  console.log(`   https://iris.to/${npub}`);

} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
