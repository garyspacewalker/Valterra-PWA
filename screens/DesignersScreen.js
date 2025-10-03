// screens/DesignersScreen.js
import React from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Logo from '../components/Logo';
import { palette } from '../theme';



// Use an existing, valid image as a fallback
const PLACEHOLDER = require('../assets/icon.png');

const ENTRIES = [
  {
    entryNo: 76,
    name: 'Ronel Jordaan',
    institution: 'Cape Peninsula University of Technology',
    type: 'Armpiece - Bangle',           // e.g., "Ring", "Necklace", "Bracelet"
    title: 'Resonance',
    img: require('../assets/designers/entry76.png'),          // e.g., entry01 OR 'https://...' OR leave null for placeholder
  },
  {
    entryNo: 75,
    name: 'Osmond Davies',
    institution: 'Cape Peninsula University of Technology',
    type: 'Neckpiece',
    title: 'African Nights',
    img: require('../assets/designers/entry75.png'),
  },
  { entryNo: 71, name: 'Milodri Dickens', institution: 'Van Deijl Jewellery', type: 'Earrings', title: 'Drops of Grace', img: require('../assets/designers/entry71.png'), },
  { entryNo: 67, name: 'Tanja du Plessis', institution: 'Tangerine Jewellery', type: 'Neckpiece', title: 'Catalyst Continuum', img: require('../assets/designers/entry67.png'), },
  { entryNo: 19, name: 'Vuyisani Mavengna', institution: 'Bellagio Jewellers', type: 'Brooch', title: 'Vuyisanani', img: require('../assets/designers/entry19.png'), },
  { entryNo: 8, name: 'Esther Boshoff & Team', institution: 'Beaudell Design pty ltd', type: 'Neckpiece', title: 'Heritage of Elegance: Grid of Eternity', img: require('../assets/designers/entry8.png'), },
  { entryNo: 17, name: 'Heidi Marais', institution: 'Soul Inspiration', type: 'Ring - Dress', title: 'Shine Africa, Shine', img: require('../assets/designers/entry17.png'), },
  { entryNo: 81, name: 'Nihal Shah', institution: 'Vijay Shah Concepts', type: 'Neckpiece', title: 'Sfera Fusa - Molten Sphere', img: require('../assets/designers/entry81.png'),},
  { entryNo: 41, name: 'Koketso Mohlala', institution: 'The Platinum Incubator', type: 'Neckpiece', title: 'Kganya (Light)', img: require('../assets/designers/entry41.png'), },
  { entryNo: 69, name: 'Ulandie Booysens', institution: 'Van Deijl Jewellery', type: 'Neckpiece', title: 'Echoes of Africa', img: require('../assets/designers/entry69.png'), },
  { entryNo: 70, name: 'Kim Nel', institution: 'Van Deijl Jewellery', type: 'Neckpiece', title: 'Eternal Oasis', img: require('../assets/designers/entry70.png'), },
  { entryNo: 91, name: 'Vuyani Gumede', institution: 'Prins and Prins Diamonds / Aurum Art Pty Ltd', type: 'Ring ', title: 'The Platinum Centenary Ring', img: require('../assets/designers/entry91.png'), },
  { entryNo: 142, name: 'Mongameli Obed Thafeni', institution: 'Cape Peninsula University of Technology', type: 'Neckpiece - Pendant', title: 'Vigour', img: require('../assets/designers/entry142.png'), },
  { entryNo: 61, name: 'Emmah Mahlatsi', institution: 'The Platinum Incubator', type: 'Earrings', title: 'Mokorotlo', img: require('../assets/designers/entry61.png'), },
  { entryNo: 64, name: 'Ndzalama Timbane', institution: 'The Platinum Incubator', type: 'Neckpiece - Pendant', title: 'Miners Reminder', img: require('../assets/designers/entry64.png'), },
  { entryNo: 141, name: 'Julia Sithole', institution: 'Cape Peninsula University of Technology', type: 'Ring', title: 'Harmony', img: require('../assets/designers/entry141.png'), },
  { entryNo: 143, name: 'Ameer Toefy', institution: 'Cape Peninsula University of Technology', type: 'Neckpiece - Pendant', title: 'Peace de Resistance', img: require('../assets/designers/entry143.png'), },
  { entryNo: 56, name: 'Thabisile Nkosi', institution: 'The Platinum Incubator', type: 'Ring', title: 'Intuthuko', img: require('../assets/designers/entry56.png'), },
  { entryNo: 59, name: 'Elena Masinga', institution: 'The Platinum Incubator', type: 'Armpiece - Bracelet', title: 'Pescher Bracelet', img: require('../assets/designers/entry59.png'), },
  { entryNo: 85, name: 'Lebogang Ledwaba', institution: 'Mmako Designs (PTY) LTD', type: 'Neckpiece - Pendant / Ring', title: 'Gods Gift', img: require('../assets/designers/entry85.png'), },
  { entryNo: 12, name: 'Bongumenzi Wenzile Nguse', institution: 'Pneuma Jewellers', type: 'Neckpiece', title: 'The infinity of Bagger 293', img: require('../assets/designers/entry12.png'), },
  { entryNo: 72, name: 'Kwanele Mbatha', institution: 'Durban University of Technology', type: 'Neckpiece', title: 'Blossming', img: require('../assets/designers/entry72.png'), },
];

