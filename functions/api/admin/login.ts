import type { Env } from "../../_lib/env";
import { err, ok } from "../../_lib/response";
import { sha256Hex } from "../../_lib/hash";

/**
 * POST /api/admin/login
 * Body: { token: string }
 * Sets an httpOnly cookie with HMAC(token) on success.
 */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.ADMIN_TOKEN) return err("admin not configured", 503);
  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return err("invalid JSON", 400);
  }
  if (body.token !== env.ADMIN_TOKEN) return err("unauthorized", 401);

  const sig = await sha256Hex(`${env.ADMIN_TOKEN}:session`);
  const cookie = `ch_admin=${sig}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=28800`;
  return ok({ logged_in: true }, { headers: { "Set-Cookie": cookie } });
};

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  if (!env.ADMIN_TOKEN) return err("admin not configured", 503);
  const cookie = request.headers.get("Cookie") || "";
  const sig = await sha256Hex(`${env.ADMIN_TOKEN}:session`);
  const logged_in = cookie.includes(`ch_admin=${sig}`);
  return ok({ logged_in });
};
