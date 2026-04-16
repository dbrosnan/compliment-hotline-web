import type { Env } from "../../_lib/env";
import { err, ok } from "../../_lib/response";
import { isAdmin } from "../../_lib/admin";

export const onRequestGet: PagesFunction<Env> = async ({ env, request }) => {
  if (!(await isAdmin(env, request))) return err("unauthorized", 401);

  const res = await env.DB.prepare(
    `SELECT id, name, message, audio_key, mime_type, duration_ms, status, created_at
     FROM compliments
     WHERE status = 'pending'
     ORDER BY created_at ASC
     LIMIT 200`
  ).all();

  return ok({ items: res.results || [] });
};
