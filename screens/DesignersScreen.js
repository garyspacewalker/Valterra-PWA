import React from 'react';
import { FlatList, View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Logo from '../components/Logo';
import { palette } from '../theme';

const DATA = [
  { name: 'Designer Name 1', img: require('../assets/icon.png'), bio: 'Known for blending tradition with modern aesthetics, creating timeless and innovative pieces.' },
  { name: 'Designer Name 2', img: require('../assets/icon.png'), bio: 'Inspirations and contributions to the field. Replace this with real content.' },
  { name: 'Designer Name 3', img: require('../assets/icon.png'), bio: 'Short description of the designer’s philosophy or notable works.' },
  // add up to 10 as needed
];

const numColumns = 2;
const w = (Dimensions.get('window').width - 20 * (numColumns + 1)) / numColumns;

export default function DesignersScreen() {
  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.header}>
          <Logo />
          <Text style={styles.title}>Top 10 Designers & Inspirations</Text>
          <Text style={styles.intro}>
            Explore creativity, innovation, and unique perspectives. Each profile includes a short bio, design
            philosophy, and visual inspirations.
          </Text>
        </View>
      }
      contentContainerStyle={{ padding: 20, backgroundColor: palette.white }}
      data={DATA}
      keyExtractor={(item, idx) => item.name + idx}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={[styles.card, { width: w }]}>
          {item.img ? <Image source={item.img} style={styles.img} /> : null}
          <Text style={styles.h2}>{item.name}</Text>
          <Text style={styles.p}>{item.bio}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff', padding: 24, borderRadius: 14, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  title: { fontSize: 22, fontWeight: '800', color: palette.platinumNavy, textAlign: 'center' },
  intro: { color: palette.platinumNavy, textAlign: 'center', marginTop: 8 },
  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, margin: 10,
    alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 1,
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  img: { width: 150, height: 150, borderRadius: 12, marginBottom: 10, resizeMode: 'cover' },
  h2: { color: palette.valterraGreen, fontSize: 18, fontWeight: '800', marginBottom: 6, textAlign: 'center' },
  p: { color: palette.platinum, fontSize: 14, textAlign: 'center' },
});
