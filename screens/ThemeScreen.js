// screens/ThemeScreen.js
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import Logo from '../components/Logo';
import { palette } from '../theme';
import { useSettings } from '../context/SettingsContext';

// ---- local images (ensure these files exist) ----
const IMG_HERO = require('../assets/theme/new-horizon-hero.png');
const IMG_RADIATE = require('../assets/theme/new-horizon-radiate.png');
const IMG_EXPLAINER = require('../assets/theme/new-horizon-explainer.png');
const IMG_WHITE = require('../assets/theme/expressive-white.png');
const IMG_RARE = require('../assets/theme/platinum-rare.png');

export default function ThemeScreen() {
  const { width } = useWindowDimensions();
  const isPhone = width < 700;
  const { typeScale, effectiveScheme, accent } = useSettings();

  const isDark = effectiveScheme === 'dark';
  const brand = accent === 'platafrica' ? palette.platinumNavy : palette.valterraGreen;
  const C = {
    bg: isDark ? '#0b1220' : palette.white,
    card: isDark ? '#111827' : '#fff',
    text: isDark ? '#e5e7eb' : palette.platinumNavy,
    muted: isDark ? '#94a3b8' : palette.platinum,
    border: isDark ? '#243244' : '#e5e7eb',
    poemBg: isDark ? '#0f172a' : '#f1f5f9',
    poemBorder: isDark ? '#1f2937' : '#d9e0e7',
  };

  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: C.bg }]}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
          <Logo variant="platafrica" />
        </View>

        {/* HERO */}
        <View style={[styles.card, styles.noPad, { backgroundColor: C.card, borderColor: C.border }]}>
          <ImageBackground source={IMG_HERO} style={styles.hero} imageStyle={styles.heroImg}>
            <View style={styles.heroOverlay} />
            <Text
              style={[
                styles.heroTitle,
                { fontSize: Math.round(styles.heroTitle.fontSize * typeScale) }
              ]}
            >
              New Horizon
            </Text>
          </ImageBackground>
        </View>

        {/* Radiating ideas / keywords */}
        <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
          <View style={[styles.split, isPhone && styles.splitCol]}>
            <View style={styles.splitText}>
              <Text
                style={[
                  styles.h2,
                  { fontSize: Math.round(styles.h2.fontSize * typeScale), color: brand }
                ]}
              >
                New Horizon — directions
              </Text>
              <Text style={[styles.p, { color: C.text }]}>Ideas that radiate from the horizon of possibility:</Text>
              <View style={styles.bullets}>
                <Text style={[styles.bullet, { color: C.text }]}>• Future trends</Text>
                <Text style={[styles.bullet, { color: C.text }]}>• New beginnings</Text>
                <Text style={[styles.bullet, { color: C.text }]}>• Environmental awareness</Text>
                <Text style={[styles.bullet, { color: C.text }]}>• Seeking novelty and innovations</Text>
                <Text style={[styles.bullet, { color: C.text }]}>• Boundless creativity</Text>
              </View>
            </View>
            <Image source={IMG_RADIATE} style={[styles.sideImg, isPhone && styles.sideImgFull]} />
          </View>
        </View>

        {/* Explainer (poem + paragraphs) */}
        <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
          <Image source={IMG_EXPLAINER} style={styles.bannerImg} />
          <View style={[styles.poemBox, { backgroundColor: C.poemBg, borderColor: C.poemBorder }]}>
            <Text
              style={[
                styles.h2,
                { fontSize: Math.round(styles.h2.fontSize * typeScale), color: brand }
              ]}
            >
              New Horizon
            </Text>
            <Text style={[styles.poem, { color: C.text }]}>
              In dawning glow, where dreams take flight,{'\n'}
              Designs emerge from the first of light.{'\n'}
              New forms, new fashions, new meanings,{'\n'}
              The future of jewellery, new beginnings.{'\n\n'}
              Horizon’s promise shine far and bright,{'\n'}
              A canvas of future in platinum white.{'\n'}
              Through artistry’s lens, we boldly go,{'\n'}
              Crafting value for a better world.
            </Text>
          </View>

          <Text style={[styles.p, { color: C.text }]}>
            The term <Text style={styles.bold}>“horizon”</Text> symbolizes looking towards the future. Designers might
            explore emerging trends, materials, or technologies that could shape the future of jewellery.{' '}
            <Text style={styles.bold}>“New”</Text> – fresh, original or unique.
          </Text>
          <Text style={[styles.p, { color: C.text }]}>
            <Text style={styles.bold}>New Horizon</Text> encourages participants to push boundaries and think outside
            traditional norms. It invites designers to envision what is possible beyond current limitations in
            craftsmanship and aesthetics.
          </Text>
          <Text style={[styles.p, { color: C.text }]}>
            A focus on sustainability and ethical sourcing may also align with this theme, encouraging designs that
            reflect awareness of global issues while projecting a hopeful vision for the future.
          </Text>
          <Text style={[styles.p, { color: C.text }]}>
            <Text style={styles.bold}>New Horizon</Text> symbolizes new beginnings and opportunities. Designs could
            incorporate elements that represent growth, innovation, exploration or transformation.
          </Text>
          <Text style={[styles.p, { color: C.text }]}>
            PlatAfrica 2025 <Text style={styles.bold}>“New Horizon”</Text> is looking for design creativity that looks
            ahead while considering broader implications in society and culture within the field of jewellery design.
          </Text>
        </View>

        {/* Expressive power of white */}
        <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
          <View style={[styles.split, isPhone && styles.splitCol]}>
            <View style={styles.splitText}>
              <Text
                style={[
                  styles.h2,
                  { fontSize: Math.round(styles.h2.fontSize * typeScale), color: brand }
                ]}
              >
                The expressive power of white
              </Text>
              <Text style={[styles.p, { color: C.text }]}>
                Platinum — a perfect canvas as a precious metal, naturally white and highly durable, the material
                becomes the protagonist. Its authenticity provides the consumer with the transparency they seek.
              </Text>
              <View className="bullets">
                <Text style={[styles.bullet, { color: C.text }]}>• The purity of white: a blank canvas for striking expression.</Text>
                <Text style={[styles.bullet, { color: C.text }]}>• Intricate details and textures lift classic and fluid shapes.</Text>
                <Text style={[styles.bullet, { color: C.text }]}>• Platinum allows the material to speak for itself.</Text>
                <Text style={[styles.bullet, { color: C.text }]}>
                  • Appropriate for all occasions, satisfying the complex and varied needs of today’s consumer and
                  fueling their focus on fewer, high-quality products that will last a lifetime.
                </Text>
                <Text style={[styles.bullet, { color: C.text }]}>
                  • Striking shapes, surfaces and textures allow quality materials to speak for themselves.
                </Text>
              </View>
            </View>
            <Image source={IMG_WHITE} style={[styles.sideImg, isPhone && styles.sideImgFull]} />
          </View>
        </View>

        {/* Platinum precious & rare + values */}
        <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
          <View style={[styles.split, isPhone && styles.splitCol]}>
            <View style={styles.splitText}>
              <Text
                style={[
                  styles.h2,
                  { fontSize: Math.round(styles.h2.fontSize * typeScale), color: brand }
                ]}
              >
                Platinum — precious and rare
              </Text>
              <Text style={[styles.p, { color: C.text }]}>
                Platinum — is the perfect canvas; as a precious metal it is naturally white and highly durable. Let the
                metal take the lead.
              </Text>

              <Text
                style={[
                  styles.h3,
                  { fontSize: Math.round(styles.h3.fontSize * typeScale), marginTop: 10, color: C.text }
                ]}
              >
                Platinum is:
              </Text>
              <View style={[styles.valuesWrap, isPhone && styles.valuesWrapStack]}>
                <View style={[styles.valueCard, isPhone && styles.fullWidth]}>
                  <Text style={[styles.valueTitle, { color: C.text }]}>ENDURING</Text>
                  <Text style={[styles.valueBody, { color: C.text }]}>
                    Tenacious and tough, it’s the perfect witness to true love that lasts a lifetime.
                  </Text>
                </View>
                <View style={[styles.valueCard, isPhone && styles.fullWidth]}>
                  <Text style={[styles.valueTitle, { color: C.text }]}>TIMELESS</Text>
                  <Text style={[styles.valueBody, { color: C.text }]}>
                    Does not fade or corrode; it stands the test of time. Perfect for heirlooms to pass to future
                    generations.
                  </Text>
                </View>
                <View style={[styles.valueCard, isPhone && styles.fullWidth]}>
                  <Text style={[styles.valueTitle, { color: C.text }]}>NATURALLY WHITE</Text>
                  <Text style={[styles.valueBody, { color: C.text }]}>The best security for your diamonds and precious stones.</Text>
                </View>
                <View style={[styles.valueCard, isPhone && styles.fullWidth]}>
                  <Text style={[styles.valueTitle, { color: C.text }]}>THE METAL OF TRUTH</Text>
                  <Text style={[styles.valueBody, { color: C.text }]}>
                    At 950 purity it symbolises integrity, excellence and authenticity.
                  </Text>
                </View>
              </View>
            </View>

            <Image source={IMG_RARE} style={[styles.sideImg, isPhone && styles.sideImgFull]} />
          </View>
        </View>

        <View style={{ height: 24 }} />
      </View>
    </ScrollView>
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
  page: {
    paddingVertical: 20,
    alignItems: 'stretch',
  },
  container: {
    width: '100%',
    maxWidth: 1100,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },

  // cards/sections
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    alignSelf: 'stretch',
    ...cardShadow,
    borderWidth: 1,
  },
  noPad: { padding: 0 },

  // hero
  hero: { width: '100%', height: 240, justifyContent: 'flex-end' },
  heroImg: { resizeMode: 'cover' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  heroTitle: { color: '#fff', fontSize: 36, fontWeight: '800', margin: 16, letterSpacing: 0.5 },

  // split rows
  split: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  splitCol: { flexDirection: 'column' },
  splitText: { flex: 1, paddingRight: 16 },

  sideImg: { width: 300, height: 200, borderRadius: 12, resizeMode: 'cover' },
  sideImgFull: { width: '100%', height: 220, marginTop: 12 },

  bannerImg: { width: '100%', height: 140, borderRadius: 12, marginBottom: 12, resizeMode: 'cover' },

  // type
  h2: { fontSize: 20, fontWeight: '800' },
  h3: { fontSize: 16, fontWeight: '800' },
  p: { lineHeight: 22, marginTop: 6 },
  bold: { fontWeight: '800' },
  bullets: { marginTop: 8 },
  bullet: { lineHeight: 22, marginBottom: 4 },

  // poem
  poemBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  poem: { lineHeight: 22 },

  // values grid
  valuesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  valuesWrapStack: { flexDirection: 'column' },
  valueCard: {
    width: '48%',
    backgroundColor: '#00000000',
    borderWidth: 0,
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  fullWidth: { width: '100%' },
  valueTitle: { fontWeight: '900', marginBottom: 6 },
  valueBody: { lineHeight: 20 },
});
