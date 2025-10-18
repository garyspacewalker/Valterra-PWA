// screens/DesignersScreen.js
import React, { useMemo, useState, useCallback, useRef } from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  useWindowDimensions,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import { Image as ExpoImage } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { Asset } from 'expo-asset';

import Logo from '../components/Logo';
import { palette } from '../theme';
import { useSettings } from '../context/SettingsContext';

import { supa } from '../lib/supabase';
import { uploadDesignerImageSB } from '../lib/storage';
import { logEvent } from '../lib/analytics';

// user taps migrate
const onMigratePress = async () => {
  logEvent('migrate_images_tap');
  await migrateAllBundled();
  logEvent('migrate_images_done');
};

// user opens a designer preview
const onOpen = (item) => {
  logEvent('designer_open', { entry_id: String(item.entryNo), cat: item.category });
  setPreview(item);
};


// Fallback image if an entry image is missing (kept as a require so it bundles)
const PLACEHOLDER = require('../assets/icon.png');

// A generic blurhash so thumbnails show a soft preview instantly
const GENERIC_BLURHASH = 'L5H2EC=PM+yV0g-mq.wG9c010J}I';

// Category labels
const CAT_LABEL = { P: 'Professional', S: 'Student', A: 'Apprentice' };
const CAT_ORDER = ['P', 'S', 'A']; // used only for sorting

// UI chips: merge Student + Apprentice into one
const CATEGORY_CHIPS = ['All', 'P', 'SA']; // SA = Student/Apprentice

