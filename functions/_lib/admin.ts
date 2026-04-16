import type { Env } from "./env";
import { sha256Hex } from "./hash";

export async function isAdmin(env: Env, request: Request): Promise<boolean> {
  if (!env.ADMIN_TOKEN) return false;
  const sig = await sha256Hex(`${env.ADMIN_TOKEN}:session`);
  const cookie = request.headers.get("Cookie") || "";
  return cookie.includes(`ch_admin=${sig}`);
}
