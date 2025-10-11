// screens/DesignersScreen.js
import React, { useMemo, useState, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Logo from '../components/Logo';
import { palette } from '../theme';

// Fallback image if an entry image is missing
const PLACEHOLDER = require('../assets/icon.png');

// Category labels
const CAT_LABEL = { P: 'Professional', S: 'Student', A: 'Apprentice' };
const CAT_ORDER = ['P', 'S', 'A'];

/**
 * DATA STRUCTURES USED
 * - ENTRIES: Array<Entry> (29 entries)
 * - institutionIndex: Map<string, Array<Entry>> (grouping)
 * - favorites: Set<number> (entryNo set)
 *
 * SEARCH
 * - If query is numeric -> binarySearchEntry(sortedByEntryNo, n) O(log n)
 * - Else -> case-insensitive substring filter over multiple fields O(n)
 */

// ---------- YOUR 29 ENTRIES (edit/fill these) ----------
/**
 * Entry shape:
 * {
 *   category: 'P' | 'S' | 'A',
 *   entryNo: number,
 *   name: string,
 *   title: string,
 *   institution: string,
 *   type: string,
 *   img: require('../assets/designers/entryXX.png') | 'https://...' | null
 * }
 */
const ENTRIES = [
  // --- Existing provided entries (category defaulted to 'P' - change as needed) ---
  { category: 'P', entryNo: 66, name: 'Emile Pitout, Lorin Bohm and Rob Burton', institution: 'Platandia Jewellery Collection', type: 'Neckpiece', title: 'Eclipse', img: require('../assets/designers/P66-Professional-NECKPIECE-PBBB0830-1.jpg') },
  { category: 'P', entryNo:  2, name: 'Nihal Shah', institution: 'Vijay Shah Concepts', type: 'Ring', title: 'Stratos', img: require('../assets/designers/P2-Professional-RING-PBBB0988.jpg') },
  { category: 'P', entryNo:  4, name: 'Esther Boshoff & Team', institution: 'Beaudell Designs', type: 'Armpiece', title: 'The Golden Ratio', img: require('../assets/designers/P4-Professional-ARMPIECE-PBBB0905-1.jpg') },
  { category: 'P', entryNo: 64, name: 'Ann ten Cate', institution: 'Mark Solomon Jewellers', type: 'Earrings', title: 'As I Grow', img: require('../assets/designers/P64-Professional-EARRINGS-PBBB0919-1.jpg') },
  { category: 'P', entryNo:  3, name: 'Vijay Shah', institution: 'Vijay Shah Concepts', type: 'Armpiece', title: 'Synergy', img: require('../assets/designers/P3-Professional-ARMPIECE-PBBB0896.jpg') },
  { category: 'P', entryNo: 29, name: 'Mercia Beukes', institution: 'Aurum', type: 'Neckpiece', title: 'Sprouting in Space', img: require('../assets/designers/P29-Professional-NECKPIECE-PBBB0817.jpg') },
  { category: 'P', entryNo: 43, name: 'Manuel Mpho Helepi', institution: 'MMH Jwellers cc', type: 'Armpiece', title: 'Mystic', img: require('../assets/designers/P43-Professional-ARMPIECE-PBBB0891.jpg') },
  { category: 'P', entryNo: 59, name: 'Ronel Jordaan', institution: 'Cape Peninsula University of Technology', type: 'Armpiece', title: 'The interference', img: require('../assets/designers/P59-Professional-ARMPIECE-PBBB0902.jpg') },
  { category: 'P', entryNo: 63, name: 'Aimee Bredenkamp', institution: 'Mark Solomon Jewellers', type: 'Neckpiece', title: 'African Reflections', img: require('../assets/designers/P63-Professional-NECKPIECE-PBBB0825.jpg') },
  { category: 'P', entryNo: 65, name: 'Taryn Ann Bilson', institution: 'Mark Solomon Jewellers', type: 'Ring', title: 'Khanyisa', img: require('../assets/designers/P65-Professional-RING-PBBB0980.jpg') },
  { category: 'P', entryNo: 69, name: 'Riefqah Davis', institution: 'Free Range Jewels', type: 'Earrings', title: 'Oda Dal Agua', img: require('../assets/designers/P69-Professional-EARRINGS-PBBB0909.jpg') },
  { category: 'P', entryNo: 32, name: 'Bongumusa Mtshali', institution: 'The Jewellery Hub', type: 'Neckpiece', title: 'Le Coq Panache (Rooster of elegance)', img: require('../assets/designers/P32-Professional-NECKPIECE-PBBB0804.jpg') },
  { category: 'P', entryNo: 11, name: 'Tshepo Makhetha', institution: 'Bakoenas fashion jewellery', type: 'Armpiece', title: 'A journey of resilience and reward', img: require('../assets/designers/P11-Professional-ARMPIECE-PBBB0885.jpg') },
  { category: 'P', entryNo: 38, name: 'Gabriele Lourens', institution: 'Durban University of Technology', type: 'Armpiece', title: 'Naya', img: require('../assets/designers/P38-Professional-ARMPIECE-PBBB0879.jpg') },
  { category: 'P', entryNo: 60, name: 'Osmond Davies', institution: 'CPUT/Osmond’s Handcrafted Jewellery', type: 'Neckpiece', title: 'Art is in our DNA', img: require('../assets/designers/P60-Professional-NECKPIECE-PBBB0812.jpg') },
  { category: 'S', entryNo: 89, name: 'Seinoli Valentine Maketela', institution: 'Pneuma Jewellers', type: 'Ring', title: 'Mpho Ya Naha', img: require('../assets/designers/S89-Student-RING-PBBB1010.jpg') },
  { category: 'S', entryNo: 142, name: 'Nolwazi Linda', institution: 'Cape Peninsula University of Technology', type: 'Ring', title: 'Sculptural', img: require('../assets/designers/S142-Student-RING-PBBB0998.jpg') },
  { category: 'S', entryNo: 148, name: 'Siyabonga Retshe', institution: 'Cape Peninsula University of Technology', type: 'Ring', title: 'Split personality', img: require('../assets/designers/S148-Student-RING-PBBB1003.jpg') },
  { category: 'S', entryNo: 128, name: 'Peter-Ivan Mitrovich', institution: 'Stellenbosch University', type: 'Pendant', title: 'Bloom', img: require('../assets/designers/S128-Student-PENDANT-PBBB0870.jpg') },
  { category: 'S', entryNo: 162, name: 'Jana Basson', institution: 'Free Range Jewels', type: 'Pendant', title: 'Perspective', img: require('../assets/designers/S162-Student-PENDANT-PBBB0838.jpg') },
  { category: 'S', entryNo: 106, name: 'Tshepo Sethosa', institution: 'Sivana Diamonds', type: 'Earrings', title: 'Viol', img: require('../assets/designers/S106-Student-EARRINGS-PBBB0969.jpg') },
  { category: 'S', entryNo: 85, name: 'Phineas Gumede', institution: 'Pneuma Jewellers', type: 'Pendant', title: 'Utshani "the grace"', img: require('../assets/designers/S85-Student-PENDANT-PBBB0863.jpg') },
  { category: 'S', entryNo: 151, name: 'Kelebogile Seleka', title: 'Blou-Arch', institution: 'Cape Peninsula University of Technology', type: 'Earrings', img: require('../assets/designers/S151-Student-EARRINGS-PBBB0978.jpg') },
  { category: 'S', entryNo: 152, name: 'Njabulo Khuzwayo', title: 'NovaDrop', institution: 'Cape Peninsula University of Technology', type: 'Earrings', img: require('../assets/designers/S152-Student-EARRINGS-PBBB0972.jpg') },
  { category: 'S', entryNo: 153, name: 'Siphe Demeshile', title: 'Echo Waves', institution: 'Cape Peninsula University of Technology', type: 'Earrings', img: require('../assets/designers/S153-Student-EARRINGS-PBBB0940.jpg') },
  { category: 'S', entryNo: 155, name: 'Wesley Fransman', title: 'Spinal  Journey', institution: 'Cape Peninsula University of Technology', type: '', img: null },
  { category: 'S', entryNo: 161, name: 'Simone Langeveldt', title: 'The Muitiple Appearance', institution: 'Free Range Jewels', type: '', img: null },
  { category: 'S', entryNo: 67, name: 'Lwandile Sibiya', title: 'Afro-Deco', institution: 'Durban University of Technology', type: '', img: null },
  { category: 'S', entryNo: 88, name: 'Sibusisiwe Mtshali', title: 'Nomkhubulwana / Goddess of Prosperity in Zulu cosmology', institution: 'Pneuma Jewellers', type: '', img: null },
];

// ---------- Binary search over sorted entry numbers ----------
function binarySearchEntry(sortedArray, targetNo) {
  let lo = 0, hi = sortedArray.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const v = sortedArray[mid].entryNo;
    if (v === targetNo) return sortedArray[mid];
    if (v < targetNo) lo = mid + 1; else hi = mid - 1;
  }
  return null;
}