// ------- Seed list using bundled images (local requires) -------
const ENTRIES = [
  { category: 'P', entryNo: 66, name: 'Emile Pitout, Lorin Bohm and Rob Burton', institution: 'Platandia Jewellery Collection', type: 'Neckpiece', title: 'Eclipse', img: require('../assets/designers/P66-Professional-NECKPIECE-PBBB0833-1.jpg') },
  { category: 'P', entryNo: 2, name: 'Nihal Shah', institution: 'Vijay Shah Concepts', type: 'Ring', title: 'Stratos', img: require('../assets/designers/P2-Professional-RING-PBBB0988.jpg') },
  { category: 'P', entryNo: 4, name: 'Esther Boshoff & Team', institution: 'Beaudell Designs', type: 'Armpiece', title: 'The Golden Ratio', img: require('../assets/designers/P4-Professional-ARMPIECE-PBBB0905-1.jpg') },
  { category: 'P', entryNo: 64, name: 'Ann ten Cate', institution: 'Mark Solomon Jewellers', type: 'Earrings', title: 'As I Grow', img: require('../assets/designers/P64-Professional-EARRINGS-PBBB0919-1.jpg') },
  { category: 'P', entryNo: 3, name: 'Vijay Shah', institution: 'Vijay Shah Concepts', type: 'Armpiece', title: 'Synergy', img: require('../assets/designers/P3-Professional-ARMPIECE-PBBB0896.jpg') },
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
  { category: 'S', entryNo: 151, name: 'Kelebogile Seleka', institution: 'Cape Peninsula University of Technology', type: 'Earrings', title: 'Blou-Arch', img: require('../assets/designers/S151-Student-EARRINGS-PBBB0978.jpg') },
  { category: 'S', entryNo: 152, name: 'Njabulo Khuzwayo', institution: 'Cape Peninsula University of Technology', type: 'Earrings', title: 'NovaDrop', img: require('../assets/designers/S152-Student-EARRINGS-PBBB0972.jpg') },
  { category: 'S', entryNo: 153, name: 'Siphe Demeshile', institution: 'Cape Peninsula University of Technology', type: 'Earrings', title: 'Echo Waves', img: require('../assets/designers/S153-Student-EARRINGS-PBBB0940.jpg') },
  { category: 'S', entryNo: 155, name: 'Wesley Fransman', institution: 'Cape Peninsula University of Technology', type: '', title: 'Spinal  Journey', img: require('../assets/designers/PA25_S155 Eesley Fransman.jpg') },
  { category: 'S', entryNo: 161, name: 'Simone Langeveldt', institution: 'Free Range Jewels', type: '', title: 'The Muitiple Appearance', img: require('../assets/designers/PA25_S161 Simone Langeveldt (2).jpg') },
  { category: 'S', entryNo: 67, name: 'Lwandile Sibiya', institution: 'Durban University of Technology', type: '', title: 'Afro-Deco', img: require('../assets/designers/PA25_S67 Lwandile Sibiya.jpg') },
  { category: 'S', entryNo: 88, name: 'Sibusisiwe Mtshali', institution: 'Pneuma Jewellers', type: '', title: 'Nomkhubulwana / Goddess of Prosperity in Zulu cosmology', img: require('../assets/designers/PA25_S88 Sibusiswe Mtshali.jpg') },
];

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
  const { typeScale, effectiveScheme, accent } = useSettings();

  const isDark = effectiveScheme === 'dark';
  const brand = accent === 'platafrica' ? palette.platinumNavy : palette.valterraGreen;
  const C = {
    bg: isDark ? '#0b1220' : palette.white,
    card: isDark ? '#111827' : '#fff',
    text: isDark ? '#e5e7eb' : palette.platinumNavy,
    textSoft: isDark ? '#cbd5e1' : palette.platinumNavy,
    muted: isDark ? '#94a3b8' : palette.platinum,
    border: isDark ? '#243244' : '#e5e7eb',
    chipBg: isDark ? '#1f2937' : '#f3f4f6',
  };

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
  const [categoryFilter, setCategoryFilter] = useState('All'); // 'All' | 'P' | 'SA'
  const [institutionFilter, setInstitutionFilter] = useState('All');
  const [sortBy, setSortBy] = useState('entry');
  const [favorites, setFavorites] = useState(new Set());
  const [showFavesOnly, setShowFavesOnly] = useState(false);
  const [preview, setPreview] = useState(null);

  // Paint new URLs immediately after upload
  const [urlOverrides, setUrlOverrides] = useState({}); // { [entryNo]: url }

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

    if (categoryFilter === 'P') list = list.filter(e => e.category === 'P');
    else if (categoryFilter === 'SA') list = list.filter(e => e.category === 'S' || e.category === 'A');

    if (institutionFilter !== 'All') {
      const pool = institutionIndex.get(institutionFilter) || [];
      list = pool.filter(e => list.includes(e));
    }

    if (showFavesOnly) list = list.filter(e => favorites.has(e.entryNo));

    list = [...list];
    if (sortBy === 'name') list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    else if (sortBy === 'title') list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    else if (sortBy === 'category') {
      list.sort((a, b) => {
        const c = CAT_ORDER.indexOf(a.category) - CAT_ORDER.indexOf(b.category);
        return c || (a.entryNo - b.entryNo);
      });
    } else list.sort((a, b) => a.entryNo - b.entryNo);

    return list;
  }, [query, categoryFilter, institutionFilter, showFavesOnly, sortBy, favorites, institutionIndex, sortedByEntryNo]);

  // Prefer: local override URL → DB field → bundled asset
  const imgSource = (item) => {
    const url = urlOverrides[item.entryNo] || item.image_url;
    if (url) return { uri: url };
    const img = item.img;
    if (typeof img === 'number') return img;
    if (typeof img === 'string') return { uri: img };
    return PLACEHOLDER;
  };

  // ----- Upload one image for a given entryNo -----
  const setDesignerPhoto = useCallback(async (entryNo) => {
    try {
      const picked = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.9,
      });
      if (picked.canceled) return;
      const uri = picked.assets[0].uri;

      const { downloadURL } = await uploadDesignerImageSB(entryNo, uri);

      const { error } = await supa
        .from('pieces') // table with image_url in your Supabase
        .update({ image_url: downloadURL })
        .eq('entryNo', entryNo);

      if (error) throw error;

      setUrlOverrides((prev) => ({ ...prev, [entryNo]: downloadURL }));
      Alert.alert('Updated', 'Designer image uploaded & saved.');
    } catch (e) {
      console.warn(e);
      Alert.alert('Upload failed', String(e?.message || e));
    }
  }, []);

  // ----- One-tap migration: upload all bundled assets → Supabase & write URLs -----
  const migrateAllBundled = useCallback(async () => {
    try {
      let uploaded = 0;
      for (const item of ENTRIES) {
        if (urlOverrides[item.entryNo]) continue;
        const mod = item.img;
        if (!mod) continue;

        const asset = await Asset.fromModule(mod);
        await asset.downloadAsync(); // ensures .localUri in dev/web
        const uri = asset.localUri || asset.uri;
        if (!uri) continue;

        const { downloadURL } = await uploadDesignerImageSB(item.entryNo, uri);

        const { error } = await supa
          .from('pieces') // same table
          .update({ image_url: downloadURL })
          .eq('entryNo', item.entryNo);

        if (!error) {
          uploaded++;
          setUrlOverrides((prev) => ({ ...prev, [item.entryNo]: downloadURL }));
        } else {
          console.warn('DB update failed for', item.entryNo, error);
        }
      }
      Alert.alert('Migration complete', `Uploaded ${uploaded} image(s).`);
    } catch (e) {
      console.warn(e);
      Alert.alert('Migration failed', String(e?.message || e));
    }
  }, [urlOverrides]);

  // Render a single grid card (memoized)
  const DesignerCard = React.memo(function Card({ item, fav, onOpen, onToggle, brandColor, colors }) {
    return (
      <Pressable
        onPress={onOpen}
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <ExpoImage
          source={imgSource(item)}
          style={styles.image}
          contentFit="cover"
          placeholder={GENERIC_BLURHASH}
          transition={200}
          cachePolicy="memory-disk"
          allowDownscaling
          recyclingKey={`thumb-${item.entryNo}`}
        />

        {/* Category badge */}
        <View style={[styles.badge, styles[`badge_${item.category}`]]}>
          <Text style={styles.badgeText}>{item.category}</Text>
        </View>

        {/* Favourite toggle */}
        <Pressable onPress={onToggle} style={[styles.favBtn, { borderColor: colors.border }]} hitSlop={12}>
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={22} color={fav ? '#ef4444' : colors.muted} />
        </Pressable>

        <View style={styles.meta}>
          <Text style={[styles.entryNo, { color: colors.muted }]}>Entry #{item.entryNo}</Text>
          <Text style={[styles.title, { color: brandColor }]}>{item.title || '—'}</Text>

          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSoft }]}>Name of Designer(s): </Text>
            <Text style={[styles.value, { color: colors.text }]}>{item.name || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSoft }]}>Institution/Company: </Text>
            <Text style={[styles.value, { color: colors.text }]}>{item.institution || '—'}</Text>
          </View>
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.textSoft }]}>Type of Jewellery: </Text>
            <Text style={[styles.value, { color: colors.text }]}>{item.type || '—'}</Text>
          </View>

          {/* Per-item admin upload */}
          <Pressable onPress={() => setDesignerPhoto(item.entryNo)} style={{ marginTop: 8, alignSelf: 'flex-start' }}>
            <Text style={{ color: brandColor, fontWeight: '800' }}>Upload New Image</Text>
          </Pressable>
        </View>
      </Pressable>
    );
  });

  const renderItem = ({ item }) => {
    const fav = favorites.has(item.entryNo);
    return (
      <View style={twoCols ? styles.cardHalf : styles.cardFull}>
        <DesignerCard
          item={item}
          fav={fav}
          onOpen={() => setPreview(item)}
          onToggle={() => toggleFavorite(item.entryNo)}
          brandColor={brand}
          colors={C}
        />
      </View>
    );
  };

  const androidPadTop = Platform.OS === 'android' ? 24 : 0;
  const getItemLayout = useRef(undefined).current;

  return (
    <>
      <FlatList
        ListHeaderComponent={
          <View style={[styles.header, { backgroundColor: C.card, borderColor: C.border }]}>
            <Logo variant="platafrica" />
            <Text
              style={[
                styles.pageTitle,
                { fontSize: Math.round(styles.pageTitle.fontSize * typeScale), color: C.text }
              ]}
            >
              2025 Entries — Designers
            </Text>

            {/* Controls */}
            <View style={styles.controls}>
              {/* Search */}
              <View style={[styles.searchWrap, { backgroundColor: C.card, borderColor: C.border }]}>
                <Ionicons name="search" size={18} color={C.muted} />
                <TextInput
                  placeholder="Search by name, title, institution, type or #entry…"
                  placeholderTextColor={C.muted}
                  value={query}
                  onChangeText={setQuery}
                  style={[styles.searchInput, { color: C.text }]}
                  autoCapitalize="none"
                />
                {query.length > 0 && (
                  <Pressable onPress={() => setQuery('')}>
                    <Ionicons name="close-circle" size={18} color={C.muted} />
                  </Pressable>
                )}
              </View>

              {/* Sort */}
              <View style={[styles.segment, { borderColor: C.border }]}>
                {['entry', 'name', 'title', 'category'].map(k => (
                  <Pressable key={k} onPress={() => setSortBy(k)} style={[
                    styles.segBtn,
                    { backgroundColor: C.card },
                    sortBy === k && { backgroundColor: brand + '22' }
                  ]}>
                    <Text style={[
                      styles.segText,
                      { color: C.text },
                      sortBy === k && { color: brand, fontWeight: '800' }
                    ]}>
                      {k === 'entry' ? '#Entry' : k === 'name' ? 'Name' : k === 'title' ? 'Title' : 'Category'}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Favourites chip */}
              <Pressable
                onPress={() => setShowFavesOnly(v => !v)}
                style={[styles.favesToggle, { backgroundColor: C.chipBg, borderColor: C.border }]}
              >
                <Ionicons name={showFavesOnly ? 'heart' : 'heart-outline'} size={18} color={showFavesOnly ? '#ef4444' : C.text} />
                <Text style={[styles.favesLabel, { color: C.text }]}>{showFavesOnly ? 'Favourites' : 'All'}</Text>
              </Pressable>

              {/* BIG header migrate button */}
              <View style={{ marginTop: 12 }}>
                <Pressable
                  onPress={migrateAllBundled}
                  style={{ backgroundColor: brand, padding: 12, borderRadius: 12 }}
                >
                  <Text style={{ color: '#fff', fontWeight: '900', textAlign: 'center' }}>
                    Migrate Images → Supabase
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Category chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {CATEGORY_CHIPS.map(cat => {
                const active = categoryFilter === cat;
                const label =
                  cat === 'All'
                    ? 'All Categories'
                    : cat === 'P'
                    ? `Professional (${categoryCounts.P ?? 0})`
                    : `Student/Apprentice (${(categoryCounts.S ?? 0) + (categoryCounts.A ?? 0)})`;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setCategoryFilter(cat)}
                    style={[
                      styles.chip,
                      { backgroundColor: C.chipBg, borderColor: C.border },
                      active && { backgroundColor: brand }
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: C.text },
                        active && { color: '#fff' }
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Institution chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {['All', ...institutions].map(inst => (
                <Pressable
                  key={inst}
                  onPress={() => setInstitutionFilter(inst)}
                  style={[
                    styles.chip,
                    { backgroundColor: C.chipBg, borderColor: C.border },
                    institutionFilter === inst && { backgroundColor: brand }
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      { color: C.text },
                      institutionFilter === inst && { color: '#fff' }
                    ]}
                  >
                    {inst}
                    {inst !== 'All' ? ` (${institutionIndex.get(inst)?.length ?? 0})` : ''}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={[styles.countText, { color: C.muted }]}>
              {visible.length} result{visible.length === 1 ? '' : 's'}
            </Text>
          </View>
        }
        data={visible}
        keyExtractor={(item) => `entry-${item.entryNo}`}
        numColumns={twoCols ? 2 : 1}
        columnWrapperStyle={twoCols ? { justifyContent: 'space-between' } : undefined}
        renderItem={renderItem}
        contentContainerStyle={[styles.list, { backgroundColor: C.bg }]}
        removeClippedSubviews
        initialNumToRender={6}
        maxToRenderPerBatch={8}
        updateCellsBatchingPeriod={50}
        windowSize={5}
      />

      {/* TEMP: giant floating migrate button (bottom-right) */}
      <View style={{ position: 'absolute', right: 16, bottom: 24, zIndex: 9999 }}>
        <Pressable
          onPress={migrateAllBundled}
          style={{ backgroundColor: '#0f62fe', paddingVertical: 14, paddingHorizontal: 18, borderRadius: 999, elevation: 6 }}
        >
          <Text style={{ color: '#fff', fontWeight: '900' }}>Migrate Images → Supabase</Text>
        </Pressable>
      </View>

      {/* Preview modal */}
      <Modal
        visible={!!preview}
        animationType="slide"
        onRequestClose={() => setPreview(null)}
        statusBarTranslucent
      >
        <SafeAreaView style={[styles.modalWrap, { paddingTop: Platform.OS === 'android' ? 24 : 0, backgroundColor: C.bg }]}>
          <View style={[styles.modalHeader, { borderColor: C.border }]}>
            <Text
              style={[
                styles.modalTitle,
                { fontSize: Math.round(styles.modalTitle.fontSize * typeScale), color: C.text }
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {preview?.title || 'Entry Preview'}
            </Text>
            <Pressable
              onPress={() => setPreview(null)}
              hitSlop={10}
              style={[styles.modalCloseBtn, { borderColor: C.border, backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}
            >
              <Ionicons name="close" size={24} color={C.text} />
            </Pressable>
          </View>

          <ExpoImage
            source={imgSource(preview || {})}
            style={styles.modalImg}
            contentFit="cover"
            placeholder={GENERIC_BLURHASH}
            transition={200}
            cachePolicy="memory-disk"
            allowDownscaling
            recyclingKey={preview ? `full-${preview.entryNo}` : 'full'}
            priority="high"
          />

          <View style={{ padding: 16 }}>
            <Text style={[styles.modalLine, { color: C.text }]}>
              <Text style={[styles.label, { color: C.textSoft }]}>Category: </Text>
              {preview?.category ? `${preview.category} — ${CAT_LABEL[preview.category]}` : '—'}
            </Text>
            <Text style={[styles.modalLine, { color: C.text }]}>
              <Text style={[styles.label, { color: C.textSoft }]}>Entry: </Text>#{preview?.entryNo}
            </Text>
            <Text style={[styles.modalLine, { color: C.text }]}>
              <Text style={[styles.label, { color: C.textSoft }]}>Name of Designer(s): </Text>{preview?.name || '—'}
            </Text>
            <Text style={[styles.modalLine, { color: C.text }]}>
              <Text style={[styles.label, { color: C.textSoft }]}>Institution/Company: </Text>{preview?.institution || '—'}
            </Text>
            <Text style={[styles.modalLine, { color: C.text }]}>
              <Text style={[styles.label, { color: C.textSoft }]}>Type of Jewellery: </Text>{preview?.type || '—'}
            </Text>

            {!!preview && (
              <Pressable
                onPress={() => setDesignerPhoto(preview.entryNo)}
                style={{ marginTop: 12, alignSelf: 'flex-start' }}
              >
                <Text style={{ color: brand, fontWeight: '900' }}>Upload New Image for this Entry</Text>
              </Pressable>
            )}
          </View>
        </SafeAreaView>
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
  list: { padding: 20 },
  header: { padding: 16, borderRadius: 14, marginBottom: 12, ...cardShadow, borderWidth: 1 },

  controls: { marginTop: 8 },
  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10, paddingVertical: 8,
  },
  searchInput: { flex: 1, fontSize: 15, marginHorizontal: 8 },

  segment: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 999,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  segBtn: { paddingVertical: 6, paddingHorizontal: 12 },
  segText: { fontWeight: '700' },

  favesToggle: {
    flexDirection: 'row', alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 8, borderWidth: 1,
    marginTop: 8,
  },
  favesLabel: { fontWeight: '700', marginLeft: 6 },

  chipsRow: { paddingTop: 10, paddingBottom: 2 },

  chip: {
    paddingVertical: 6, paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  chipText: { fontWeight: '700' },

  countText: { marginTop: 8, textAlign: 'right' },

  card: { borderRadius: 12, padding: 12, marginBottom: 14, borderWidth: 1, ...cardShadow, position: 'relative' },
  cardFull: { width: '100%' },
  cardHalf: { width: '48%' },

  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
  modalImg: { width: '100%', height: 360 },

  badge: { position: 'absolute', top: 10, left: 10, borderRadius: 6, paddingVertical: 4, paddingHorizontal: 8 },
  badgeText: { color: '#fff', fontWeight: '900', letterSpacing: 0.5 },
  badge_P: { backgroundColor: '#0ea5e9' },
  badge_S: { backgroundColor: '#10b981' },
  badge_A: { backgroundColor: '#f59e0b' },

  favBtn: { position: 'absolute', top: 10, right: 10, backgroundColor: '#ffffffcc', borderRadius: 999, padding: 6, borderWidth: 1 },

  meta: {},
  entryNo: { fontWeight: '700', marginBottom: 2 },
  title: { fontWeight: '900', fontSize: 16, marginBottom: 6 },
  row: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 2 },
  label: { fontWeight: '800' },
  value: { flexShrink: 1 },

  pageTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center' },

  modalWrap: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  modalTitle: { flex: 1, fontSize: 18, fontWeight: '900', marginRight: 8 },
  modalCloseBtn: { padding: 6, borderRadius: 8, borderWidth: 1 },
  modalLine: { marginTop: 6 },
});
