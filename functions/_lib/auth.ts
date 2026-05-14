// Cookie-based per-Werk auth for Wedding Story Atelier.
// Cookie value: "<slug1>,<slug2>.<hmac-sha256-hex>"
// Signed with COOKIE_SECRET (Cloudflare Pages env var).

export const COOKIE_NAME = 'wsa_unlocked';
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 60; // 60 days

export function readCookie(header: string | null, name: string): string {
  if (!header) return '';
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return decodeURIComponent(rest.join('='));
  }
  return '';
}

async function sign(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const buf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyCookie(value: string, secret: string): Promise<string[]> {
  if (!value || !secret) return [];
  const idx = value.lastIndexOf('.');
  if (idx === -1) return [];
  const payload = value.slice(0, idx);
  const provided = value.slice(idx + 1);
  const expected = await sign(payload, secret);
  if (expected.length !== provided.length) return [];
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ provided.charCodeAt(i);
  }
  if (diff !== 0) return [];
  return payload ? payload.split(',').filter(Boolean) : [];
}

export async function buildCookie(slugs: string[], secret: string): Promise<string> {
  const unique = Array.from(new Set(slugs)).filter((s) => /^[a-z0-9-]+$/.test(s));
  const payload = unique.join(',');
  const sig = await sign(payload, secret);
  return `${payload}.${sig}`;
}

export function setCookieHeader(value: string): string {
  return `${COOKIE_NAME}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}`;
}

// Maps slug to env var name: "dankeskarte" -> "PW_DANKESKARTE", "wedding-magazine" -> "PW_WEDDING_MAGAZINE"
export function passwordEnvKey(slug: string): string {
  return 'PW_' + slug.toUpperCase().replace(/-/g, '_');
}

export function getExpectedPassword(env: Record<string, string | undefined>, slug: string): string {
  if (!/^[a-z0-9-]+$/.test(slug)) return '';
  return env[passwordEnvKey(slug)] || '';
}
