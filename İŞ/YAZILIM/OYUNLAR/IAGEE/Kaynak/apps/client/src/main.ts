/**
 * @rift-empire/client — varsayılan giriş (önizleme).
 * İki istemcili transport: `npm run demo:transport` (önce sunucuyu başlatın).
 */
import type { MatchState } from "@rift-empire/shared";
import { createInitialMatchState, MatchPhase } from "@rift-empire/shared";

const localView: MatchState = createInitialMatchState("client-preview");
localView.phase = MatchPhase.Running;
localView.matchStartTick = 0;
localView.matchEndTick = null;

console.log("[rift-empire/client] preview phase:", localView.phase);
console.log("[rift-empire/client] terminal demo: npm run demo:transport");
console.log("[rift-empire/client] browser shell: npm run dev:browser (sunucu ws açık olsun)");
