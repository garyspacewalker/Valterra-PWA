// screens/JudgesScreen.js
import React from 'react';
import { FlatList, View, Text, Image, StyleSheet, Dimensions, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Logo from '../components/Logo';
import { palette } from '../theme';

const PLACEHOLDER = require('../assets/icon.png');

// 👉 Replace each img with your real file when it's in assets/judges/
// e.g. img: require('../assets/judges/oliver_green.png')
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

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.header}>
          <Logo variant="platafrica" />
          <Text style={styles.title}>Meet the Judges</Text>
          <Text style={styles.intro}>Our esteemed panel of judges</Text>
        </View>
      }
      contentContainerStyle={{ padding: 20, backgroundColor: palette.white }}
      data={JUDGES}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={[styles.card, { width: w }]}>
          <Pressable
            onPress={() =>
              navigation.navigate('JudgeDetail', {
                id: item.id,
                name: item.name,
                // Pass the require/module id or undefined; the detail screen will fallback safely
                img: item.img,
              })
            }
          >
            {item.img ? <Image source={item.img} style={styles.img} /> : null}
          </Pressable>
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
