import type { Env } from "../../../_lib/env";
import { err } from "../../../_lib/response";

export const onRequestGet: PagesFunction<Env> = async ({ env, params }) => {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return err("invalid id", 400);

  const row = await env.DB.prepare(
    `SELECT audio_key, mime_type, status FROM compliments WHERE id = ?`
  )
    .bind(id)
    .first<{ audio_key: string | null; mime_type: string | null; status: string }>();

  if (!row || !row.audio_key) return err("not found", 404);
  if (!["approved", "seed"].includes(row.status)) return err("not available", 404);

  const obj = await env.AUDIO.get(row.audio_key);
  if (!obj) return err("audio missing", 404);

  return new Response(obj.body, {
    headers: {
      "Content-Type": obj.httpMetadata?.contentType || row.mime_type || "audio/webm",
      "Content-Length": String(obj.size),
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": "inline",
      "Accept-Ranges": "bytes",
    },
  });
};