export default function DesignersScreen() {
  const { width } = useWindowDimensions();
  const numColumns = width < 700 ? 1 : 2;

  const renderItem = ({ item }) => {
    // Accept local module (number), remote url (string), or null (placeholder)
    let source = PLACEHOLDER;
    if (typeof item.img === 'number') {
      source = item.img;
    } else if (typeof item.img === 'string') {
      source = { uri: item.img };
    }

    return (
      <View style={[styles.card, numColumns === 1 ? styles.cardFull : styles.cardHalf]}>
        <Image source={source} style={styles.image} />
        <View style={styles.meta}>
          <Text style={styles.entryNo}>Entry #{item.entryNo}</Text>
          <Text style={styles.title}>{item.title || '—'}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Name: </Text>
            <Text style={styles.value}>{item.name || '—'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Institution/Company: </Text>
            <Text style={styles.value}>{item.institution || '—'}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Type of jewellery: </Text>
            <Text style={styles.value}>{item.type || '—'}</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      ListHeaderComponent={
        <View style={styles.header}>
          <Logo />
          <Text style={styles.pageTitle}>2025 Entries — Designers</Text>
          <Text style={styles.pageIntro}>
            The following are the PlatAfrica Top 10 designer pieces
          </Text>
        </View>
      }
      data={ENTRIES}
      keyExtractor={(item) => `entry-${item.entryNo}`}
      numColumns={numColumns}
      columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between' } : undefined}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

const cardShadow = {
  shadowColor: '#000',
  shadowOpacity: 0.08,
  shadowRadius: 12,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

const styles = StyleSheet.create({
  list: {
    padding: 20,
    backgroundColor: palette.white,
  },

  header: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 14,
    marginBottom: 16,
    ...cardShadow,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: palette.platinumNavy,
    textAlign: 'center',
  },
  pageIntro: {
    marginTop: 8,
    color: palette.platinumNavy,
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...cardShadow,
  },
  cardFull: { width: '100%' },
  cardHalf: { width: '48%' },

  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'cover',
  },

  meta: { gap: 4 },
  entryNo: { color: palette.platinum, fontWeight: '700', marginBottom: 2 },
  title: { color: palette.valterraGreen, fontWeight: '900', fontSize: 16, marginBottom: 8 },

  row: { flexDirection: 'row', marginTop: 4, flexWrap: 'wrap' },
  label: { color: palette.platinumNavy, fontWeight: '700' },
  value: { color: palette.platinumNavy, flexShrink: 1 },
});
