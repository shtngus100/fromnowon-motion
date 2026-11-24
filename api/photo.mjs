// 폰: 개인 링크(?p=id)로 사진 한 장 불러오기 (목록 조회 없음)
import { ready, r, send } from './_db.mjs';
export default async function handler(req, res) {
  if (!ready()) return send(res, 503, { error: 'storage_not_connected' });
  const id = String(req.query.id || '');
  if (!/^[a-f0-9]{20}$/.test(id)) return send(res, 404, { error: 'not_found' });
  const v = await r('GET', 'photo:'+id);
  if (!v) return send(res, 404, { error: 'not_found' });
  send(res, 200, JSON.parse(v));
}
