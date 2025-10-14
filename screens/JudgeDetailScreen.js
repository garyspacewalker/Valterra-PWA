// screens/JudgeDetailScreen.js
import React, { useMemo } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Logo from '../components/Logo';
import { palette } from '../theme';
import { useSettings } from '../context/SettingsContext';

const PLACEHOLDER = require('../assets/icon.png');

const BIO_MAP = {
  'oliver-green': [
    "From a young age, Oliver Green enjoyed creating and making things in his father’s workshop fueling his passion for designing and working with his hands.",
    "Subsequently, he started studying Jewellery Design and Manufacture at the University of Johannesburg. His passion for platinum started when he first entered the Plat Africa competition in his second year. During the years leading up to his Btech, platinum became more and more prominent, leading him to specialise in high-end platinum jewellery. ",
    "After completing his studies, Oliver started working at Jack Friedman as a CAD designer and apprentice jeweller, during this time he was also successful in obtaining his trade test qualification.",
    "From the first time Oliver entered the Plat Africa Competition, his perseverance, dedication and hard work eventually paid off.  He was placed third in his category, which in turn gave Oliver the opportunity to travel to Japan to further his knowledge, up his skills and meet new people within the industry.",
    "The overall experience pushed and led Oliver to obtain two consecutive first place wins within the professional category. As a result, this gave him a respectable name in the industry and opened doors to many opportunities, such as designing the Miss SA crown and furthering his studies with a Master of Arts in Luxury Goods at the Creative Academy in Milan. This was then followed by an internship at Montblanc in Hamburg in the design department.",
    "Upon returning to South Africa, Oliver travelled to a few Jewellery/Manufacturing factories in Hong Kong and China for a tour of their workshops and to learn how they operate within the industry. This new-found knowledge and machinery were introduced & shared with the Jack Friedman workshop/team. Oliver was moved into the role of Head Designer and was given the honour to design the new Miss SA Crown and is currently working with them on new and upcoming projects.",
    "Oliver and his amazing team at Jack Friedman constantly strive to create the exquisite jewellery pieces that everyone has come to know and love.",
    "The invitation to design and make a piece for the Magnificent 7 was an incredible privilege to partake in such a prestigious category.",
  ],
  'dave-newman': [
    "Jewellery Programme Leader, lecturer and practitionerTshwane University of TechnologyDates Employed\tJan 1998 – PresentEmployment Duration\t21 yrs 10 mosTeaches Jewellery Techniques at the University, and practices part time as a jeweller",
    "Self employed JewellerCompany Name: Newman Jewellery Design CCStarted Apr 2002 – PresentJewellery Design and Manufacture. Hand fabrication, CAD design, casting, gem setting",
    "He was the chairman only briefly for 8 months",
    "Dave Newman, Tshwane University of Technology (TUT) Lecturer and Programme Coordinator for the Jewellery Programme at the Department of Fine and Applied Arts, has been appointed new chairperson of the Jewellery Manufacturers’ Association of South Africa (JMASA).",
    "He brings a wealth of knowledge to the Association as he has been actively involved in the South African jewellery industry since 1984, both as a business owner and an educator.",
    "Dave Newman, TUT Lecturer and Programme Coordinator for the Jewellery Programme at the Department of Fine and Applied Arts, is the new chairperson of the Jewellery Manufacturers’ Association of South Africa (JMASA).",
    "JMASA is a division of the Jewellery Council of South Africa. Its role is mainly to represent and address the needs of its members in issues affecting the manufacture of jewellery.",
    "Newman says he is greatly honoured to be elected to this position. “It is brilliant to be acknowledged by the senior members of one’s industry as someone who they feel is suitable to represent them, and to be a part of the leadership in the industry. As a person who has background in business, training and education, I’m well positioned to represent the industry from a broader perspective,” he indicates.",
    "He adds that the TUT Jewellery Programme benefits greatly from his involvement in JMASA, as he gets valuable insight in training, developments, technical issues etc. in the sector.",
    "“My involvement has also largely been due to the high quality of our offering, and the subsequent ‘vote of confidence’ in what we do. Our programme has always been highly regarded by industry and our students are in high demand. We’re able to keep our finger on the pulse of the industry, which makes it easier to remain relevant,” he says.",
    "As chairperson, Newman will preside over the Executive Committee of JMASA in terms of convening and running meetings, as well as representing it on the Board of the Jewellery Council of South Africa, among others.",
    "Another feather in his cap was added when he was approached by the Mining Qualifications Authority (MQA) some time ago to become a technical specialist in the development of goldsmith and setter’s qualifications.",
    "Thereafter, he was co-opted to JMASA’s EXCO to assist with the training and education portfolio, and was part of a sub-committee that developed a Jewellery Council Trade Certificate test. He later became a full EXCO member; and was elected to vice-chairperson last year.",
    "His term of office as chairperson is two years.",
  ],
  'chris-van-rensburg': [
    "My name is Chris Van Rensburg and I have been a Jewellery Manufacturer for 40 years",
    "I started my goldsmith apprenticeship in Nelspruit where I grew upIn 2000 I started Studio C Manufacturing Jewellers in Johannesburg.  We supply the trade and the consumer with gold and platinum jewellery.I am very involved in the industry and I’m the chairman of the Jewellery Council of South Africa.",
    "Besides making jewellery I enjoy sculpting.",
    "Since 2001 the first time I entered the Platafrica Competition, I have achieved 1st place 5 times.",
  ],
  'lorna-lloyd': [
    "CEO, Jewellery Council of South Africa",
    "Lorna Lloyd has dedicated over 30 years to the Jewellery Council of South Africa (JCSA), serving in various roles, and has held the position of Chief Executive Officer for the past 12 years.",
    "In her role, Lorna represents the interests of stakeholders across the jewellery value chain — including refiners, manufacturers, wholesalers, and retailers. Her work involves close collaboration with government on legislative matters, promoting ethical practices, supporting training initiatives, and enhancing consumer confidence.",
    "Lorna oversees a range of initiatives, including:•\tThe annual Jewellex Africa trade show•\tMonthly publication of SA Jewellery News•\tDrafting of Recommended Trade Practices•\tIndustry mediation and arbitration services•\tCoordinating South African participation in international jewellery exhibitions•\tProviding member benefits such as preferential rates and resources",
    "She has also played a key role in organising the ‘Jewellery Council Collection Awards’ a design competition aimed at showcasing local talent.",
    "Lorna has been honoured to be a judge of the PlatAfrica Awards for the past three years. While not a trained jeweller, she evaluates entries through the lens of a discerning consumer — focusing on wearability, aesthetic appeal, and market relevance — offering a fresh and relatable viewpoint. She believes she is able to bring a unique perspective to the judging panel.",
  ],
  'geraldine-fenn': [
    "I'm a contemporary jeweller living in Johannesburg, South Africa, where I have a studio and gallery called Tinsel. I studied technology jewellery design in Durban, after graduating in Archaeology at Wits, a few years ago I returned to Wits to do Art History and then a Masters in Fine Art. I participated in several jewellery and art group exhibitions, and two solo exhibitions.",
    "In terms of style, my pieces are often quite layered and figurative and I like to use motifs associated with historic jewellery that are overtly sentimental.",
    "I generally work with precious materials - silver, gold, diamonds, pearls and other precious stones - as well as less traditional materials such as plastics and ivory. Handwork is very important to me, and I make my pieces using traditional goldsmithing techniques.",
    "My pieces are unique, but I can repeat certain elements, so if you want something the same but different, I can make it for you. I'm happy to make commissions - I love making bespoke jewellery, the more personal the better.",
  ],
  'joel-graham': [
    "Joel Graham is the founder and owner of www.capediamonds.co.za  a jewellery business that has a strong online presence in South Africa, that speci¬¬alises in creating platinum diamond engagement rings. Trained as a jeweller at Natal University of Technology (now Durban University of Technology), Joel has been practicing his craft for more than 23 years, and has experience in South Africa and abroad. He has worked alongside some of the greatest jewellers and goldsmiths in the world, who had outlets in Bond Street and Harrods. Working with famous British jewellery designer Barbara Tipple and her husband, David Ward, Joel learned new and ancient jewellery techniques, such as reposé, hand engraving, anti-clastic raising, and pavé setting. He was also selected and sponsored by Anglo Platinum to give lectures on working with platinum in handmade jewellery to 4th year students at Stellenbosch University.",
  ],
  'bheki-ngema': [
    "Growing up in the dusty streets of Barberton, Bheki Ngema his sister were very fortunate and blessed to be handed down life’s values and honesty, hardworking by their loving parents.",
    "They were always taught that they could be anything that they desired to be as long as it make them happy and they make the best of it.",
    "Looking back now, with an amazing array of skills and dreams of a better life",
    "Bheki Ngema went on to Study Jewellery Design and Manufacturing to further nourish his passion for jewellery design. During the last year of his studies he was crowned the DTC Shining Lights overall winner 2008/2009 in the De Beers design competition.",
    "Winning the competition was an affirmation on the chosen career path and for greater accomplishments. Specialising in Jewellery Computer Aided Design (CAD Technician), Bheki Ngema worked for a company as the head of design for 4years, and later moved on to establish his own company namely BEN & Co Design (Pty) Ltd, which is an acronym for Bheki Ernest Ngema & Company. His jewellery design talent and business experience has drawn the attention of other big and small jewellery companies around and South Africa to either collaborate or to consult for them.",
    "In recent years, Bheki Ngema has received relevant certificates and has become member of the Jewellery Council of South Africa, and has had the privilege of showcasing his Brand and participates in the world’s largest market place for the jewellery industry, featuring more than 4,360 exhibitors from 52 countries and regions, the Hong Kong International Jewellery & Diamond Show 2015.",
    "In 2015 he was again crowed the overall winner in the 2015 Plat-Africa Design competition, and late in 2016 launched his first Retail Store in an upmarket area in heart of Pretoria East called Menlyn Maine Central Square around.",
    "2019 - Bheki  won 2019 Nedbank Business Ignite with 702",
  ],
  'lungile-xhwantini': [
    "Lungile (34) was born in Bloemfontein, South Africa. He was initially drawn to architecture – fascinated by the idea of creating new and unique concepts for buildings. Quite soon he discovered that jewellery design involves the same kind of creativity and enrolled at the Motheo TVET College Bloemfontein (2010-2013) majoring in jewellery manufacturing and design. He then served a three-year apprenticeship at The Platinum Incubator (TPI).",
    "He is constantly striving to explore new techniques and undertake new challenges. He has studied Project Management (2017) and Business Management (2018) as well as taking part in a skills exchange programme in Hunan, Changsha, China on jewellery manufacturing and in 2022 became a certified ICF Coach (Coach Companion Sweden).",
    "He was the winning overall Professional designer for PlatAfrica 2020 and 2023",
    "Lungile has also partnered in a campaign with TFG for a collaborative capsule range at Sterns in Canal walk CPT (2025)",
    "He is currently the Production Manager/Master Goldsmith at (TPI) and a contracted Goldsmith at De Xesign (Pty) Ltd. His goal is to become an industry expert both locally and internationally.",
    "“What I enjoy most about my profession is being able to create unique challenging designs that test my abilities but more importantly, providing skills transfer and development to apprentices and entrepreneurs. I believe it is important to give back the skill sets I have obtained throughout my career.”",
  ],
  'tai-wong': [
    "Director, Global Innovation DevelopmentPlatinum Guild International",
    "Tai has been with PGI China for more than 13 years working with partners in jewellery manufacturing and retail.  He now takes up an international role at PGI on Global Innovation Development.",
    "His key objectives are to expand platinum jewellery business through the implementation of novel technology, and to develop new market opportunities in new consumer segmentations.  Tai is also an active creator on the PlatinumABC YouTube and LinkedIN channels that endeavor to share platinum knowledge and expertise from around the world for innovation and education purposes.",
    "Forums presented in 2024-2025",
    "2024-1 CIBJO Jewellery Industry Voices, VicenzaORO (Italy)- on the Branding of the Jewllery Market",
    "2024-05 The Jewelry Sympoisum (USA)- on Improvements in Platinum Electroforming",
    "2024-08 Panyu Tech Discussion (China) - on Jewellery Applications of Platinum Innovations",
    "2024-01 CIBJO Jewellery Industry Voices, Vicenza January (Italy)- on The Technology of Traceability",
    "2025-02 Inhorgenta Munich (Germany)- on Pioneering Platinum 3D Printing",
    "2025-09 Hong Kong Jewelry Fair (China)- on Expanding Markets Through Gen Z Engagement",
  ],
  'josh-helmich': [
    "Josh Helmich is a third-generation jewelry entrepreneur and consultant who has spent more than two decades shaping the future of the global jewelry industry. Known for his vision and hands-on expertise, Josh works at the intersection of strategy, manufacturing, technology, and market development — helping companies innovate while staying true to the heritage of fine jewelry.",
    "Before founding The Helmich Luxury Group in 2018, Josh served as Vice President for multiple leading jewelry companies, where he oversaw manufacturing and the global distribution of product across the U.S., Europe, and Asia. Those years gave him a deep understanding of both the creative and commercial sides of the industry, and laid the foundation for his consulting practice.",
    "Today, The Helmich Luxury Group brings together Josh’s knowledge across wholesale and retail, design, advanced manufacturing processes, supply chain, and sustainability. He is a trusted partner to major organizations including Valterra Platinum, Platinum Guild International, De Beers, and numerous luxury brands worldwide — leading projects in metallurgy, process technologies, responsible sourcing, and traceability.",
    "At the heart of Josh’s work is a commitment to market development: creating strategies that expand consumer demand, open new channels, and position platinum and fine jewelry as aspirational, enduring, and responsibly sourced. His ability to connect innovation with market opportunity has made him a sought-after advisor to companies looking to grow and future-proof their businesses in a rapidly evolving global landscape.",
  ],
};

