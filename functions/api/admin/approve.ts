import type { Env } from "../../_lib/env";
import { err, ok } from "../../_lib/response";
import { isAdmin } from "../../_lib/admin";

export const onRequestPost: PagesFunction<Env> = async ({ env, request }) => {
  if (!(await isAdmin(env, request))) return err("unauthorized", 401);

  let body: { id?: number };
  try {
    body = await request.json();
  } catch {
    return err("invalid JSON", 400);
  }
  const id = Number(body.id);
  if (!Number.isFinite(id)) return err("invalid id", 400);

  await env.DB.prepare(`UPDATE compliments SET status = 'approved' WHERE id = ?`).bind(id).run();
  return ok({ id, status: "approved" });
};
