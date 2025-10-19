// screens/WelcomeScreen.js
import React, { useState, useMemo } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
  Modal,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from '@expo/vector-icons/Ionicons';
import Logo from '../components/Logo';
import { palette } from '../theme';
import { useSettings } from '../context/SettingsContext';
import { getAuth } from "firebase/auth";



// ▶ Paste your link (iframe src) here. If you accidentally paste the whole <iframe>,
// this file will extract the src automatically.
const VENUE = {
  name: 'Four Seasons Hotel The Westcliff',
  address: '67 Jan Smuts Ave, Westcliff, Johannesburg, South Africa',
  mapsUrl: 'https://maps.app.goo.gl/j7y6u5wafNregwHs9',
  embedUrl:
    'https://www.google.com/maps/embed?pb=!4v1760516436162!6m8!1m7!1sN-PJwQI3slbzYBty21iCcA!2m2!1d-26.17109474717924!2d28.03273538852881!3f287.9423220424067!4f0!5f0.7820865974627469',
};

function normalizeEmbedInput(input) {
  if (!input) return null;
  const trimmed = String(input).trim();
  if (trimmed.startsWith('<iframe')) {
    const m = trimmed.match(/src="([^"]+)"/i);
    return m ? m[1] : null;
  }
  return trimmed;
}

function makeIframeHtml(url) {
  const safe = normalizeEmbedInput(url);
  if (!safe) return null;
  return `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1, width=device-width, user-scalable=no" />
    <style>
      html, body { margin:0; padding:0; height:100%; background:transparent; }
      .wrap { position:fixed; inset:0; }
      iframe { position:absolute; inset:0; width:100%; height:100%; border:0; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <iframe
        src="${safe}"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    </div>
  </body>
</html>`;
}

function toEmbedUrl(url) {
  if (!url) return null;
  if (url.includes('/maps/embed')) return url;
  if (url.includes('google.com/maps')) {
    const join = url.includes('?') ? '&' : '?';
    return `${url}${join}output=embed`;
  }
  return null;
}

export default function WelcomeScreen() {
  const { typeScale, effectiveScheme, accent } = useSettings();
  const [fsModal, setFsModal] = useState(false);
   const [firstName, setFirstName] = useState("");

  React.useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user?.displayName) {
      const first = user.displayName.split(" ")[0];
      setFirstName(first);
    }
  }, []);

  // Theme & accent
  const isDark = effectiveScheme === 'dark';
  const brand = accent === 'platafrica' ? palette.platinumNavy : palette.valterraGreen;
  const C = {
    bg: isDark ? '#0b1220' : palette.white,
    card: isDark ? '#111827' : '#fff',
    text: isDark ? '#e5e7eb' : palette.platinumNavy,
    muted: isDark ? '#94a3b8' : palette.platinum,
    border: isDark ? '#243244' : '#e5e7eb',
  };

  const embedUrl = useMemo(
    () => normalizeEmbedInput(VENUE.embedUrl) || toEmbedUrl(VENUE.mapsUrl),
    []
  );
  const embedHtml = useMemo(() => makeIframeHtml(embedUrl), [embedUrl]);

  const openMaps = async () => {
    try {
      await Linking.openURL(VENUE.mapsUrl);
    } catch {
      const q = encodeURIComponent(VENUE.address || VENUE.name);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${q}`);
    }
  };

  const openDirections = () => {
    const dest = encodeURIComponent(VENUE.address || VENUE.name);
    Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${dest}`);
  };

  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: C.bg }]}>

      {/* Card 1 */}
      <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
        <Logo />
        <Text style={[styles.title, { color: brand }]}>
  Welcome {firstName ? firstName : "User"} 