function toParagraphs(bioEntry) {
  if (Array.isArray(bioEntry)) {
    return bioEntry.map(p => (p || '').trim()).filter(Boolean);
  }
  if (typeof bioEntry === 'string') {
    return bioEntry
      .split(/\r?\n\s*\r?\n/)
      .map(p => p.trim())
      .filter(Boolean);
  }
  return [];
}

export default function JudgeDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { typeScale, effectiveScheme, accent } = useSettings();
  const { id, name, img } = route.params || {};

  const brand = accent === 'platafrica' ? palette.platinumNavy : palette.valterraGreen;
  const isDark = effectiveScheme === 'dark';
  const C = {
    bg: isDark ? '#0b1220' : palette.white,
    card: isDark ? '#111827' : '#fff',
    text: isDark ? '#e5e7eb' : palette.platinumNavy,
    muted: isDark ? '#94a3b8' : palette.platinum,
    border: isDark ? '#243244' : '#e5e7eb',
  };

  const source = typeof img === 'number' ? img : PLACEHOLDER;
  const paragraphs = useMemo(() => toParagraphs(BIO_MAP[id]), [id]);

  return (
    <ScrollView contentContainerStyle={[styles.page, { backgroundColor: C.bg }]}>
      <View style={[styles.header, { backgroundColor: C.card, borderColor: C.border }]}>
        <Logo variant="platafrica" />
      </View>

      <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
        <View style={styles.topRow}>
          <Text
            style={[
              styles.name,
              { fontSize: Math.round(styles.name.fontSize * typeScale), color: C.text }
            ]}
          >
            {name || 'Judge'}
          </Text>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={[styles.closeBtn, { borderColor: C.border, backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}>
            <Ionicons name="close" size={24} color={C.text} />
          </Pressable>
        </View>

        <Image source={source} style={styles.hero} />

        <View style={styles.section}>
          <Text
            style={[
              styles.h2,
              { fontSize: Math.round(styles.h2.fontSize * typeScale), color: brand }
            ]}
          >
            Biography
          </Text>
          {paragraphs.length > 0 ? (
            paragraphs.map((p, idx) => (
              <Text key={idx} style={[styles.p, { color: C.text }, idx > 0 && { marginTop: 10 }]}>
                {p}
              </Text>
            ))
          ) : (
            <Text style={[styles.p, { color: C.text }]}>Bio coming soon.</Text>
          )}
        </View>
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
  page: { padding: 20 },
  header: { padding: 16, borderRadius: 14, marginBottom: 16, ...cardShadow, borderWidth: 1 },
  card: { padding: 16, borderRadius: 14, ...cardShadow, borderWidth: 1 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  closeBtn: { padding: 6, borderRadius: 8, borderWidth: 1 },

  name: { fontSize: 22, fontWeight: '900' },
  hero: { width: '100%', height: 320, borderRadius: 12, marginTop: 12, resizeMode: 'cover' },

  section: { marginTop: 16 },
  h2: { fontSize: 18, fontWeight: '800' },
  p: { lineHeight: 22 },
});
