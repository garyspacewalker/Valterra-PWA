import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Logo from '../components/Logo';
import { palette } from '../theme';

const links = [
  { title: 'PlatAfrica Online Store', url: 'https://plat.africa/', desc: 'Shop the finest PlatAfrica has to offer.' },
  { title: 'Valterra Platinum', url: 'https://www.valterraplatinum.com/', desc: 'Discover Valterra Platinum’s official website.' },
  { title: 'PGM Market Development', url: 'https://www.valterraplatinum.com/products-services-and-development/pgm-market-development', desc: 'Learn more about our market development initiatives.' },
  { title: 'Jeweller Design & Innovation', url: 'https://www.example4.com', desc: 'Showcasing design and innovation at PlatAfrica.' },
];

export default function LinksScreen() {
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.card}>
        <Logo variant="platafrica" />
        <Text style={styles.h1}>Useful Resources</Text>

        <View style={styles.grid}>
          {links.map((l, idx) => (
            <TouchableOpacity key={idx} style={styles.linkCard} onPress={() => Linking.openURL(l.url)}>
              <Text style={styles.linkTitle}>{l.title}</Text>
              <Text style={styles.linkDesc}>{l.desc}</Text>
            </TouchableOpacity>
          ))}
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
    maxWidth: 1000, alignSelf: 'center',
  },
  h1: { fontSize: 24, color: palette.platinumNavy, textAlign: 'center', marginBottom: 16, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, justifyContent: 'center' },
  linkCard: {
    width: '100%', maxWidth: 300, backgroundColor: '#fff', borderRadius: 12, padding: 20,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 1,
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  linkTitle: { color: palette.valterraGreen, fontWeight: '800', fontSize: 18, marginBottom: 8, textAlign: 'center' },
  linkDesc: { color: palette.platinumNavy, fontSize: 14, textAlign: 'center' },
});
