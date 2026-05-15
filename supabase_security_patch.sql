-- ============================================
-- ZakaTax Security Patch
-- Jalankan di Supabase Dashboard > SQL Editor
-- ============================================

-- 1. Validasi input di level database (constraints)
ALTER TABLE profiles 
  ADD CONSTRAINT chk_npwp_format 
  CHECK (npwp = '' OR npwp ~ '^\d{2}\.\d{3}\.\d{3}\.\d{1}-\d{3}\.\d{3}$');

ALTER TABLE zakat_calculations
  ADD CONSTRAINT chk_positive_assets CHECK (total_assets >= 0),
  ADD CONSTRAINT chk_positive_gold CHECK (gold_price > 0),
  ADD CONSTRAINT chk_positive_nisab CHECK (nisab > 0),
  ADD CONSTRAINT chk_positive_zakat CHECK (zakat_amount >= 0);

ALTER TABLE zakat_payments
  ADD CONSTRAINT chk_positive_payment CHECK (amount > 0);

-- 2. Prevent profile deletion via API (only cascade from auth)
CREATE POLICY "Prevent profile deletion"
  ON profiles FOR DELETE
  USING (false);

-- 3. Prevent updating profile ID
CREATE POLICY "Prevent updating critical fields"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 4. Prevent updating other users' calculations
CREATE POLICY "Users cannot update calculations"
  ON zakat_calculations FOR UPDATE
  USING (false);

-- 5. Rate limiting helper: max 100 calculations per day per user
CREATE OR REPLACE FUNCTION check_calculation_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO recent_count
  FROM zakat_calculations
  WHERE user_id = NEW.user_id
    AND calculated_at > NOW() - INTERVAL '1 day';
  
  IF recent_count >= 100 THEN
    RAISE EXCEPTION 'Rate limit exceeded: max 100 calculations per day';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_calculation_rate_limit ON zakat_calculations;
CREATE TRIGGER trg_calculation_rate_limit
  BEFORE INSERT ON zakat_calculations
  FOR EACH ROW
  EXECUTE FUNCTION check_calculation_rate_limit();

-- 6. Audit log table for sensitive operations
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  metadata JSONB DEFAULT '{}',
  ip_address TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can only view their own audit logs
CREATE POLICY "Users can view own audit logs"
  ON audit_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Only system can insert audit logs
CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 7. Auto-log payment changes
CREATE OR REPLACE FUNCTION log_payment_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (user_id, action, table_name, record_id, metadata)
  VALUES (
    NEW.user_id,
    TG_OP,
    'zakat_payments',
    NEW.id,
    jsonb_build_object('amount', NEW.amount, 'status', NEW.status)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_log_payments ON zakat_payments;
CREATE TRIGGER trg_log_payments
  AFTER INSERT OR UPDATE ON zakat_payments
  FOR EACH ROW
  EXECUTE FUNCTION log_payment_changes();

-- 8. Secure updated_at auto-update for profiles
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated ON profiles;
CREATE TRIGGER trg_profiles_updated
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();
