-- Grand Sunrise Palace CMS
-- Run once on Neon / Supabase / local Postgres if you prefer a manual setup.
-- The API also creates these tables automatically on first request.

CREATE TABLE IF NOT EXISTS site_content (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