export default function DesignersScreen() {
  const { width } = useWindowDimensions();
  const twoCols = width >= 700;

  // ----- Derived indexes -----
  const sortedByEntryNo = useMemo(() => [...ENTRIES].sort((a, b) => a.entryNo - b.entryNo), []);
  const institutionIndex = useMemo(() => {
    const map = new Map();
    for (const e of ENTRIES) {
      const key = (e.institution || 'Unspecified').trim();
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    }
    return map;
  }, []);
  const institutions = useMemo(() => [...institutionIndex.keys()], [institutionIndex]);

  const categoryCounts = useMemo(() => {
    const c = { P: 0, S: 0, A: 0 };
    for (const e of ENTRIES) if (c[e.category] !== undefined) c[e.category]++;
    return c;
  }, []);

  // ----- UI state -----
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All'); // 'All' | 'P' | 'S' | 'A'
  const [institutionFilter, setInstitutionFilter] = useState('All');
  const [sortBy, setSortBy] = useState('entry'); // 'entry' | 'name' | 'title' | 'category'
  const [favorites, setFavorites] = useState(new Set()); // Set<number>
  const [showFavesOnly, setShowFavesOnly] = useState(false);
  const [preview, setPreview] = useState(null);

  const toggleFavorite = useCallback((no) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(no) ? next.delete(no) : next.add(no);
      return next;
    });
  }, []);

  // ----- Filter + Search + Sort pipeline -----
  const visible = useMemo(() => {
    let list = ENTRIES;

    // Search
    const q = query.trim();
    if (q.length) {
      const isNumber = /^\d+$/.test(q);
      if (isNumber) {
        const found = binarySearchEntry(sortedByEntryNo, Number(q));
        list = found ? [found] : [];
      } else {
        const needle = q.toLowerCase();
        list = ENTRIES.filter(e => {
          const fields = [
            e.name || '',
            e.title || '',
            e.type || '',
            e.institution || '',
            e.category || '',
          ].join(' ').toLowerCase();
          return fields.includes(needle);
        });
      }
    }

    // Category filter
    if (categoryFilter !== 'All') {
      list = list.filter(e => e.category === categoryFilter);
    }

    // Institution filter (using index, but intersection with current list)
    if (institutionFilter !== 'All') {
      const pool = institutionIndex.get(institutionFilter) || [];
      list = pool.filter(e => list.includes(e));
    }

    // Favourites
    if (showFavesOnly) {
      list = list.filter(e => favorites.has(e.entryNo));
    }

    // Sort
    list = [...list];
    if (sortBy === 'name') list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    else if (sortBy === 'title') list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    else if (sortBy === 'category') {
      list.sort((a, b) => CAT_ORDER.indexOf(a.category) - CAT_ORDER.indexOf(b.category) || a.entryNo - b.entryNo);
    } else list.sort((a, b) => a.entryNo - b.entryNo);

    return list;
  }, [query, categoryFilter, institutionFilter, showFavesOnly, sortBy, favorites, institutionIndex, sortedByEntryNo]);

  // Resolve image source (accept local require, url string, or null)
  const imgSource = (img) => {
    if (typeof img === 'number') return img;
    if (typeof img === 'string') return { uri: img };
    return PLACEHOLDER;
  };

  const renderItem = ({ item }) => {
    const fav = favorites.has(item.entryNo);
    return (
      <Pressable onPress={() => setPreview(item)} style={[styles.card, twoCols ? styles.cardHalf : styles.cardFull]}>
        <Image source={imgSource(item.img)} style={styles.image} />

        {/* Category badge */}
        <View style={[styles.badge, styles[`badge_${item.category}`]]}>
          <Text style={styles.badgeText}>{item.category}</Text>
        </View>

        {/* Favourite toggle */}
        <Pressable onPress={() => toggleFavorite(item.entryNo)} style={styles.favBtn} hitSlop={12}>
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? '#ef4444' : palette.platinum} />
        </Pressable>

        <View style={styles.meta}>
          <Text style={styles.entryNo}>Entry #{item.entryNo}</Text>
          <Text style={styles.title}>{item.title || '—'}</Text>

          <View style={styles.row}><Text style={styles.label}>Name of Designer(s): </Text><Text style={styles.value}>{item.name || '—'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Institution/Company: </Text><Text style={styles.value}>{item.institution || '—'}</Text></View>
          <View style={styles.row}><Text style={styles.label}>Type of Jewellery: </Text><Text style={styles.value}>{item.type || '—'}</Text></View>
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <FlatList
        ListHeaderComponent={
          <View style={styles.header}>
            <Logo variant="platafrica" />
            <Text style={styles.pageTitle}>2025 Entries — Designers </Text>

            {/* Controls */}
            <View style={styles.controls}>
              {/* Search */}
              <View style={styles.searchWrap}>
                <Ionicons name="search" size={18} color={palette.platinum} />
                <TextInput
                  placeholder="Search by name, title, institution, type or #entry…"
                  value={query}
                  onChangeText={setQuery}
                  style={styles.searchInput}
                  autoCapitalize="none"
                />
                {query.length > 0 && (
                  <Pressable onPress={() => setQuery('')}>
                    <Ionicons name="close-circle" size={18} color={palette.platinum} />
                  </Pressable>
                )}
              </View>

              {/* Sort */}
              <View style={styles.segment}>
                {['entry', 'name', 'title', 'category'].map(k => (
                  <Pressable key={k} onPress={() => setSortBy(k)} style={[styles.segBtn, sortBy === k && styles.segActive]}>
                    <Text style={[styles.segText, sortBy === k && styles.segTextActive]}>
                      {k === 'entry' ? '#Entry' : k === 'name' ? 'Name' : k === 'title' ? 'Title' : 'Category'}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Favourites filter */}
              <Pressable onPress={() => setShowFavesOnly(v => !v)} style={styles.favesToggle}>
                <Ionicons name={showFavesOnly ? 'heart' : 'heart-outline'} size={18} color={showFavesOnly ? '#ef4444' : palette.platinumNavy} />
                <Text style={styles.favesLabel}>{showFavesOnly ? 'Favourites' : 'All'}</Text>
              </Pressable>
            </View>

            {/* Category chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {['All', ...CAT_ORDER].map(cat => (
                <Pressable
                  key={cat}
                  onPress={() => setCategoryFilter(cat)}
                  style={[styles.chip, categoryFilter === cat && styles.chipActive]}
                >
                  <Text style={[styles.chipText, categoryFilter === cat && styles.chipTextActive]}>
                    {cat === 'All' ? 'All Categories' : `${CAT_LABEL[cat]} (${categoryCounts[cat] ?? 0})`}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Institution chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {['All', ...institutions].map(inst => (
                <Pressable
                  key={inst}
                  onPress={() => setInstitutionFilter(inst)}
                  style={[styles.chip, institutionFilter === inst && styles.chipActive]}
                >
                  <Text style={[styles.chipText, institutionFilter === inst && styles.chipTextActive]}>
                    {inst}
                    {inst !== 'All' ? ` (${institutionIndex.get(inst)?.length ?? 0})` : ''}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={styles.countText}>{visible.length} result{visible.length === 1 ? '' : 's'}</Text>
          </View>
        }
        data={visible}
        keyExtractor={(item) => `entry-${item.entryNo}`}
        numColumns={twoCols ? 2 : 1}
        columnWrapperStyle={twoCols ? { justifyContent: 'space-between' } : undefined}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />

      {/* Preview modal */}
      <Modal visible={!!preview} animationType="slide" onRequestClose={() => setPreview(null)}>
        <View style={styles.modalWrap}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{preview?.title || 'Entry Preview'}</Text>
            <Pressable onPress={() => setPreview(null)} hitSlop={10}>
              <Ionicons name="close" size={24} color={palette.platinumNavy} />
            </Pressable>
          </View>
          <Image source={imgSource(preview?.img)} style={styles.modalImg} />
          <View style={{ padding: 16 }}>
            <Text style={styles.modalLine}><Text style={styles.label}>Category: </Text>{preview?.category ? `${preview.category} — ${CAT_LABEL[preview.category]}` : '—'}</Text>
            <Text style={styles.modalLine}><Text style={styles.label}>Entry: </Text>#{preview?.entryNo}</Text>
            <Text style={styles.modalLine}><Text style={styles.label}>Name of Designer(s): </Text>{preview?.name || '—'}</Text>
            <Text style={styles.modalLine}><Text style={styles.label}>Institution/Company: </Text>{preview?.institution || '—'}</Text>
            <Text style={styles.modalLine}><Text style={styles.label}>Type of Jewellery: </Text>{preview?.type || '—'}</Text>
          </View>
        </View>
      </Modal>
    </>
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
  list: { padding: 20, backgroundColor: palette.white },
  header: { backgroundColor: '#fff', padding: 16, borderRadius: 14, marginBottom: 12, ...cardShadow },

  controls: { marginTop: 8 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 8,
    backgroundColor: '#fff',
  },
  searchInput: { flex: 1, fontSize: 15, color: palette.platinumNavy, marginHorizontal: 8 },

  segment: {
    flexDirection: 'row',
    borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 999,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  segBtn: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#fff' },
  segActive: { backgroundColor: palette.valterraGreen + '22' },
  segText: { color: palette.platinumNavy, fontWeight: '700' },
  segTextActive: { color: palette.valterraGreen },

  favesToggle: {
    flexDirection: 'row', alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 8, backgroundColor: '#f8fafc',
    borderWidth: 1, borderColor: '#e5e7eb',
    marginTop: 8,
  },
  favesLabel: { color: palette.platinumNavy, fontWeight: '700', marginLeft: 6 },

  chipsRow: { paddingTop: 10, paddingBottom: 2 },

  chip: {
    paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: '#f3f4f6',
    borderWidth: 1, borderColor: '#e5e7eb',
    marginRight: 8,
  },
  chipActive: { backgroundColor: palette.valterraGreen },
  chipText: { color: palette.platinumNavy, fontWeight: '700' },
  chipTextActive: { color: '#fff' },

  countText: { marginTop: 8, color: palette.platinum, textAlign: 'right' },

  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#e5e7eb', ...cardShadow, position: 'relative' },
  cardFull: { width: '100%' },
  cardHalf: { width: '48%' },

  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10, resizeMode: 'cover' },

  // Category badge (top-left)
  badge: { position: 'absolute', top: 10, left: 10, borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8 },
  badgeText: { color: '#fff', fontWeight: '900', letterSpacing: 0.5 },
  badge_P: { backgroundColor: '#0ea5e9' },   // blue-ish
  badge_S: { backgroundColor: '#10b981' },   // green-ish
  badge_A: { backgroundColor: '#f59e0b' },   // amber-ish

  // Favourite button (top-right)
  favBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: '#ffffffcc', borderRadius: 999, padding: 6, borderWidth: 1, borderColor: '#e5e7eb' },

  meta: {},
  entryNo: { color: palette.platinum, fontWeight: '700', marginBottom: 2 },
  title: { color: palette.valterraGreen, fontWeight: '900', fontSize: 16, marginBottom: 6 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 },
  label: { color: palette.platinumNavy, fontWeight: '800' },
  value: { color: palette.platinumNavy, flexShrink: 1 },

  // Modal
  modalWrap: { flex: 1, backgroundColor: palette.white },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#e5e7eb' },
  modalTitle: { fontSize: 18, fontWeight: '900', color: palette.platinumNavy },
  modalImg: { width: '100%', height: 360, resizeMode: 'cover' },
  modalLine: { marginTop: 6, color: palette.platinumNavy },
});
