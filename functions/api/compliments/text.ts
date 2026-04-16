import { asInt, type Env } from "../../_lib/env";
import { err, ok } from "../../_lib/response";
import { clientIp, hashIp, hashUa } from "../../_lib/hash";
import { checkRateLimit, LIMITS } from "../../_lib/ratelimit";
import { isBlocked } from "../../_lib/filter";

type Body = { name?: string; message?: string; hp?: string };

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return err("invalid JSON", 400);
  }

  // Honeypot — silently succeed so bots don't learn
  if (body.hp && body.hp.trim() !== "") {
    return ok({ id: 0 }, { status: 201 });
  }

  const maxMsg = asInt(env.MAX_MESSAGE_CHARS, 500);
  const maxName = asInt(env.MAX_NAME_CHARS, 60);

  const message = (body.message || "").trim();
  const name = (body.name || "").trim();

  if (message.length < 2) return err("message too short", 400);
  if (message.length > maxMsg) return err(`message exceeds ${maxMsg} chars`, 400);
  if (name.length > maxName) return err(`name exceeds ${maxName} chars`, 400);

  const blocked = isBlocked(message);
  if (blocked.blocked) return err("message rejected by filter", 422);

  const ip = clientIp(request);
  const ipHash = await hashIp(ip, env.IP_HASH_SALT_SEED);
  const uaHash = await hashUa(request.headers.get("User-Agent") || "");

  const rl = await checkRateLimit(env, "text", ipHash, [...LIMITS.text]);
  if (!rl.allowed) {
    return err("too many requests", 429, { "Retry-After": String(rl.retryAfter) });
  }

  const result = await env.DB.prepare(
    `INSERT INTO compliments (name, message, status, ip_hash, user_agent_hash)
     VALUES (?, ?, 'pending', ?, ?)`
  )
    .bind(name || null, message, ipHash, uaHash)
    .run();

  const id = result.meta.last_row_id;
  return ok({ id }, { status: 201 });
};
