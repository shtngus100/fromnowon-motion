// 점검용: 지금 전달 대기 중인 사진이 있는지 (id는 숨김). ?s=ddp 로 부스 지정
import { ready, r, send, station, curKey, cntKey } from './_db.mjs';
export default async function handler(req, res) {
  if (!ready()) return send(res, 503, { error: 'storage_not_connected' });
  const st = station(req.query.s);
  const cur = await r('GET', curKey(st));
  const count = await r('GET', cntKey(st));
  if (!cur) return send(res, 200, { station: st, waiting: false, count });
  const p = JSON.parse(cur);
  send(res, 200, { station: st, waiting: true, no: p.no, claimed: !!(await r('EXISTS', 'claim:'+p.id)), photo: !!(await r('EXISTS', 'photo:'+p.id)), count });
}
