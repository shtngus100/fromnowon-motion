// 부스: 이 사진을 폰이 가져갔는지 확인
import { ready, r, send } from './_db.mjs';
export default async function handler(req, res) {
  if (!ready()) return send(res, 503, { error: 'storage_not_connected' });
  const id = String(req.query.id || '');
  if (!id) return send(res, 400, { error: 'id' });
  send(res, 200, { claimed: !!(await r('EXISTS', 'claim:'+id)) });
}
