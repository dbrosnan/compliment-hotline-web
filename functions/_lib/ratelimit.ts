import type { Env } from "./env";

type Window = { limit: number; seconds: number };

/**
 * Fixed-window rate limiter backed by Workers KV.
 * Fails open on read errors, closed on write errors (better to drop a submission than let spam through).
 */
export async function checkRateLimit(
  env: Env,
  route: string,
  ipHash: string,
  windows: Window[]
): Promise<{ allowed: true } | { allowed: false; retryAfter: number }> {
  const now = Math.floor(Date.now() / 1000);

  for (const w of windows) {
    const bucket = Math.floor(now / w.seconds);
    const key = `rl:${route}:${ipHash}:${w.seconds}:${bucket}`;
    let count = 0;
    try {
      const v = await env.RATE_LIMIT.get(key);
      count = v ? Number(v) : 0;
    } catch {
      // fail-open on read failure
      continue;
    }
    if (count >= w.limit) {
      const retryAfter = (bucket + 1) * w.seconds - now;
      return { allowed: false, retryAfter: Math.max(1, retryAfter) };
    }
  }

  // increment all windows (best-effort; if KV write fails we've already served the req)
  for (const w of windows) {
    const bucket = Math.floor(now / w.seconds);
    const key = `rl:${route}:${ipHash}:${w.seconds}:${bucket}`;
    try {
      const v = await env.RATE_LIMIT.get(key);
      const count = v ? Number(v) + 1 : 1;
      await env.RATE_LIMIT.put(key, String(count), { expirationTtl: w.seconds * 2 });
    } catch {
      // fail-open — KV may be over quota
    }
  }

  return { allowed: true };
}

export const LIMITS = {
  text: [
    { limit: 5, seconds: 60 },
    { limit: 20, seconds: 3600 },
  ],
  audioInit: [
    { limit: 3, seconds: 60 },
    { limit: 10, seconds: 3600 },
  ],
  audioFinalize: [
    { limit: 5, seconds: 60 },
    { limit: 15, seconds: 3600 },
  ],
} as const;
