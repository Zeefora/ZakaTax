import { supabase } from './supabase';
import { encrypt, decrypt, ENCRYPTION_KEY, SENSITIVE_FIELDS } from './encryption';

// ============================================
// AUTH OPERATIONS
// ============================================

/** Register user baru dengan email, password, dan metadata */
export async function signUp({ email, password, fullName, npwp }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) throw error;

  // Update profile with encrypted NPWP if provided
  if (data.user && npwp) {
    const encryptedNpwp = await encrypt(npwp, ENCRYPTION_KEY);
    await supabase
      .from('profiles')
      .update({ npwp: encryptedNpwp, full_name: fullName })
      .eq('id', data.user.id);
  }

  return data;
}

/** Login dengan email dan password */
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/** Logout */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Get current session */
export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

// ============================================
// PROFILE OPERATIONS
// ============================================

/** Get user profile (with NPWP decryption) */
export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  // Decrypt sensitive fields
  if (data && data.npwp) {
    try {
      data.npwp = await decrypt(data.npwp, ENCRYPTION_KEY);
    } catch {
      // NPWP might not be encrypted (legacy data), leave as-is
    }
  }
  return data;
}

/** Update user profile */
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ============================================
// ZAKAT CALCULATION OPERATIONS
// ============================================

/** Simpan kalkulasi zakat */
export async function saveCalculation({
  userId,
  totalAssets,
  goldPrice,
  nisab,
  isWajibZakat,
  zakatAmount,
}) {
  const { data, error } = await supabase
    .from('zakat_calculations')
    .insert({
      user_id: userId,
      total_assets: totalAssets,
      gold_price: goldPrice,
      nisab,
      is_wajib_zakat: isWajibZakat,
      zakat_amount: zakatAmount,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Get riwayat kalkulasi user */
export async function getCalculations(userId) {
  const { data, error } = await supabase
    .from('zakat_calculations')
    .select('*')
    .eq('user_id', userId)
    .order('calculated_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data || [];
}

/** Get kalkulasi terakhir user */
export async function getLatestCalculation(userId) {
  const { data, error } = await supabase
    .from('zakat_calculations')
    .select('*')
    .eq('user_id', userId)
    .order('calculated_at', { ascending: false })
    .limit(1)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

// ============================================
// PAYMENT OPERATIONS
// ============================================

/** Buat pembayaran zakat baru */
export async function createPayment({ userId, calculationId, amount }) {
  const { data, error } = await supabase
    .from('zakat_payments')
    .insert({
      user_id: userId,
      calculation_id: calculationId,
      amount,
      status: 'pending',
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Update status pembayaran */
export async function updatePaymentStatus(paymentId, status) {
  const updates = { status };
  if (status === 'completed') {
    updates.paid_at = new Date().toISOString();
  }
  const { data, error } = await supabase
    .from('zakat_payments')
    .update(updates)
    .eq('id', paymentId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Get riwayat pembayaran user */
export async function getPayments(userId) {
  const { data, error } = await supabase
    .from('zakat_payments')
    .select('*, zakat_calculations(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data || [];
}
