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
console.log('');

console.log('⚠️  IMPORTANT: Keep your private key secure!');
console.log('   - Never commit it to git');
console.log('   - Store it safely offline as a backup');
console.log('   - Anyone with this key can publish as you');
