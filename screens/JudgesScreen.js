import React from 'react';
import { FlatList, View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Logo from '../components/Logo';
import { palette } from '../theme';

const JUDGES = [
  { name: 'Oliver Green', img: require('../assets/icon.png') },
  { name: 'Dave Newman', img: require('../assets/icon.png') },
  { name: 'Chris van Rensburg', img: require('../assets/icon.png') },
  { name: 'Lorna Lloyd', img: require('../assets/icon.png') },
  { name: 'Geraldine Fenn', img: require('../assets/icon.png') },
  { name: 'Joel Graham', img: require('../assets/icon.png') },
  { name: 'Bheki Ngema', img: require('../assets/icon.png') },
  { name: 'Lungile Xhwantini', img: require('../assets/icon.png') },
  { name: 'Tai Wong', img: require('../assets/icon.png') },
  { name: 'Josh Helmich', img: require('../assets/icon.png') },
];

const numColumns = 2;
const w = (Dimensions.get('window').width - 20 * (numColumns + 1)) / numColumns;

export default function JudgesScreen() {
  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.header}>
          <Logo />
          <Text style={styles.title}>Meet the Judges</Text>
          <Text style={styles.intro}>
            Our esteemed panel of judges
          </Text>
        </View>
      }
      contentContainerStyle={{ padding: 20, backgroundColor: palette.white }}
      data={JUDGES}
      keyExtractor={(item, idx) => item.name + idx}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={[styles.card, { width: w }]}>
          {item.img ? <Image source={item.img} style={styles.img} /> : null}
          <Text style={styles.h2}>{item.name}</Text>
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
    backgroundColor: '#fff', borderRadius: 12, padding: 16, margin: 10, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 1,
    borderWidth: 1, borderColor: '#e5e7eb',
  },
  img: {
    width: 150, height: 150, borderRadius: 75, marginBottom: 12, borderWidth: 4, borderColor: palette.valterraGreen, resizeMode: 'cover',
  },
  h2: { color: palette.valterraGreen, fontSize: 18, fontWeight: '800', marginBottom: 4, textAlign: 'center' },
  p: { color: palette.platinum, fontSize: 14, textAlign: 'center' },
});
