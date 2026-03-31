/**
 * Regression check for /api/profile/creators/public authentication behavior.
 *
 * Expected:
 *  - Unauthenticated: creators[] items contain only { id, profilePicture }
 *  - Authenticated (cookie token): creators[] items contain name + instagramHandle
 *
 * Usage:
 *  API_BASE_URL=http://localhost:5001 JWT_SECRET=... node --loader tsx scripts/check-public-creators.ts
 *  (or run via npm script: npm run check:public-creators)
 */

import jwt from 'jsonwebtoken';

type PublicCreatorsResponse = {
  success: boolean;
  creators: Array<Record<string, unknown>>;
  authenticated: boolean;
};

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5001';
const JWT_SECRET = process.env.JWT_SECRET;

function fail(message: string): never {
  // eslint-disable-next-line no-console
  console.error(`❌ ${message}`);
  process.exit(1);
}

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  return { res, json };
}

function assertUnauthedShape(body: PublicCreatorsResponse) {
  if (!body.success) fail('Unauthed response did not have success=true');
  if (body.authenticated !== false) fail('Unauthed response should have authenticated=false');

  const first = body.creators[0];
  if (!first) {
    // empty list is fine
    return;
  }

  const keys = Object.keys(first);
  if (!('id' in first) || !('profilePicture' in first)) {
    fail(`Unauthed creator item should contain id+profilePicture. Got keys: ${keys.join(', ')}`);
  }
  if ('name' in first || 'instagramHandle' in first) {
    fail('Unauthed creator item should not include name/instagramHandle');
  }
}

function assertAuthedShape(body: PublicCreatorsResponse) {
  if (!body.success) fail('Authed response did not have success=true');
  if (body.authenticated !== true) fail('Authed response should have authenticated=true');

  const first = body.creators[0];
  if (!first) {
    // empty list is fine
    return;
  }

  const keys = Object.keys(first);
  if (!('id' in first) || !('profilePicture' in first)) {
    fail(`Authed creator item should contain id+profilePicture. Got keys: ${keys.join(', ')}`);
  }
  if (!('name' in first)) {
    fail(`Authed creator item should contain name. Got keys: ${keys.join(', ')}`);
  }
  if (!('instagramHandle' in first)) {
    fail(`Authed creator item should contain instagramHandle. Got keys: ${keys.join(', ')}`);
  }
}

async function main() {
  const url = `${API_BASE_URL}/api/profile/creators/public`;

  // 1) Unauthenticated
  const unauth = await fetchJson(url);
  if (!unauth.res.ok) {
    fail(`Unauthed request failed: ${unauth.res.status} ${unauth.res.statusText}`);
  }
  assertUnauthedShape(unauth.json as PublicCreatorsResponse);

  // 2) Authenticated (cookie-based)
  if (!JWT_SECRET) {
    // eslint-disable-next-line no-console
    console.log('⚠️  Skipping authenticated check: JWT_SECRET not set.');
    // eslint-disable-next-line no-console
    console.log('✅ Unauthenticated shape looks correct.');
    return;
  }

  // Payload shape must match backend verifyToken payload (see auth middleware).
  const token = jwt.sign({ userId: '000000000000000000000000', email: 'check@example.com' }, JWT_SECRET, {
    expiresIn: '5m',
  });

  const authed = await fetchJson(url, {
    headers: {
      Cookie: `token=${token}`,
    },
  });

  if (!authed.res.ok) {
    fail(`Authed request failed: ${authed.res.status} ${authed.res.statusText}`);
  }
  assertAuthedShape(authed.json as PublicCreatorsResponse);

  // eslint-disable-next-line no-console
  console.log('✅ public creators endpoint auth behavior looks correct.');
}

main().catch((e) => {
  fail(e instanceof Error ? e.message : 'Unknown error');
});
