import type { Env } from "../../_lib/env";
import { ok } from "../../_lib/response";

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  const res = await env.DB.prepare(
    `SELECT COUNT(*) AS n FROM compliments WHERE status IN ('approved','seed')`
  ).first<{ n: number }>();
  return ok(
    { total: res?.n ?? 0 },
    { headers: { "Cache-Control": "public, max-age=60" } }
  );
};
