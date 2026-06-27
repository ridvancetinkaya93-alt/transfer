-- Transfer vehicle catalog

CREATE TABLE IF NOT EXISTS transfer_vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  capacity TEXT NOT NULL,
  luggage TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  price_from INT NOT NULL,
  image_url TEXT NOT NULL,
  badge TEXT,
  badge_color TEXT,
  description TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE transfer_vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active transfer vehicles" ON transfer_vehicles FOR SELECT USING (is_active = TRUE);
