// POST /zugang/unlock — validates the form password, sets the signed cookie,
// then redirects either to /werk/<slug>/ (success) or back to /zugang with ?error=1.

import {
  COOKIE_NAME,
  buildCookie,
  getExpectedPassword,
  readCookie,
  setCookieHeader,
  verifyCookie,
} from '../_lib/auth';

interface Env {
  COOKIE_SECRET?: string;
  [key: string]: unknown;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const secret = env.COOKIE_SECRET || '';

  const form = await request.formData();
  const slug = String(form.get('werk') || '').trim();
  const password = String(form.get('password') || '');

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return Response.redirect(`${url.origin}/zugang`, 302);
  }

  const expected = getExpectedPassword(env as Record<string, string | undefined>, slug);
  if (!expected || password !== expected) {
    return Response.redirect(
      `${url.origin}/zugang?werk=${encodeURIComponent(slug)}&error=1`,
      302,
    );
  }

  const existing = readCookie(request.headers.get('cookie'), COOKIE_NAME);
  const unlocked = await verifyCookie(existing, secret);
  if (!unlocked.includes(slug)) unlocked.push(slug);

  const newValue = await buildCookie(unlocked, secret);

  return new Response(null, {
    status: 302,
    headers: {
      Location: `${url.origin}/werk/${slug}/`,
      'Set-Cookie': setCookieHeader(newValue),
    },
  });
};

// GET on /zugang/unlock just bounces back to the form.
export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  return Response.redirect(`${url.origin}/zugang`, 302);
};
