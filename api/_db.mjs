// Upstash Redis (Vercel Marketplace) REST 호출 도우미
const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
export const ready = () => !!(URL_ && TOKEN);
export async function r(...cmd) {
  const res = await fetch(URL_, { method: 'POST', headers: { Authorization: 'Bearer '+TOKEN, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd) });
  const j = await res.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}
export const TTL = 60 * 60 * 24 * 3; // 사진 보관 3일
export function send(res, code, obj) { res.setHeader('Cache-Control', 'no-store'); res.status(code).json(obj); }
export async function body(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks = []; for await (const c of req) chunks.push(c); return JSON.parse(Buffer.concat(chunks).toString() || '{}');
}
// 부스 구분: main(기본) / ddp 등. 키 이름에 붙임
export function station(v) { const s = String(v || 'main').toLowerCase(); return /^[a-z0-9-]{1,20}$/.test(s) ? s : 'main'; }
export const curKey = (s) => s === 'main' ? 'booth:current' : 'booth:current:' + s;
export const cntKey = (s) => s === 'main' ? 'booth:count' : 'booth:count:' + s;
