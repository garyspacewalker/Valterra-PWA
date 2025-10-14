// screens/JudgesScreen.js
import React from 'react';
import { FlatList, View, Text, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../components/Logo';
import { palette } from '../theme';
import { useSettings } from '../context/SettingsContext';

const PLACEHOLDER = require('../assets/icon.png');

const JUDGES = [
  { id: 'oliver-green',        name: 'Oliver Green',        img: require('../assets/judges/oliver-green-5.jpg') },
  { id: 'dave-newman',         name: 'Dave Newman',         img: require('../assets/judges/dave-newman-6.jpg') },
  { id: 'chris-van-rensburg',  name: 'Chris van Rensburg',  img: require('../assets/judges/chris-v-r-2.jpg') },
  { id: 'lorna-lloyd',         name: 'Lorna Lloyd',         img: require('../assets/judges/lorna-lloyd-6.jpg') },
  { id: 'geraldine-fenn',      name: 'Geraldine Fenn',      img: require('../assets/judges/geraldine-fenn-6.jpg') },
  { id: 'joel-graham',         name: 'Joel Graham',         img: require('../assets/judges/joel-graham-5.jpg') },
  { id: 'bheki-ngema',         name: 'Bheki Ngema',         img: require('../assets/judges/bheki-ngema-7.jpg') },
  { id: 'lungile-xhwantini',   name: 'Lungile Xhwantini',   img: require('../assets/judges/lungilexhwantini-4.jpg') },
  { id: 'tai-wong',            name: 'Tai Wong',            img: require('../assets/judges/tai-wong-3.jpg') },
  { id: 'josh-helmich',        name: 'Josh Helmich',        img: require('../assets/judges/josh-helmich-5.jpg') },
];

const numColumns = 2;
const w = (Dimensions.get('window').width - 20 * (numColumns + 1)) / numColumns;

export default function JudgesScreen() {
  const navigation = useNavigation();
  const { typeScale, effectiveScheme, accent } = useSettings();

  const isDark = effectiveScheme === 'dark';
  const brand = accent === 'platafrica' ? palette.platinumNavy : palette.valterraGreen;
  const C = {
    bg: isDark ? '#0b1220' : palette.white,
    card: isDark ? '#111827' : '#fff',
    text: isDark ? '#e5e7eb' : palette.platinumNavy,
    muted: isDark ? '#94a3b8' : palette.platinumNavy,
    border: isDark ? '#243244' : '#e5e7eb',
  };

  return (
    <FlatList
      ListHeaderComponent={
        <View style={[styles.header, { backgroundColor: C.card, borderColor: C.border }]}>
          <Logo variant="platafrica" />
          <Text
            style={[
              styles.title,
              { fontSize: Math.round(styles.title.fontSize * typeScale), color: C.text }
            ]}
          >
            Meet the Judges
          </Text>
          <Text style={[styles.intro, { color: C.muted }]}>Our esteemed panel of judges</Text>
        </View>
      }
      contentContainerStyle={{ padding: 20, backgroundColor: C.bg }}
      data={JUDGES}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={[styles.card, { width: w, backgroundColor: C.card, borderColor: C.border }]}>
          <Pressable
            onPress={() =>
              navigation.navigate('JudgeDetail', {
                id: item.id,
                name: item.name,
                img: item.img,
              })
            }
          >
            {item.img ? <Image source={item.img} style={[styles.img, { borderColor: brand }]} /> : <Image source={PLACEHOLDER} style={[styles.img, { borderColor: brand }]} />}
          </Pressable>
          <Text
            style={[
              styles.h2,
              { fontSize: Math.round(styles.h2.fontSize * typeScale), color: brand }
            ]}
          >
            {item.name}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 24, borderRadius: 14, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2,
    borderWidth: 1,
  },
  title: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  intro: { textAlign: 'center', marginTop: 8 },
  card: {
    borderRadius: 12, padding: 16, margin: 10, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 1,
    borderWidth: 1,
  },
  img: {
    width: 150, height: 150, borderRadius: 75, marginBottom: 12, borderWidth: 4, resizeMode: 'cover',
  },
  h2: { fontSize: 18, fontWeight: '800', marginBottom: 4, textAlign: 'center' },
  p: { fontSize: 14, textAlign: 'center' },
});
