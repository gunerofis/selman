import { getDataConfig } from "./data-server";
import { hashSecret } from "./admin-auth";
export async function isRateLimited(request:Request,scope:string,limit=8,windowMs=60000) {
  const config=getDataConfig();if(!config)return true;
  const ip=request.headers.get("cf-connecting-ip")||"local";
  const now=Date.now(),start=Math.floor(now/windowMs)*windowMs;
  const key=scope+":"+start+":"+await hashSecret(ip);
  const row=await config.db.prepare("INSERT INTO rate_limits(key,window_start,count) VALUES(?,?,1) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count").bind(key,start).first<{count:number}>();
  if(Math.random()<0.01)await config.db.prepare("DELETE FROM rate_limits WHERE key IN (SELECT key FROM rate_limits WHERE window_start<? LIMIT 250)").bind(now-7*86400000).run();
  return !row||row.count>limit;
}
