// lib/directus.js
import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};
const DIRECTUS_URL   = extra.DIRECTUS_URL   || "https://crm.platafrica.online";
const DIRECTUS_TOKEN = extra.DIRECTUS_TOKEN || "1DKRCgcytoNg1NbDdlCf8rxnOdg6dXT_";

// Build hero image URL (guide: hero_image.filename_disk → /assets/<filename>)
const buildAssetUrl = (hero_image) => {
  const file = hero_image?.filename_disk || hero_image?.id || null;
  return file ? `${DIRECTUS_URL}/assets/${file}` : null;
};

const toNumberMaybe = (v) => {
  if (v == null) return null;
  if (typeof v === "number" && isFinite(v)) return v;
  const cleaned = String(v).replace(/[^\d.,-]/g, "").replace(/,/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
};

/**
 * Deep-scan helper:
 * If product_price is missing, look for any nested key that looks like a price.
 * We score candidate paths so we prefer product_price, auction_price, ... etc.
 */
const looksLikePriceKey = (k) => /(product_price|auction_price|pricezar|price|amount|value|zar|rand)/i.test(k);

const scoreForPath = (path) => {
  const p = path.toLowerCase();
  if (p.includes("product_price")) return 0;
  if (p.includes("auction_price")) return 1;
  if (p.includes("pricezar") || p.includes("zar")) return 2;
  if (p.endsWith(".price") || p.includes(".price")) return 3;
  if (p.includes("amount")) return 4;
  if (p.includes("value")) return 5;
  return 9;
};

function deepFindPrice(obj, base = "root", seen = new Set(), out = []) {
  if (!obj || typeof obj !== "object") return out;
  if (seen.has(obj)) return out;
  seen.add(obj);

  if (Array.isArray(obj)) {
    obj.forEach((v, i) => deepFindPrice(v, `${base}[${i}]`, seen, out));
    return out;
  }

  // object
  for (const [k, v] of Object.entries(obj)) {
    const path = `${base}.${k}`;
    if (looksLikePriceKey(k)) {
      // direct numeric/numeric-like
      const n = toNumberMaybe(v);
      if (n != null) out.push({ path, price: n });
      // or nested object with amount/value/price properties
      if (v && typeof v === "object") {
        const nested =
          v.price ?? v.value ?? v.amount ?? v.net ?? v.gross ?? null;
        const n2 = toNumberMaybe(nested);
        if (n2 != null) out.push({ path: `${path}(nested)`, price: n2 });
      }
    }
    if (v && typeof v === "object") deepFindPrice(v, path, seen, out);
  }
  return out;
}

const pickPrice = (row) => {
  // Primary (per the guide)
  const direct = toNumberMaybe(row?.product_price);
  if (direct != null) return { price: direct, priceKey: "product_price" };

  // Fallback: scan for any other price-like fields
  const candidates = deepFindPrice(row);
  if (candidates.length) {
    candidates.sort((a, b) => {
      const sa = scoreForPath(a.path);
      const sb = scoreForPath(b.path);
      if (sa !== sb) return sa - sb;
      // tie-breaker: larger price first
      return (b.price ?? 0) - (a.price ?? 0);
    });
    const best = candidates[0];
    return { price: best.price, priceKey: best.path };
  }

  return { price: null, priceKey: null };
};

// Map raw row -> UI item
const mapRow = (row) => {
  const { price, priceKey } = pickPrice(row);
  return {
    id: row?.id,
    title: row?.product_title || row?.title || "Untitled",
    price,
    priceKey,
    description: row?.product_description || row?.description || null,
    jeweller: row?.jeweller || row?.product_jeweller || null,
    company: row?.company || row?.product_company || null,
    imageUrl: buildAssetUrl(row?.hero_image),
    qrUrl: buildAssetUrl(row?.product_qr),
    status: row?.status || "unknown",
  };
};

/**
 * Fetch auction items using the guide’s URL pattern:
 *   /items/product?fields=*.*&access_token=TOKEN&filter[status][_eq]=active&sort=-id&limit=200
 * Also includes Authorization header (harmless and more secure).
 */
export async function fetchAuctionItems({
  limit = 200,
  status = "active",
  sort = "-id",
} = {}) {
  const qs = new URLSearchParams({
    fields: "*.*",
    sort,
    limit: String(limit),
  });
  if (status) qs.append("filter[status][_eq]", status);
  if (DIRECTUS_TOKEN) qs.append("access_token", DIRECTUS_TOKEN);

  const url = `${DIRECTUS_URL}/items/product?${qs.toString()}`;
  const res = await fetch(url, {
    headers: DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {},
  });

  if (!res.ok) {
    let details = "";
    try { details = await res.text(); } catch {}
    throw new Error(`Directus request failed (${res.status}): ${details || res.statusText}`);
  }

  const json = await res.json();
  const rows = Array.isArray(json?.data) ? json.data : [];
  const mapped = rows.map(mapRow);

  if (__DEV__ && mapped.length) {
    const s = mapped[0];
    console.log("[Directus] sample", {
      id: s.id,
      title: s.title,
      price: s.price,
      priceKey: s.priceKey,       // <- see what field we used
      imageUrl: s.imageUrl,
      company: s.company,
      jeweller: s.jeweller,
    });
  }

  return mapped;
}
