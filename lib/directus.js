// lib/directus.js
import Constants from 'expo-constants';

// Read config from app.json → expo.extra.* or from env
const EXTRA = Constants.expoConfig?.extra ?? Constants.manifest?.extra ?? {};
const DIRECTUS_URL   = (EXTRA.DIRECTUS_URL   ?? process.env.DIRECTUS_URL   ?? '').replace(/\/$/, '');
const DIRECTUS_TOKEN =  EXTRA.DIRECTUS_TOKEN ?? process.env.DIRECTUS_TOKEN ?? '';

const authHeader = DIRECTUS_TOKEN ? { Authorization: `Bearer ${DIRECTUS_TOKEN}` } : {};

function assetUrl(fileId, w = 1200) {
  if (!DIRECTUS_URL || !fileId) return null;
  return `${DIRECTUS_URL}/assets/${fileId}?width=${w}&format=webp&quality=${w < 600 ? 60 : 80}`;
}

/**
 * Fetch auction items from a Directus collection named "auction_items".
 * Falls back to local demo items if config is missing or the request fails.
 */
export async function fetchAuctionItems() {
  if (!DIRECTUS_URL) {
    console.warn('DIRECTUS_URL not set — returning demo items.');
    return DEMO_ITEMS;
  }

  try {
    const params = new URLSearchParams({
      fields: [
        'id','title','designer','type','lotNumber','currentBid','reserve','endsAt',
        'image','thumb' // file IDs in Directus
      ].join(','),
      sort: 'lotNumber',
      limit: '100',
      'filter[status][_eq]': 'published',
    });
    const res = await fetch(`${DIRECTUS_URL}/items/auction_items?${params}`, { headers: authHeader });
    if (!res.ok) throw new Error(`Directus ${res.status}`);
    const json = await res.json();
    const rows = json?.data ?? [];

    return rows.map((r) => {
      const imageUrl = typeof r.image === 'string' ? assetUrl(r.image, 1200) : null;
      const thumbUrl = typeof r.thumb  === 'string' ? assetUrl(r.thumb, 500)  : (imageUrl ? assetUrl(r.image, 500) : null);
      return {
        id: r.id,
        title: r.title,
        designer: r.designer,
        type: r.type,
        lotNumber: r.lotNumber,
        currentBid: r.currentBid,
        reserve: r.reserve,
        endsAt: r.endsAt,
        // Provide both shapes so your screen works either way:
        image,  // for <RemoteImage src={item.image}/>
        thumb,  // for thumbnails
        imageUrl, // for code that expects imageUrl/thumbUrl
        thumbUrl,
      };
    });
  } catch (e) {
    console.warn('fetchAuctionItems failed, using demo items:', e?.message);
    return DEMO_ITEMS;
  }
}

// ---- Fallback demo data (uses your local images so it works offline) ----
const DEMO_ITEMS = [
  {
    id: 1,
    title: 'Eclipse (Demo)',
    designer: 'Emile Pitout, Lorin Bohm and Rob Burton',
    type: 'Neckpiece',
    lotNumber: 66,
    currentBid: 125000,
    reserve: 100000,
    endsAt: '2025-12-31T17:00:00Z',
    // Provide both fields—RemoteImage wrapper can take require() too
    image: require('../assets/designers/P66-Professional-NECKPIECE-PBBB0833-1.jpg'),
    thumb: require('../assets/designers/P66-Professional-NECKPIECE-PBBB0833-1.jpg'),
    imageUrl: require('../assets/designers/P66-Professional-NECKPIECE-PBBB0833-1.jpg'),
    thumbUrl: require('../assets/designers/P66-Professional-NECKPIECE-PBBB0833-1.jpg'),
  },
  {
    id: 2,
    title: 'Stratos (Demo)',
    designer: 'Nihal Shah',
    type: 'Ring',
    lotNumber: 2,
    currentBid: 75000,
    reserve: 70000,
    endsAt: '2025-12-31T17:00:00Z',
    image: require('../assets/designers/P2-Professional-RING-PBBB0988.jpg'),
    thumb: require('../assets/designers/P2-Professional-RING-PBBB0988.jpg'),
    imageUrl: require('../assets/designers/P2-Professional-RING-PBBB0988.jpg'),
    thumbUrl: require('../assets/designers/P2-Professional-RING-PBBB0988.jpg'),
  },
];
