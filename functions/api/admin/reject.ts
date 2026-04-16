import type { Env } from "../../_lib/env";
import { err, ok } from "../../_lib/response";
import { isAdmin } from "../../_lib/admin";

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (!(await isAdmin(env, request))) return err("unauthorized", 401);

  let body: { id?: number; reason?: string };
  try {
    body = await request.json();
  } catch {
    return err("invalid JSON", 400);
  }
  const id = Number(body.id);
  if (!Number.isFinite(id)) return err("invalid id", 400);
  const reason = (body.reason || "").slice(0, 200);

  // Move R2 object to rejected/ prefix if it exists
  const row = await env.DB.prepare(`SELECT audio_key FROM compliments WHERE id = ?`)
    .bind(id)
    .first<{ audio_key: string | null }>();
  if (row?.audio_key) {
    const rejectedKey = `rejected/${row.audio_key.replace(/^audio\//, "")}`;
    try {
      const obj = await env.AUDIO.get(row.audio_key);
      if (obj) {
        await env.AUDIO.put(rejectedKey, obj.body, { httpMetadata: obj.httpMetadata });
        await env.AUDIO.delete(row.audio_key);
      }
    } catch {
      /* best-effort */
    }
  }

  await env.DB.prepare(
    `UPDATE compliments SET status = 'rejected', reject_reason = ? WHERE id = ?`
  )
    .bind(reason, id)
    .run();

  return ok({ id, status: "rejected" });
};
