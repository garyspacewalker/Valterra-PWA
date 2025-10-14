// screens/LinksScreen.js
import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Logo from '../components/Logo';
import { palette } from '../theme';
import { useSettings } from '../context/SettingsContext';

const links = [
  { title: 'PlatAfrica Online Store', url: 'https://plat.africa/', desc: 'Shop the finest PlatAfrica has to offer.' },
  { title: 'Valterra Platinum', url: 'https://www.valterraplatinum.com/', desc: 'Discover Valterra Platinum’s official website.' },
  { title: 'PGM Market Development', url: 'https://www.valterraplatinum.com/products-services-and-development/pgm-market-development', desc: 'Learn more about our market development initiatives.' },
  { title: 'Jeweller Design & Innovation', url: 'https://www.example4.com', desc: 'Showcasing design and innovation at PlatAfrica.' },
];

export default function LinksScreen() {
  const { typeScale, effectiveScheme, accent } = useSettings();

  const isDark = effectiveScheme === 'dark';
  const brand = accent === 'platafrica' ? palette.platinumNavy : palette.valterraGreen;
  const C = {
    bg: isDark ? '#0b1220' : palette.white,
    card: isDark ? '#111827' : '#fff',
    text: isDark ? '#e5e7eb' : palette.platinumNavy,
    muted: isDark ? '#94a3b8' : palette.platinum,
    border: isDark ? '#243244' : '#e5e7eb',
  };

  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: C.bg }]}>
      <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
        <Logo variant="platafrica" />
        <Text
          style={[
            styles.h1,
            { fontSize: Math.round(styles.h1.fontSize * typeScale), color: C.text }
          ]}
        >
          Useful Resources
        </Text>

        <View style={styles.grid}>
          {links.map((l, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.linkCard, { backgroundColor: C.card, borderColor: C.border }]}
              onPress={() => Linking.openURL(l.url)}
            >
              <Text style={[styles.linkTitle, { color: brand }]}>{l.title}</Text>
              <Text style={[styles.linkDesc, { color: C.text }]}>{l.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20 },
  card: {
    padding: 24, borderRadius: 14,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2,
    maxWidth: 1000, alignSelf: 'center',
    borderWidth: 1,
  },
  h1: { fontSize: 24, textAlign: 'center', marginBottom: 16, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'center' },
  linkCard: {
    width: '100%', maxWidth: 300, borderRadius: 12, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 1,
    borderWidth: 1,
  },
  linkTitle: { fontWeight: '800', fontSize: 18, marginBottom: 8, textAlign: 'center' },
  linkDesc: { fontSize: 14, textAlign: 'center' },
});
