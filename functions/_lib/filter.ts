/**
 * Minimal keyword blocklist for text pre-filter.
 * Intentionally narrow — audio is human-moderated via /admin or the Pi worker.
 * Mirrors the spirit of `moderation/filter.py` on the hardware side.
 */
const BLOCKED = [
  // slurs + hate (minimal seed — expand via env later if needed)
  "kill yourself",
  "kys",
  "you should die",
  "go die",
  // spam signatures
  "http://",
  "https://",
  "www.",
  ".com/",
  ".net/",
  ".xyz",
  // explicit solicitation
  "onlyfans",
  "telegram @",
  "bitcoin",
  "crypto wallet",
];

export function isBlocked(text: string): { blocked: boolean; reason?: string } {
  const t = text.toLowerCase();
  for (const kw of BLOCKED) {
    if (t.includes(kw)) return { blocked: true, reason: `contains: ${kw}` };
  }
  // require at least 2 alphabetic characters so it isn't pure punctuation/garbage
  if (!/[a-z]{2,}/i.test(text)) return { blocked: true, reason: "no-letters" };
  return { blocked: false };
}
