-- Admin yetkisi: profiles.is_admin (Supabase Auth ile giriş)

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin) WHERE is_admin = TRUE;

-- İlk admin ataması (kayıt sonrası bir kez çalıştırın):
-- UPDATE profiles SET is_admin = TRUE WHERE email = 'admin@rcetinkayaturizm.com';
