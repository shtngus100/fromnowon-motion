// 부스: 고른 사진 1장을 저장하고 "전달 대기" 상태로 둠. 이전 미수령 사진은 삭제
import { ready, r, TTL, send, body, station, curKey, cntKey } from './_db.mjs';
export const config = { api: { bodyParser: { sizeLimit: '4mb' } } };
export default async function handler(req, res) {
  if (!ready()) return send(res, 503, { error: 'storage_not_connected' });
  if (req.method !== 'POST') return send(res, 405, { error: 'method' });
  const b = await body(req); const image = b.image; const st = station(b.s);
  if (typeof image !== 'string' || !image.startsWith('data:image/') || image.length > 3_500_000) return send(res, 400, { error: 'bad_image' });
  const prev = await r('GET', curKey(st));
  if (prev) { const p = JSON.parse(prev); if (!(await r('EXISTS', 'claim:'+p.id))) await r('DEL', 'photo:'+p.id); }
  const no = await r('INCR', cntKey(st));
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 20);
  await r('SET', 'photo:'+id, JSON.stringify({ id, no, image, createdAt: Date.now() }), 'EX', TTL);
  await r('SET', curKey(st), JSON.stringify({ id, no }));
  send(res, 200, { id, no });
}
