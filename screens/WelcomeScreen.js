// screens/WelcomeScreen.js
import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Logo from '../components/Logo';
import { palette } from '../theme';

export default function WelcomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      {/* Card 1 */}
      <View style={styles.card}>
        <Logo />
        <Text style={styles.title}>Welcome to Valterra Platinum</Text>
        <Text style={styles.subtitle}>(Previously known as Anglo American Platinum)</Text>

        <View style={styles.section}>
          <Text style={styles.h2}>Who We Are</Text>
          <Text style={styles.p}>
            A fully demerged leading platinum group metals (PGM) mining company with products that are
            essential ingredients in almost every aspect of modern life.
          </Text>
          <View style={styles.grid3}>
            <View style={styles.infoCard}>
              <Text style={styles.infoStrong}>29,000</Text>
              <Text>Employees globally</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoStrong}>$14.6 bn</Text>
              <Text>Free cash flow 2024</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoStrong}>$19.8 bn</Text>
              <Text>EBITDA 2024</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Our Products</Text>
          <Text style={styles.p}>
            <Text style={styles.bold}>Platinum Group Metals (PGMs):</Text> Platinum, Palladium, Rhodium,
            Ruthenium, Iridium, Osmium
          </Text>
          <Text style={styles.p}>
            <Text style={styles.bold}>Base Metals & Others:</Text> Copper, Nickel, Cobalt, Chrome, Sulphuric Acid
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Our Purpose</Text>
          <Text style={[styles.p, styles.quote]}>“Unearthing value to better our world”</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Our Values</Text>
          <View style={styles.valuesRow}>
            <Text style={styles.valuePill}>Keep it safe</Text>
            <Text style={styles.valuePill}>Own it</Text>
            <Text style={styles.valuePill}>Stand Together</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Where We Are</Text>
          <Text style={styles.p}>Headquarters: Rosebank, South Africa</Text>
          <Text style={styles.p}>Operations & Projects: Southern Africa</Text>
          <Text style={styles.p}>Listed on the Johannesburg & London Stock Exchanges</Text>
        </View>
      </View>

      {/* Card 2 (PlatAfrica) */}
      <View style={styles.sectionCard}>
        <Text style={styles.h2}>PlatAfrica</Text>
        <Text style={[styles.h3, { marginTop: 4 }]}>
          PlatAfrica: Elevating Platinum Jewellery Design in South Africa
        </Text>

        <Text style={styles.p}>
          PlatAfrica is South Africa’s premier platinum jewellery design and manufacturing competition, proudly
          hosted by Valterra Platinum Ltd in partnership with Metal Concentrators and The Platinum Guild
          International. Now in its 26th year, PlatAfrica has built a legacy of excellence through collaborations
          with leading industry players such as De Beers, Tracr, Original Luxury, and the TFG Group.
        </Text>

        <Text style={styles.p}>
          The competition is designed to address three key challenges facing the local jewellery industry:
        </Text>
        <View style={styles.list}>
          <Text style={styles.li}>1. Access to platinum metal</Text>
          <Text style={styles.li}>2. Skills development</Text>
          <Text style={styles.li}>3. Market access</Text>
        </View>

        <Text style={styles.p}>
          By offering a unique platform for emerging and established designers, PlatAfrica nurtures the craft of
          platinum smithing in South Africa. Through a metal consignment scheme, participants receive platinum at
          no cost or risk, enabling them to experiment, innovate, and refine their skills. This initiative unlocks
          creativity and builds capacity in both design and manufacturing.
        </Text>

        <Text style={styles.p}>
          Participants benefit not only from exposure but also from the opportunity to sell their creations both
          online and in-person, with 100% of the profits going directly to the designer. Unsold pieces are
          responsibly recycled, reinforcing a circular economy within the programme.
        </Text>

        <Text style={styles.p}>
          PlatAfrica showcases bold, statement and capsule platinum jewellery that resonates with both local and
          international audiences. The competition continues to evolve, embracing cutting-edge technologies such as
          digital product passports, capsule collections, and Inoveo—a proprietary AI-generated platinum alloy.
          These innovations position PlatAfrica as the first African luxury jewellery brand to integrate such
          advanced solutions, setting new global benchmarks.
        </Text>

        <Text style={styles.p}>
          This forward-thinking approach not only empowers designers but also propels the South African platinum
          jewellery industry onto the world stage, with PlatAfrica participants having been featured in Abu Dhabi,
          Hong Kong, and the prestigious Couture Show in Las Vegas.
        </Text>
      </View>
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
};

const styles = StyleSheet.create({
  page: { padding: 20, backgroundColor: palette.white },

  // Card 1
  card: { ...cardBase },

  // Card 2 (same style as card, with top margin)
  sectionCard: { ...cardBase, marginTop: 16 },

  title: { fontSize: 24, fontWeight: '800', color: palette.valterraGreen, textAlign: 'center' },
  subtitle: { textAlign: 'center', color: palette.platinum, marginBottom: 16 },
  section: { marginTop: 14 },
  h2: { fontSize: 18, color: palette.valterraGreen, fontWeight: '700', marginBottom: 8 },
  h3: { fontSize: 16, color: palette.platinumNavy, fontWeight: '800' },
  p: { color: palette.platinumNavy, lineHeight: 22, marginBottom: 6 },
  bold: { fontWeight: '700' },
  quote: { fontStyle: 'italic', color: palette.platinum },

  grid3: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  infoCard: {
    flexGrow: 1,
    minWidth: 100,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  infoStrong: { fontWeight: '900', fontSize: 18, color: palette.platinumNavy },

  valuesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  valuePill: {
    backgroundColor: '#0E1525' + '00',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    color: palette.platinumNavy,
  },

  // Simple list styling for the PlatAfrica card
  list: { marginTop: 6, marginLeft: 2 },
  li: { color: palette.platinumNavy, lineHeight: 22, marginBottom: 2, fontWeight: '700' },
});
