// TEMPORARY DEBUG — remove after diagnosis. Lists PW_* env var keys only (no values).
export const onRequestGet: PagesFunction = async (context) => {
  const env = context.env as Record<string, unknown>;
  const pwKeys = Object.keys(env).filter(k => k.startsWith('PW_')).sort();
  const hasBridal = 'PW_BRIDAL_SHOWER_INVITATION_ROMANTIC' in env;
  const bridalLen = hasBridal ? String(env['PW_BRIDAL_SHOWER_INVITATION_ROMANTIC']).length : 0;
  return new Response(JSON.stringify({
    count: pwKeys.length,
    hasBridal,
    bridalLen,
    keys: pwKeys,
  }, null, 2), { headers: { 'content-type': 'application/json' } });
};