</Text>

        <Text
          style={[
            styles.title,
            { fontSize: Math.round(styles.title.fontSize * typeScale), color: brand },
          ]}
        >
         to Valterra Platinum
        </Text>
        <Text style={[styles.subtitle, { color: C.muted }]}>
          (Previously known as Anglo American Platinum)
        </Text>

        <View style={styles.section}>
          <Text
            style={[
              styles.h2,
              { fontSize: Math.round(styles.h2.fontSize * typeScale), color: brand },
            ]}
          >
            Who We Are
          </Text>
          <Text style={[styles.p, { color: C.text }]}>
            A fully demerged leading platinum group metals (PGM) mining company with products that are
            essential ingredients in almost every aspect of modern life.
          </Text>
          <View style={styles.grid3}>
            <View style={[styles.infoCard, { borderColor: C.border, backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}>
              <Text style={[styles.infoStrong, { color: C.text }]}>29,000</Text>
              <Text style={{ color: C.text }}>Employees globally</Text>
            </View>
            <View style={[styles.infoCard, { borderColor: C.border, backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}>
              <Text style={[styles.infoStrong, { color: C.text }]}>$14.6 bn</Text>
              <Text style={{ color: C.text }}>Free cash flow 2024</Text>
            </View>
            <View style={[styles.infoCard, { borderColor: C.border, backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}>
              <Text style={[styles.infoStrong, { color: C.text }]}>$19.8 bn</Text>
              <Text style={{ color: C.text }}>EBITDA 2024</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.h2,
              { fontSize: Math.round(styles.h2.fontSize * typeScale), color: brand },
            ]}
          >
            Our Products
          </Text>
          <Text style={[styles.p, { color: C.text }]}>
            <Text style={styles.bold}>Platinum Group Metals (PGMs):</Text> Platinum, Palladium, Rhodium,
            Ruthenium, Iridium, Osmium
          </Text>
          <Text style={[styles.p, { color: C.text }]}>
            <Text style={styles.bold}>Base Metals & Others:</Text> Copper, Nickel, Cobalt, Chrome, Sulphuric Acid
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.h2,
              { fontSize: Math.round(styles.h2.fontSize * typeScale), color: brand },
            ]}
          >
            Our Purpose
          </Text>
          <Text style={[styles.p, styles.quote, { color: C.muted }]}>
            “Unearthing value to better our world”
          </Text>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.h2,
              { fontSize: Math.round(styles.h2.fontSize * typeScale), color: brand },
            ]}
          >
            Our Values
          </Text>
          <View style={styles.valuesRow}>
            <Text style={[styles.valuePill, { color: C.text, borderColor: C.border }]}>Keep it safe</Text>
            <Text style={[styles.valuePill, { color: C.text, borderColor: C.border }]}>Own it</Text>
            <Text style={[styles.valuePill, { color: C.text, borderColor: C.border }]}>Stand Together</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.h2,
              { fontSize: Math.round(styles.h2.fontSize * typeScale), color: brand },
            ]}
          >
            Where We Are
          </Text>
          <Text style={[styles.p, { color: C.text }]}>Headquarters: Rosebank, South Africa</Text>
          <Text style={[styles.p, { color: C.text }]}>Operations & Projects: Southern Africa</Text>
          <Text style={[styles.p, { color: C.text }]}>Listed on the Johannesburg & London Stock Exchanges</Text>
        </View>
      </View>

      {/* Card 2 (PlatAfrica) */}
      <View style={[styles.sectionCard, { backgroundColor: C.card, borderColor: C.border }]}>

        {/* ➤ PlatAfrica logo at the very top of the card */}
        <View style={styles.plataLogoRow}>
          <Logo variant="platafrica" />
        </View>

        <Text
          style={[
            styles.h2,
            { fontSize: Math.round(styles.h2.fontSize * typeScale), color: brand },
          ]}
        >
          PlatAfrica
        </Text>
        <Text
          style={[
            styles.h3,
            { marginTop: 4, fontSize: Math.round(styles.h3.fontSize * typeScale), color: C.text },
          ]}
        >
          PlatAfrica: Elevating Platinum Jewellery Design in South Africa
        </Text>

        <Text style={[styles.p, { color: C.text }]}>
          PlatAfrica is South Africa’s premier platinum jewellery design and manufacturing competition, proudly
          hosted by Valterra Platinum Ltd in partnership with Metal Concentrators and The Platinum Guild
          International. Now in its 26th year, PlatAfrica has built a legacy of excellence through collaborations
          with leading industry players such as De Beers, Tracr, Original Luxury, and the TFG Group.
        </Text>

        <Text style={[styles.p, { color: C.text }]}>
          The competition is designed to address three key challenges facing the local jewellery industry:
        </Text>
        <View style={styles.list}>
          <Text style={[styles.li, { color: C.text }]}>1. Access to platinum metal</Text>
          <Text style={[styles.li, { color: C.text }]}>2. Skills development</Text>
          <Text style={[styles.li, { color: C.text }]}>3. Market access</Text>
        </View>

        <Text style={[styles.p, { color: C.text }]}>
          By offering a unique platform for emerging and established designers, PlatAfrica nurtures the craft of
          platinum smithing in South Africa. Through a metal consignment scheme, participants receive platinum at
          no cost or risk, enabling them to experiment, innovate, and refine their skills. This initiative unlocks
          creativity and builds capacity in both design and manufacturing.
        </Text>

        <Text style={[styles.p, { color: C.text }]}>
          Participants benefit not only from exposure but also from the opportunity to sell their creations both
          online and in-person, with 100% of the profits going directly to the designer. Unsold pieces are
          responsibly recycled, reinforcing a circular economy within the programme.
        </Text>

        <Text style={[styles.p, { color: C.text }]}>
          PlatAfrica showcases bold, statement and capsule platinum jewellery that resonates with both local and
          international audiences. The competition continues to evolve, embracing cutting-edge technologies such as
          digital product passports, capsule collections, and Inoveo—a proprietary AI-generated platinum alloy.
          These innovations position PlatAfrica as the first African luxury jewellery brand to integrate such
          advanced solutions, setting new global benchmarks.
        </Text>

        <Text style={[styles.p, { color: C.text }]}>
          This forward-thinking approach not only empowers designers but also propels the South African platinum
          jewellery industry onto the world stage, with PlatAfrica participants having been featured in Abu Dhabi,
          Hong Kong, and the prestigious Couture Show in Las Vegas.
        </Text>
      </View>

      {/* Card 3 (Venue & Embedded Map) */}
      <View style={[styles.sectionCard, { backgroundColor: C.card, borderColor: C.border }]}>
        <Text
          style={[
            styles.h2,
            { fontSize: Math.round(styles.h2.fontSize * typeScale), color: brand },
          ]}
        >
          Venue & Map
        </Text>
        <Text style={[styles.p, { color: C.text }]}>{VENUE.name}</Text>
        <Text style={[styles.p, { marginBottom: 10, color: C.text }]}>{VENUE.address}</Text>

        {embedHtml ? (
          <View style={[styles.webWrap, { borderColor: C.border }]}>
            <WebView
              originWhitelist={['*']}
              source={{ html: embedHtml }}
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
              style={styles.web}
            />
          </View>
        ) : (
          <Text style={[styles.p, { color: C.text }]}>
            Add a Google Maps <Text style={styles.mono}>/maps/embed?pb=…</Text> URL to <Text style={styles.mono}>VENUE.embedUrl</Text>.
          </Text>
        )}

        <View style={styles.btnRow}>
          <Pressable style={[styles.mapBtn, { backgroundColor: brand }]} onPress={openMaps}>
            <Ionicons name="map" size={16} color="#fff" />
            <Text style={styles.mapBtnText}>Open in Google Maps</Text>
          </Pressable>

          <Pressable style={[styles.mapBtn, styles.secondaryBtn, { borderColor: brand }]} onPress={openDirections}>
            <Ionicons name="navigate" size={16} color={brand} />
            <Text style={[styles.mapBtnText, { color: brand }]}>Directions</Text>
          </Pressable>

          <Pressable style={[styles.mapBtn, styles.secondaryBtn, { borderColor: brand }]} onPress={() => setFsModal(true)}>
            <Ionicons name="expand" size={16} color={brand} />
            <Text style={[styles.mapBtnText, { color: brand }]}>Full screen</Text>
          </Pressable>
        </View>
      </View>

      {/* Full-screen embedded map modal */}
      <Modal visible={fsModal} animationType="slide" onRequestClose={() => setFsModal(false)}>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={styles.modalTopBar}>
            <Pressable onPress={() => setFsModal(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#fff" />
            </Pressable>
            <Text style={styles.modalTitle}>Map</Text>
            <View style={{ width: 40 }} />
          </View>
          {embedHtml ? (
            <WebView
              originWhitelist={['*']}
              source={{ html: embedHtml }}
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
              style={{ flex: 1 }}
            />
          ) : null}
        </View>
      </Modal>
    </ScrollView>
  );
}

