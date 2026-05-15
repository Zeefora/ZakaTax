/**
 * Gold Price Service
 * Mengambil harga emas terbaru dari API publik
 * Digunakan untuk menghitung Nisab Zakat (85 gram emas murni)
 */

const CACHE_KEY = 'zakatax_gold_price';
const CACHE_DURATION = 60 * 60 * 1000; // 1 jam cache

// Fallback price jika semua API gagal (harga emas per gram dalam IDR)
const FALLBACK_PRICE_PER_GRAM = 1285000;

/**
 * Get cached gold price if still valid
 */
function getCachedPrice() {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const { price, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return price;
    }
  } catch {
    // Cache corrupted, ignore
  }
  return null;
}

/**
 * Save gold price to cache
 */
function setCachedPrice(price) {
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    price,
    timestamp: Date.now(),
  }));
}

/**
 * Fetch from FreeGoldAPI (no API key required)
 * Returns price per troy ounce in USD
 */
async function fetchFromFreeGoldAPI() {
  const res = await fetch('https://freegoldapi.com/data/latest.json');
  if (!res.ok) throw new Error('FreeGoldAPI unavailable');
  const data = await res.json();
  // Data format varies - extract gold price in USD per troy ounce
  if (Array.isArray(data) && data.length > 0) {
    const gold = data.find(item => 
      item.metal === 'Gold' || item.symbol === 'XAU' || item.name?.includes('Gold')
    );
    if (gold && (gold.price || gold.value)) {
      return gold.price || gold.value;
    }
  }
  if (data.price) return data.price;
  if (data.gold) return data.gold;
  throw new Error('Could not parse FreeGoldAPI response');
}

/**
 * Fetch USD to IDR exchange rate
 */
async function fetchUSDtoIDR() {
  try {
    const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    if (!res.ok) throw new Error('Exchange rate API unavailable');
    const data = await res.json();
    return data.rates?.IDR || 16500; // Fallback rate
  } catch {
    return 16500; // Approximate fallback
  }
}

/**
 * Convert troy ounce price (USD) to per-gram price (IDR)
 * 1 troy ounce = 31.1035 grams
 */
function convertToIDRPerGram(usdPerOunce, usdToIdr) {
  const usdPerGram = usdPerOunce / 31.1035;
  return Math.round(usdPerGram * usdToIdr);
}

/**
 * Get current gold price per gram in IDR
 * Tries multiple sources with fallback
 * 
 * @returns {{ pricePerGram: number, source: string, isLive: boolean }}
 */
export async function getGoldPriceIDR() {
  // Check cache first
  const cached = getCachedPrice();
  if (cached) {
    return { pricePerGram: cached, source: 'cache', isLive: true };
  }

  try {
    // Try FreeGoldAPI
    const usdPrice = await fetchFromFreeGoldAPI();
    const usdToIdr = await fetchUSDtoIDR();
    const pricePerGram = convertToIDRPerGram(usdPrice, usdToIdr);
    
    if (pricePerGram > 500000 && pricePerGram < 5000000) {
      // Sanity check: gold should be between 500k-5M IDR/gram
      setCachedPrice(pricePerGram);
      return { pricePerGram, source: 'FreeGoldAPI + ExchangeRate', isLive: true };
    }
  } catch (err) {
    console.warn('Gold price API failed:', err.message);
  }

  // All APIs failed — use fallback
  return { pricePerGram: FALLBACK_PRICE_PER_GRAM, source: 'fallback', isLive: false };
}

/**
 * Calculate Nisab (85 gram emas)
 */
export function calculateNisab(pricePerGram) {
  return 85 * pricePerGram;
}

/**
 * Calculate Zakat (2.5% of total assets if above nisab)
 */
export function calculateZakat(totalAssets, nisab) {
  if (totalAssets >= nisab) {
    return totalAssets * 0.025;
  }
  return 0;
}
