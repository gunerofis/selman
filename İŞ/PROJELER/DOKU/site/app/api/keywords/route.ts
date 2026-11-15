import {env} from 'cloudflare:workers';
import {handleKeywords} from '../../../server/keywords.mjs';
export const dynamic='force-dynamic';
export const GET=(request:Request)=>handleKeywords(request,env);
