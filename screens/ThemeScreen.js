import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Logo from '../components/Logo';
import { palette } from '../theme';

export default function ThemeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.card}>
        <Logo />
        <View style={styles.banner}>
          <Text style={styles.bannerH1}>2025 Theme: "New Horizon"</Text>
          <Text style={styles.bannerP}>
            In dawning glow, where dreams take flight, Designs emerge from the first of light.
            New forms, new fashions, new meanings, The future of jewellery, new beginnings.
          </Text>
          <Text style={styles.bannerP}>
            Horizon’s promise shine far and bright, A canvas of future in platinum white. Through artistry’s lens, we
            boldly go, Crafting value for a better world.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>About This Year’s Theme</Text>
          <Text style={styles.p}>
            The term <Text style={styles.bold}>“horizon”</Text> symbolizes looking towards the future. Designers might explore
            emerging trends, materials, or technologies that could shape the future of jewellery. <Text style={styles.bold}>“New”</Text> – fresh, original or unique.
          </Text>
          <Text style={styles.p}>
            <Text style={styles.bold}>New Horizon</Text> encourages participants to push boundaries and think outside traditional norms…
          </Text>
          <Text style={styles.p}>
            A focus on sustainability and ethical sourcing may also align with this theme…
          </Text>
          <Text style={styles.p}>
            <Text style={styles.bold}>New Horizon</Text> symbolizes new beginnings and opportunities…
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.h2}>Platinum is:</Text>
          <View style={styles.cardList}>
            <Text style={styles.valueCard}>ENDURING — Tenacious and tough, perfect witness to true love.</Text>
            <Text style={styles.valueCard}>TIMELESS — Does not fade or corrode; perfect for heirlooms.</Text>
            <Text style={styles.valueCard}>NATURALLY WHITE — The best security for your diamonds.</Text>
            <Text style={styles.valueCard}>THE METAL OF TRUTH — 950 purity symbolises integrity.</Text>
          </View>
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
  banner: {
    backgroundColor: palette.valterraGreen,
    padding: 20, borderRadius: 14, marginBottom: 16,
  },
  bannerH1: { color: '#fff', fontSize: 22, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  bannerP: { color: '#fff', marginBottom: 8, textAlign: 'center' },
  section: { marginTop: 10 },
  h2: { fontSize: 18, color: palette.valterraGreen, fontWeight: '700', marginBottom: 8 },
  p: { color: palette.platinumNavy, marginBottom: 6, lineHeight: 22 },
  bold: { fontWeight: '700' },
  cardList: { gap: 10 },
  valueCard: { backgroundColor: '#f0fdf4', borderColor: '#d1d5db', borderWidth: 1, borderRadius: 10, padding: 12, color: palette.platinumNavy },
});
