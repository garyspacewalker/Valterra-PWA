import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Logo from '../components/Logo';
import { palette } from '../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={styles.page}>
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
            <View style={styles.infoCard}><Text style={styles.infoStrong}>29,000</Text><Text>Employees globally</Text></View>
            <View style={styles.infoCard}><Text style={styles.infoStrong}>$14.6 bn</Text><Text>Free cash flow 2024</Text></View>
            <View style={styles.infoCard}><Text style={styles.infoStrong}>$19.8 bn</Text><Text>EBITDA 2024</Text></View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Our Products</Text>
          <Text style={styles.p}><Text style={styles.bold}>Platinum Group Metals (PGMs):</Text> Platinum, Palladium, Rhodium, Ruthenium, Iridium, Osmium</Text>
          <Text style={styles.p}><Text style={styles.bold}>Base Metals & Others:</Text> Copper, Nickel, Cobalt, Chrome, Sulphuric Acid</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, backgroundColor: palette.white },
  card: {
    backgroundColor: '#fff', padding: 24, borderRadius: 14,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2,
    maxWidth: 900, alignSelf: 'center',
  },
  title: { fontSize: 24, fontWeight: '800', color: palette.valterraGreen, textAlign: 'center' },
  subtitle: { textAlign: 'center', color: palette.platinum, marginBottom: 16 },
  section: { marginTop: 14 },
  h2: { fontSize: 18, color: palette.valterraGreen, fontWeight: '700', marginBottom: 8 },
  p: { color: palette.platinumNavy, lineHeight: 22, marginBottom: 6 },
  bold: { fontWeight: '700' },
  quote: { fontStyle: 'italic', color: palette.platinum },
  grid3: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  infoCard: { flexGrow: 1, minWidth: 100, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 10, padding: 12, alignItems: 'center' },
  infoStrong: { fontWeight: '900', fontSize: 18, color: palette.platinumNavy },
  valuesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  valuePill: { backgroundColor: '#0E1525' + '00', borderWidth: 1, borderColor: '#d1d5db', borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12, color: palette.platinumNavy },
});
