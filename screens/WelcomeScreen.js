// screens/WelcomeScreen.js
import React, { useState } from 'react';
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

// EDIT these with your venue + links
const VENUE = {
  name: 'Four Seasons Hotel The Westcliff',
  address: '67 Jan Smuts Ave, Westcliff, Johannesburg, South Africa',
  // Any Google Maps link (share link) works:
  mapsUrl: 'https://maps.app.goo.gl/your-short-link',
  // Street View link using Google Maps Pano:
  // https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=<lat>,<lng>&heading=180&pitch=0&fov=80
  streetViewUrl:
    'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=-26.17483,28.03067&heading=160&pitch=0&fov=80',
};

export default function WelcomeScreen() {
  const { typeScale, effectiveScheme, accent } = useSettings();
  const [svModal, setSvModal] = useState(false);

  const isDark = effectiveScheme === 'dark';
  const brand = accent === 'platafrica' ? palette.platinumNavy : palette.valterraGreen;
  const C = {
    bg: isDark ? '#0b1220' : palette.white,
    card: isDark ? '#111827' : '#fff',
    text: isDark ? '#e5e7eb' : palette.platinumNavy,
    muted: isDark ? '#94a3b8' : palette.platinum,
    border: isDark ? '#243244' : '#e5e7eb',
    chipBg: isDark ? '#1f2937' : '#f3f4f6',
  };

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
        <Text
          style={[
            styles.title,
            { fontSize: Math.round(styles.title.fontSize * typeScale), color: brand },
          ]}
        >
          Welcome to Valterra Platinum
        </Text>
        <Text style={[styles.subtitle, { color: C.muted }]}>(Previously known as Anglo American Platinum)</Text>

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
          <Text style={[styles.p, styles.quote, { color: C.muted }]}>“Unearthing value to better our world”</Text>
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

      {/* Card 3 (Venue & Street View) */}
      <View style={[styles.sectionCard, { backgroundColor: C.card, borderColor: C.border }]}>
        <Text
          style={[
            styles.h2,
            { fontSize: Math.round(styles.h2.fontSize * typeScale), color: brand },
          ]}
        >
          Venue & Street View
        </Text>
        <Text style={[styles.p, { color: C.text }]}>{VENUE.name}</Text>
        <Text style={[styles.p, { marginBottom: 10, color: C.text }]}>{VENUE.address}</Text>

        {/* Inline Street View */}
        {VENUE.streetViewUrl ? (
          <View style={[styles.webWrap, { borderColor: C.border }]}>
            <WebView
              source={{ uri: VENUE.streetViewUrl }}
              startInLoadingState
              style={styles.web}
              allowsFullscreenVideo
            />
          </View>
        ) : (
          <Text style={[styles.p, { color: C.text }]}>Paste a Street View URL.</Text>
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

          <Pressable style={[styles.mapBtn, styles.secondaryBtn, { borderColor: brand }]} onPress={() => setSvModal(true)}>
            <Ionicons name="expand" size={16} color={brand} />
            <Text style={[styles.mapBtnText, { color: brand }]}>Full screen</Text>
          </Pressable>
        </View>

        <Text style={[styles.smallNote, { color: C.muted }]}>
          Tip: you can use a Google Maps share link, or the API format with <Text style={styles.mono}>map_action=pano</Text>.
        </Text>
      </View>

      {/* Full-screen Street View modal */}
      <Modal visible={svModal} animationType="slide" onRequestClose={() => setSvModal(false)}>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={styles.modalTopBar}>
            <Pressable onPress={() => setSvModal(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color="#fff" />
            </Pressable>
            <Text style={styles.modalTitle}>Street View</Text>
            <View style={{ width: 40 }} />
          </View>
          {VENUE.streetViewUrl ? (
            <WebView source={{ uri: VENUE.streetViewUrl }} startInLoadingState style={{ flex: 1 }} />
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

  // Map buttons
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
});
