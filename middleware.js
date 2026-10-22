// Deja entrar a la página de bienvenida solo con un enlace firmado y vigente.
// Los enlaces se generan en el Panel de inducción y vencen a los 7 días.
// La clave de firma va en Vercel como variable de entorno LINK_SECRET (nunca en este archivo).

export const config = { matcher: ['/', '/index.html'] };

const MAX_DIAS = 8; // margen sobre los 7 días del enlace

function b64url(buf) {
  let s = '';
  new Uint8Array(buf).forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function firma(secret, exp) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64url(await crypto.subtle.sign('HMAC', key, enc.encode('v1.' + exp))).slice(0, 32);
}

function iguales(a, b) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function aviso(titulo, texto) {
  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Bienvenida sitti</title>
<style>:root{--navy:#33357e;--amber:#f7a82c;--bg:#f6f6fb;--fg:#1d1f45;--muted:#5b5e86}
@media (prefers-color-scheme:dark){:root{--bg:#12132b;--fg:#eceefe;--muted:#a6a9d3}}
body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--fg);font:400 17px/1.6 "Segoe UI",system-ui,sans-serif;padding:24px;box-sizing:border-box}
main{max-width:440px;text-align:center;display:grid;gap:12px}
.dot{width:56px;height:56px;border-radius:50%;margin:0 auto;background:var(--amber)}
h1{margin:0;font-size:26px;line-height:1.2;color:var(--fg)}p{margin:0;color:var(--muted)}</style></head>
<body><main><div class="dot" aria-hidden="true"></div><h1>${titulo}</h1><p>${texto}</p></main></body></html>`;
  return new Response(html, { status: 403, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const exp = Number(url.searchParams.get('e'));
  const f = url.searchParams.get('f') || '';
  const secret = process.env.LINK_SECRET;
  const ahora = Math.floor(Date.now() / 1000);

  if (!secret) return aviso('Página en configuración', 'Experiencia y Bienestar está terminando de configurar esta página. Inténtalo más tarde.');
  if (!exp || !f) return aviso('Necesitas tu enlace de bienvenida', 'Esta página se abre con el enlace personal que te envió Experiencia y Bienestar de sitti.');
  if (exp > ahora + MAX_DIAS * 86400 || !iguales(f, await firma(secret, exp))) return aviso('Enlace no válido', 'Revisa que hayas copiado el enlace completo o pide uno nuevo a Experiencia y Bienestar.');
  if (exp < ahora) return aviso('Este enlace ya venció', 'Los enlaces de bienvenida duran 7 días. Pide uno nuevo a Experiencia y Bienestar de sitti.');

  return new Response(null, { headers: { 'x-middleware-next': '1' } });
}
