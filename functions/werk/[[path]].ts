// Guards /werk/<slug>/* — only customers who unlocked <slug> get through.
// Unauthenticated requests redirect to /zugang?werk=<slug>.

import { COOKIE_NAME, readCookie, verifyCookie } from '../_lib/auth';

interface Env {
  COOKIE_SECRET?: string;
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  [key: string]: unknown;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  const parts = url.pathname.split('/').filter(Boolean); // ['werk', '<slug>', ...]
  const slug = parts[1] || '';

  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return Response.redirect(`${url.origin}/zugang`, 302);
  }

  const cookieValue = readCookie(request.headers.get('cookie'), COOKIE_NAME);
  const unlocked = await verifyCookie(cookieValue, env.COOKIE_SECRET || '');

  if (!unlocked.includes(slug)) {
    return Response.redirect(
      `${url.origin}/zugang?werk=${encodeURIComponent(slug)}`,
      302,
    );
  }

  return env.ASSETS.fetch(request);
};
