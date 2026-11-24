// 폰(NFC 태그): 대기중인 사진을 처음 태그한 폰이 가져감. 같은 폰은 다시 태그해도 같은 사진
import { ready, r, TTL, send, body, station, curKey } from './_db.mjs';
export default async function handler(req, res) {
  if (!ready()) return send(res, 503, { error: 'storage_not_connected' });
  if (req.method !== 'POST') return send(res, 405, { error: 'method' });
  const b = await body(req); const token = b.token; const st = station(b.s);
  if (typeof token !== 'string' || token.length < 8) return send(res, 400, { error: 'token' });
  const cur = await r('GET', curKey(st));
  if (!cur) return send(res, 200, { id: null });
  const { id } = JSON.parse(cur);
  if (!(await r('EXISTS', 'photo:'+id))) return send(res, 200, { id: null });
  const ok = await r('SET', 'claim:'+id, token, 'NX', 'EX', TTL);
  if (ok === 'OK') return send(res, 200, { id });
  const owner = await r('GET', 'claim:'+id);
  send(res, 200, { id: owner === token ? id : null });
}
