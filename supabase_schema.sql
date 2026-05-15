-- ============================================
-- ZakaTax Database Schema
-- Jalankan SQL ini di Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Tabel Profil Muzakki (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  npwp TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabel Riwayat Kalkulasi Zakat
CREATE TABLE IF NOT EXISTS zakat_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_assets NUMERIC NOT NULL DEFAULT 0,
  gold_price NUMERIC NOT NULL DEFAULT 0,
  nisab NUMERIC NOT NULL DEFAULT 0,
  is_wajib_zakat BOOLEAN NOT NULL DEFAULT FALSE,
  zakat_amount NUMERIC NOT NULL DEFAULT 0,
  calculated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabel Riwayat Pembayaran Zakat
CREATE TABLE IF NOT EXISTS zakat_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calculation_id UUID REFERENCES zakat_calculations(id) ON DELETE SET NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  payment_method TEXT DEFAULT '',
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS) — Keamanan Data
-- User hanya bisa akses data miliknya sendiri
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE zakat_payments ENABLE ROW LEVEL SECURITY;

-- Policies: profiles
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Policies: zakat_calculations
CREATE POLICY "Users can view own calculations"
  ON zakat_calculations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calculations"
  ON zakat_calculations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calculations"
  ON zakat_calculations FOR DELETE
  USING (auth.uid() = user_id);

-- Policies: zakat_payments
CREATE POLICY "Users can view own payments"
  ON zakat_payments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments"
  ON zakat_payments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payments"
  ON zakat_payments FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- Auto-create profile on signup (Trigger)
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- Indexes untuk performa query
-- ============================================
CREATE INDEX IF NOT EXISTS idx_calculations_user_id ON zakat_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_calculations_date ON zakat_calculations(calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON zakat_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON zakat_payments(status);