const cardBase = {
  backgroundColor: '#fff',
  padding: 24,
  borderRadius: 14,
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
  maxWidth: 900,
  alignSelf: 'center',
  borderWidth: 1,
};

const styles = StyleSheet.create({
  page: { padding: 20 },

  card: { ...cardBase },
  sectionCard: { ...cardBase, marginTop: 16 },

  title: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  subtitle: { textAlign: 'center', marginBottom: 16 },
  section: { marginTop: 14 },
  h2: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  h3: { fontSize: 16, fontWeight: '800' },
  p: { lineHeight: 22, marginBottom: 6 },
  bold: { fontWeight: '700' },
  quote: { fontStyle: 'italic' },

  grid3: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  infoCard: {
    flexGrow: 1,
    minWidth: 100,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  infoStrong: { fontWeight: '900', fontSize: 18 },

  valuesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  valuePill: {
    backgroundColor: '#0E1525' + '00',
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  list: { marginTop: 6, marginLeft: 2 },
  li: { lineHeight: 22, marginBottom: 2, fontWeight: '700' },

  // WebView
  webWrap: { height: 240, borderRadius: 12, overflow: 'hidden', borderWidth: 1, marginBottom: 10 },
  web: { flex: 1 },

  // Buttons
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 6, flexWrap: 'wrap' },
  mapBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 10,
  },
  secondaryBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
  },
  mapBtnText: { color: '#fff', fontWeight: '800' },

  smallNote: { marginTop: 8, fontSize: 12 },
  mono: { fontFamily: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }) },

  // Modal
  modalTopBar: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10, backgroundColor: '#111' },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  modalTitle: { color: '#fff', fontWeight: '800' },

  // PlatAfrica additions
  plataLogoRow: { alignItems: 'center', marginBottom: 10 },
  plataHero: {
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
  },
  plataHeroImage: {
    borderRadius: 12, // ensures iOS respects rounding
  },
  plataHeroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)', // subtle dark veil for contrast
  },
});
