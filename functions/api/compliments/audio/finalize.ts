import type { Env } from "../../../_lib/env";
import { err, ok } from "../../../_lib/response";
import { clientIp, hashIp } from "../../../_lib/hash";
import { checkRateLimit, LIMITS } from "../../../_lib/ratelimit";

type Body = { id?: number };

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return err("invalid JSON", 400);
  }

  const id = Number(body.id);
  if (!Number.isFinite(id)) return err("invalid id", 400);

  const ip = clientIp(request);
  const ipHash = await hashIp(ip, env.IP_HASH_SALT_SEED);
  const rl = await checkRateLimit(env, "audio_finalize", ipHash, [...LIMITS.audioFinalize]);
  if (!rl.allowed) {
    return err("too many requests", 429, { "Retry-After": String(rl.retryAfter) });
  }

  const row = await env.DB.prepare(
    `SELECT audio_key, status FROM compliments WHERE id = ?`
  )
    .bind(id)
    .first<{ audio_key: string | null; status: string }>();

  if (!row) return err("not found", 404);
  if (!row.audio_key) return err("no audio key", 400);

  // HEAD-check the R2 object
  const head = await env.AUDIO.head(row.audio_key);
  if (!head) return err("audio not yet uploaded", 409);

  // Mark finalized_at by updating a no-op status touch.
  // We keep status='pending' — an admin still has to approve it.
  await env.DB.prepare(
    `UPDATE compliments SET mime_type = COALESCE(?, mime_type) WHERE id = ?`
  )
    .bind(head.httpMetadata?.contentType || null, id)
    .run();

  return ok({ id, status: "pending" });
};
