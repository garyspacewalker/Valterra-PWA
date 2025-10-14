// screens/SettingsScreen.js
import React from 'react';
import { ScrollView, View, Text, StyleSheet, Switch, Pressable } from 'react-native';
import { useSettings } from '../context/SettingsContext';
import { useOfflineCache } from '../providers/OfflineCacheProvider';
import { palette } from '../theme';

export default function SettingsScreen() {
  const {
    themeMode, setThemeMode,
    accent, setAccent,
    density, setDensity,
    reduceMotion, setReduceMotion,
    largeType, setLargeType,
    effectiveScheme,
    typeScale,
  } = useSettings();

  const { warmCache, clearing, caching } = useOfflineCache();

  const isDark = effectiveScheme === 'dark';
  const brand = accent === 'platafrica' ? palette.platinumNavy : palette.valterraGreen;
  const C = {
    bg: isDark ? '#0b1220' : palette.white,
    card: isDark ? '#111827' : '#fff',
    text: isDark ? '#e5e7eb' : palette.platinumNavy,
    muted: isDark ? '#94a3b8' : palette.platinum,
    border: isDark ? '#243244' : '#e5e7eb',
  };

  const H1 = ({ children }) => (
    <Text
      style={[
        styles.h1,
        { fontSize: Math.round(styles.h1.fontSize * typeScale), color: C.text }
      ]}
    >
      {children}
    </Text>
  );

  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: C.bg }]}>
      {/* Appearance */}
      <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
        <H1>Appearance</H1>

        <Text style={[styles.label, { color: C.text }]}>Theme</Text>
        <View style={[styles.segment, { borderColor: C.border }]}>
          {['system', 'light', 'dark'].map(v => (
            <Pressable
              key={v}
              onPress={() => setThemeMode(v)}
              style={[
                styles.segBtn,
                { backgroundColor: C.card },
                themeMode === v && { backgroundColor: brand + '22' }
              ]}
            >
              <Text style={[
                styles.segText,
                { color: C.text },
                themeMode === v && { color: brand, fontWeight: '800' }
              ]}>
                {v[0].toUpperCase() + v.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text style={[styles.note, { color: C.muted }]}>Current scheme: <Text style={[styles.bold, { color: C.text }]}>{effectiveScheme}</Text></Text>

        <Text style={[styles.label, { marginTop: 12, color: C.text }]}>Accent color</Text>
        <View style={[styles.segment, { borderColor: C.border }]}>
          <Pressable onPress={() => setAccent('valterra')} style={[styles.segBtn, { backgroundColor: C.card }, accent === 'valterra' && { backgroundColor: brand + '22' }]}>
            <Text style={[styles.segText, { color: C.text }, accent === 'valterra' && { color: brand, fontWeight: '800' }]}>Valterra</Text>
          </Pressable>
          <Pressable onPress={() => setAccent('platafrica')} style={[styles.segBtn, { backgroundColor: C.card }, accent === 'platafrica' && { backgroundColor: brand + '22' }]}>
            <Text style={[styles.segText, { color: C.text }, accent === 'platafrica' && { color: brand, fontWeight: '800' }]}>PlatAfrica</Text>
          </Pressable>
        </View>
        <Text style={[styles.note, { color: C.muted }]}>Accent updates buttons, chips and highlights.</Text>

        <View style={[styles.row, { marginTop: 12 }]}>
          <Text style={[styles.label, { color: C.text }]}>Large Text</Text>
          <View style={{ flex: 1 }} />
          <Switch value={largeType} onValueChange={setLargeType} />
        </View>
        <Text style={[styles.note, { color: C.muted }]}>Increases core text sizes across screens for accessibility.</Text>
      </View>

      {/* Layout & accessibility */}
      <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
        <H1>Layout & accessibility</H1>

        <Text style={[styles.label, { color: C.text }]}>Density</Text>
        <View style={[styles.segment, { borderColor: C.border }]}>
          <Pressable onPress={() => setDensity('comfortable')} style={[styles.segBtn, { backgroundColor: C.card }, density === 'comfortable' && { backgroundColor: brand + '22' }]}>
            <Text style={[styles.segText, { color: C.text }, density === 'comfortable' && { color: brand, fontWeight: '800' }]}>Comfortable</Text>
          </Pressable>
          <Pressable onPress={() => setDensity('compact')} style={[styles.segBtn, { backgroundColor: C.card }, density === 'compact' && { backgroundColor: brand + '22' }]}>
            <Text style={[styles.segText, { color: C.text }, density === 'compact' && { color: brand, fontWeight: '800' }]}>Compact</Text>
          </Pressable>
        </View>

        <View style={styles.row}>
          <Text style={[styles.label, { color: C.text }]}>Reduce motion</Text>
          <View style={{ flex: 1 }} />
          <Switch value={reduceMotion} onValueChange={setReduceMotion} />
        </View>

        <Text style={[styles.note, { color: C.muted }]}>Compact reduces paddings; Reduce motion softens animations.</Text>
      </View>

      {/* Offline cache */}
      <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
        <H1>Offline</H1>
        <Text style={[styles.p, { color: C.text }]}>
          Pre-cache images and data so the app works smoothly without a network (great for venues).
        </Text>
        <Pressable style={[styles.btn, { backgroundColor: brand }]} onPress={warmCache} disabled={caching || clearing}>
          <Text style={styles.btnText}>{caching ? 'Caching…' : 'Cache for offline use'}</Text>
        </Pressable>
        <Text style={[styles.small, { color: C.muted }]}>
          This will download key bundled assets and any seen remote images to device storage.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20 },

  card: {
    padding: 16, borderRadius: 14, marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },

  h1: { fontWeight: '900', fontSize: 18, marginBottom: 10 },
  p: { marginBottom: 10, lineHeight: 20 },

  row: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  label: { fontWeight: '700' },
  note: { marginTop: 6 },
  bold: { fontWeight: '900' },

  segment: { flexDirection: 'row', borderWidth: 1, borderRadius: 999, overflow: 'hidden', alignSelf: 'flex-start' },
  segBtn: { paddingVertical: 8, paddingHorizontal: 14 },
  segText: { fontWeight: '700' },

  btn: { borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 6 },
  btnText: { color: '#fff', fontWeight: '800' },
  small: { marginTop: 8 },
});
