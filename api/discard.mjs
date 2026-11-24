// 부스: 안 가져간 사진을 버리고 대기 상태 비우기
import { ready, r, send, body, station, curKey } from './_db.mjs';
export default async function handler(req, res) {
  if (!ready()) return send(res, 503, { error: 'storage_not_connected' });
  if (req.method !== 'POST') return send(res, 405, { error: 'method' });
  const b = await body(req); const id = b.id; const st = station(b.s);
  const cur = await r('GET', curKey(st));
  if (cur && JSON.parse(cur).id === id) await r('DEL', curKey(st));
  if (id && !(await r('EXISTS', 'claim:'+id))) await r('DEL', 'photo:'+id);
  send(res, 200, { ok: true });
}
