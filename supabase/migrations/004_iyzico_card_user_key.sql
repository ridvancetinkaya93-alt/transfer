-- iyzico kart saklama için müşteri anahtarı
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS iyzico_card_user_key TEXT;

CREATE INDEX IF NOT EXISTS idx_profiles_iyzico_card_user ON profiles(iyzico_card_user_key) WHERE iyzico_card_user_key IS NOT NULL;
