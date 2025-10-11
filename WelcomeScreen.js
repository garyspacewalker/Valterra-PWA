// screens/WelcomeScreen.js
import React, { useEffect, useMemo, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  Modal,
  TextInput,
  Alert,
  Share,
  Linking,
  ActivityIndicator,
} from 'react-native';
import Logo from '../components/Logo';
import { palette } from '../theme';
import { supa } from '../lib/supabase';

const SUPA_URL  = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPA_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export default function WelcomeScreen({ navigation }) {
  // ---------- Supabase reachability ----------
  const [supaStatus, setSupaStatus] = useState('checking'); // checking | ok | error
  const [supaMsg, setSupaMsg] = useState('');

  const pingSupabase = async () => {
    // Basic validation before network
    if (!SUPA_URL || !SUPA_ANON) {
      setSupaStatus('error');
      setSupaMsg('Missing EXPO_PUBLIC_SUPABASE_URL or ANON KEY in .env');
      return;
    }
    try {
      setSupaStatus('checking');
      // lightweight public endpoint proves URL/key + network/certs
      const res = await fetch(`${SUPA_URL}/auth/v1/settings`, {
        headers: { apikey: SUPA_ANON },
      });
      if (res.ok) {
        setSupaStatus('ok');
        setSupaMsg('Reachable');
      } else {
        setSupaStatus('error');
        setSupaMsg(`HTTP ${res.status}`);
      }
    } catch (e) {
      setSupaStatus('error');
      setSupaMsg(e?.message || 'Network request failed');
    }
  };

  useEffect(() => {
    pingSupabase();
  }, []);

  // ---------- Interactive UI ----------
  const [compact, setCompact] = useState(false);
  const [likes, setLikes] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', message: '' });

  const values = ['Keep it safe', 'Own it', 'Stand Together'];
  const isSelected = (v) => selectedValues.indexOf(v) !== -1;
  const toggleValue = (v) =>
    setSelectedValues((prev) =>
      prev.indexOf(v) !== -1 ? prev.filter((x) => x !== v) : prev.concat(v)
    );

  const infoCards = useMemo(
    () => [
      { label: 'Employees globally', value: '29,000', detail: 'Global headcount across operations.' },
      { label: 'Free cash flow 2024', value: '$14.6 bn', detail: 'Operating cash after capital spending.' },
      { label: 'EBITDA 2024', value: '$19.8 bn', detail: 'Earnings before interest, tax, depreciation, amortisation.' },
    ],
    []
  );

  const onShare = async () => {
    try {
      await Share.share({
        message: 'Valterra Platinum — a leading PGM company. Learn more inside the app.',
      });
    } catch (e) {
      Alert.alert('Share failed', e.message);
    }
  };

  const openWebsite = () =>
    Linking.openURL('https://www.angloamericanplatinum.com/').catch(() =>
      Alert.alert('Could not open the website')
    );

  const navTo = (name) => {
    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate(name);
    } else {
      Alert.alert('Navigation not available', `Tried to navigate to ${name}`);
    }
  };

  const submitContact = () => {
    if (!contactForm.name.trim() || !contactForm.message.trim()) {
      Alert.alert('Please fill in your name and message.');
      return;
    }
    setContactOpen(false);
    setContactForm({ name: '', message: '' });
    Alert.alert('Message sent', 'Thanks! Our team will reach out.');
  };

  const host = (() => {
    try { return new URL(SUPA_URL).host; } catch { return SUPA_URL || '—'; }
  })();

  return (
    <ScrollView contentContainerStyle={styles.page}>
      {/* Supabase banner */}
      <View
        style={[
          styles.supaBanner,
          supaStatus === 'ok' && { borderColor: '#16a34a' },
          supaStatus === 'error' && { borderColor: '#dc2626' },
        ]}
      >
        <View style={styles.supaRow}>
          <Text style={styles.supaTitle}>Supabase</Text>
          {supaStatus === 'checking' ? (
            <ActivityIndicator />
          ) : (
            <View
              style={[
                styles.dot,
                supaStatus === 'ok' ? { backgroundColor: '#16a34a' } : { backgroundColor: '#dc2626' },
              ]}
            />
          )}
        </View>
        <Text style={styles.supaLine}>URL: {host}</Text>
        <Text style={styles.supaLine}>
          Status: {supaStatus === 'ok' ? 'Live' : supaStatus === 'checking' ? 'Checking…' : `Error (${supaMsg})`}
        </Text>
        <View style={{ height: 8 }} />
        <Pressable style={styles.secondaryBtn} onPress={pingSupabase}>
          <Text style={styles.secondaryText}>Ping Supabase</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Logo />
        <Text style={styles.title}>Welcome to Valterra Platinum</Text>
        <Text style={styles.subtitle}>(Previously known as Anglo American Platinum)</Text>

        {/* Quick actions */}
        <View style={styles.actionsRow}>
          <Pressable style={[styles.actionBtn, { marginRight: 8 }]} onPress={() => setLikes(likes + 1)}>
            <Text style={styles.actionText}>👍 Like {likes ? `(${likes})` : ''}</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, bookmarked ? styles.actionBtnActive : null, { marginRight: 8 }]}
            onPress={() => setBookmarked(!bookmarked)}
          >
            <Text style={styles.actionText}>{bookmarked ? '★ Bookmarked' : '☆ Bookmark'}</Text>
          </Pressable>
          <Pressable style={[styles.actionBtn, { marginRight: 8 }]} onPress={onShare}>
            <Text style={styles.actionText}>🔗 Share</Text>
          </Pressable>
          <Pressable style={styles.actionBtn} onPress={openWebsite}>
            <Text style={styles.actionText}>🌐 Website</Text>
          </Pressable>
        </View>

        {/* Compact toggle */}
        <View style={styles.compactRow}>
          <Text style={styles.compactLabel}>Compact view</Text>
          <Switch value={compact} onValueChange={setCompact} />
        </View>

        {/* Who we are (collapsible) */}
        <Section title="Who We Are" compact={compact}>
          <Text style={styles.p}>
            A fully demerged leading platinum group metals (PGM) mining company with products that are
            essential ingredients in almost every aspect of modern life.
          </Text>

          <View style={styles.grid3}>
            {infoCards.map((c, i) => (
              <Pressable
                key={i}
                style={[styles.infoCard, (i % 2 === 0) ? { marginRight: 8 } : null, { marginBottom: 8 }]}
                onPress={() => Alert.alert(c.value, c.detail)}
              >
                <Text style={styles.infoStrong}>{c.value}</Text>
                <Text style={styles.infoLabel}>{c.label}</Text>
              </Pressable>
            ))}
          </View>
        </Section>

        {/* Products */}
        <Section title="Our Products" compact={compact}>
          <Text style={styles.p}>
            <Text style={styles.bold}>Platinum Group Metals (PGMs): </Text>
            Platinum, Palladium, Rhodium, Ruthenium, Iridium, Osmium
          </Text>
          <Text style={styles.p}>
            <Text style={styles.bold}>Base Metals & Others: </Text>
            Copper, Nickel, Cobalt, Chrome, Sulphuric Acid
          </Text>

          <View style={styles.ctaRow}>
            <Pressable style={[styles.ctaBtn, { marginRight: 8 }]} onPress={() => navTo('DesignersScreen')}>
              <Text style={styles.ctaText}>Explore Designers →</Text>
            </Pressable>
            <Pressable style={styles.ctaBtn} onPress={() => navTo('JudgesScreen')}>
              <Text style={styles.ctaText}>Meet Judges →</Text>
            </Pressable>
          </View>
        </Section>

        {/* Purpose */}
        <Section title="Our Purpose" compact={compact}>
          <Text style={[styles.p, styles.quote]}>“Unearthing value to better our world”</Text>

          <View style={styles.ctaRow}>
            <Pressable style={[styles.secondaryBtn, { marginRight: 8 }]} onPress={() => setContactOpen(true)}>
              <Text style={styles.secondaryText}>Contact Us</Text>
            </Pressable>
            <Pressable style={styles.secondaryBtn} onPress={() => navTo('LinksScreen')}>
              <Text style={styles.secondaryText}>Useful Links</Text>
            </Pressable>
          </View>
        </Section>

        {/* Values */}
        <Section title="Our Values" compact={compact}>
          <View style={styles.valuesRow}>
            {values.map((v, idx) => (
              <Pressable
                key={v}
                onPress={() => toggleValue(v)}
                style={[
                  styles.valuePill,
                  isSelected(v) && { backgroundColor: palette.valterraGreen, borderColor: palette.valterraGreen },
                  { marginRight: (idx % 3 !== 2) ? 8 : 0, marginBottom: 8 },
                ]}
              >
                <Text style={[styles.valueText, isSelected(v) && { color: '#fff' }]}>{v}</Text>
              </Pressable>
            ))}
          </View>

          {selectedValues.length > 0 && (
            <View style={styles.selectionNote}>
              <Text style={styles.selectionText}>Highlighting: {selectedValues.join(', ')}</Text>
            </View>
          )}
        </Section>

        {/* Where we are */}
        <Section title="Where We Are" compact={compact}>
          <Text style={styles.p}>Headquarters: Rosebank, South Africa</Text>
          <Text style={styles.p}>Operations & Projects: Southern Africa</Text>
          <Text style={styles.p}>Listed on the Johannesburg & London Stock Exchanges</Text>

          <View style={styles.ctaRow}>
            <Pressable style={styles.ctaBtn} onPress={() => navTo('ThemeScreen')}>
              <Text style={styles.ctaText}>Theme Settings →</Text>
            </Pressable>
          </View>
        </Section>
      </View>

      {/* Contact modal */}
      <Modal visible={contactOpen} animationType="slide" transparent onRequestClose={() => setContactOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Contact Valterra</Text>

            <TextInput
              placeholder="Your name"
              value={contactForm.name}
              onChangeText={(t) => setContactForm({ ...contactForm, name: t })}
              style={styles.input}
              placeholderTextColor="#94a3b8"
            />
            <TextInput
              placeholder="Your message"
              value={contactForm.message}
              onChangeText={(t) => setContactForm({ ...contactForm, message: t })}
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholderTextColor="#94a3b8"
              multiline
            />

            <View style={styles.modalBtns}>
              <Pressable style={[styles.secondaryBtn, { flex: 1, marginRight: 8 }]} onPress={() => setContactOpen(false)}>
                <Text style={styles.secondaryText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.ctaBtn, { flex: 1 }]} onPress={submitContact}>
                <Text style={styles.ctaText}>Send</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function Section({ title, compact, children }) {
  const [open, setOpen] = useState(true);
  return (
    <View style={styles.section}>
      <Pressable onPress={() => setOpen(!open)} style={styles.sectionHeader}>
        <Text style={styles.h2}>{title}</Text>
        <Text style={styles.chevron}>{open ? '▾' : '▸'}</Text>
      </Pressable>
      {open && <View style={[compact ? { marginTop: 4 } : null]}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  page: { padding: 20, backgroundColor: palette.white },

  // supabase banner
  supaBanner: {
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },
  supaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  supaTitle: { fontWeight: '800', color: palette.platinumNavy, fontSize: 16 },
  supaLine: { color: palette.platinumNavy, marginTop: 4 },
  dot: { width: 10, height: 10, borderRadius: 999, marginLeft: 8 },

  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
  },

  title: { fontSize: 24, fontWeight: '800', color: palette.valterraGreen, textAlign: 'center' },
  subtitle: { textAlign: 'center', color: palette.platinum, marginBottom: 16 },

  actionsRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
  actionBtn: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 120,
    marginBottom: 8,
  },
  actionBtnActive: { backgroundColor: '#e2e8f0' },
  actionText: { color: palette.platinumNavy, fontWeight: '600' },

  compactRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  compactLabel: { color: palette.platinumNavy, fontWeight: '600' },

  section: { marginTop: 14 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  h2: { fontSize: 18, color: palette.valterraGreen, fontWeight: '700', marginBottom: 8 },
  chevron: { fontSize: 18, color: palette.platinumNavy },

  p: { color: palette.platinumNavy, lineHeight: 22, marginBottom: 6 },
  bold: { fontWeight: '700' },
  quote: { fontStyle: 'italic', color: palette.platinum },

  grid3: { flexDirection: 'row', flexWrap: 'wrap' },
  infoCard: {
    flexGrow: 1,
    minWidth: 120,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  infoStrong: { fontWeight: '900', fontSize: 18, color: palette.platinumNavy },
  infoLabel: { color: palette.platinumNavy },

  valuesRow: { flexDirection: 'row', flexWrap: 'wrap' },
  valuePill: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#0000',
  },
  valueText: { color: palette.platinumNavy },
  selectionNote: { marginTop: 8, padding: 10, backgroundColor: '#f1f5f9', borderRadius: 8 },
  selectionText: { color: palette.platinumNavy, fontStyle: 'italic' },

  ctaRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 },
  ctaBtn: { backgroundColor: palette.valterraGreen, paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, marginBottom: 8 },
  ctaText: { color: '#fff', fontWeight: '700' },

  secondaryBtn: { backgroundColor: '#eef2ff', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  secondaryText: { color: palette.platinumNavy, fontWeight: '700' },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: palette.valterraGreen, marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: palette.platinumNavy,
  },
  modalBtns: { flexDirection: 'row', marginTop: 6 },
});
