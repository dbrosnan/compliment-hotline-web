import type { Env } from "../../../_lib/env";
import { err } from "../../../_lib/response";
import { isAdmin } from "../../../_lib/admin";

/**
 * Admin-only streaming endpoint — lets moderators preview pending audio
 * before the public GET endpoint will serve it.
 */
export const onRequestGet: PagesFunction<Env> = async ({ env, request, params }) => {
  if (!(await isAdmin(env, request))) return err("unauthorized", 401);

  const id = Number(params.id);
  if (!Number.isFinite(id)) return err("invalid id", 400);

  const row = await env.DB.prepare(
    `SELECT audio_key, mime_type FROM compliments WHERE id = ?`
  )
    .bind(id)
    .first<{ audio_key: string | null; mime_type: string | null }>();

  if (!row || !row.audio_key) return err("not found", 404);
  const obj = await env.AUDIO.get(row.audio_key);
  if (!obj) return err("audio missing", 404);

  return new Response(obj.body, {
    headers: {
      "Content-Type": obj.httpMetadata?.contentType || row.mime_type || "audio/webm",
      "Content-Length": String(obj.size),
      "Cache-Control": "private, no-store",
    },
  });
};
