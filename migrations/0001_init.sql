-- Compliment Hotline — initial schema
-- Single source of truth for text + audio submissions from the web.

CREATE TABLE IF NOT EXISTS compliments (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at      INTEGER NOT NULL DEFAULT (unixepoch()),
  name            TEXT,
  message         TEXT,
  audio_key       TEXT,
  mime_type       TEXT,
  duration_ms     INTEGER,
  status          TEXT NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','approved','rejected','seed')),
  reject_reason   TEXT,
  ip_hash         TEXT NOT NULL,
  user_agent_hash TEXT NOT NULL,
  CHECK (message IS NOT NULL OR audio_key IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_compliments_status_created
  ON compliments (status, created_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_compliments_ip_created
  ON compliments (ip_hash, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_compliments_pending
  ON compliments (status, created_at) WHERE status = 'pending';
