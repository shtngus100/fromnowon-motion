// 점검용: 지금 전달 대기 중인 사진이 있는지 (id는 숨김)
import { ready, r, send } from './_db.mjs';
export default async function handler(req, res) {
  if (!ready()) return send(res, 503, { error: 'storage_not_connected' });
  const cur = await r('GET', 'booth:current');
  const count = await r('GET', 'booth:count');
  if (!cur) return send(res, 200, { waiting: false, count });
  const p = JSON.parse(cur);
  send(res, 200, { waiting: true, no: p.no, claimed: !!(await r('EXISTS', 'claim:'+p.id)), photo: !!(await r('EXISTS', 'photo:'+p.id)), count });
}
