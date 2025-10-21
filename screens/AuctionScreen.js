// screens/AuctionScreen.js
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";

import Logo from "../components/Logo";
import { palette } from "../theme";
import { useSettings } from "../context/SettingsContext";
import RemoteImage from "../components/RemoteImage";
import { fetchAuctionItems } from "../lib/directus";

/* ──────────────────────────────────────────────────────────────
   Helpers
─────────────────────────────────────────────────────────────── */
const LIVE_URL = "https://app.platafrica.online/";
const norm = (v) => (v == null ? "" : String(v).trim().toLowerCase());

function useThemeColors() {
  const { effectiveScheme, accent } = useSettings();
  const isDark = effectiveScheme === "dark";
  const brand = accent === "platafrica" ? palette.platinumNavy : palette.valterraGreen;
  return {
    isDark,
    brand,
    bg: isDark ? "#0b1220" : palette.white,
    card: isDark ? "#111827" : "#fff",
    text: isDark ? "#e5e7eb" : palette.platinumNavy,
    muted: isDark ? "#94a3b8" : palette.platinum,
    border: isDark ? "#243244" : "#e5e7eb",
  };
}

/* ──────────────────────────────────────────────────────────────
   Screen (Search-only, fully scrollable header like other screens)
─────────────────────────────────────────────────────────────── */
export default function AuctionScreen() {
  const C = useThemeColors();

  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const rows = await fetchAuctionItems({ limit: 200, status: "active", sort: "-id" });
        if (!alive) return;
        setItems(rows || []);
        if (__DEV__ && rows?.length) {
          const s = rows[0];
          console.log("[Auction] sample", {
            id: s.id,
            title: s.title,
            price: s.price,
            company: s.company,
            jeweller: s.jeweller,
          });
        }
      } catch (e) {
        if (!alive) return;
        setErr(e?.message || "Failed to load auction items");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = norm(query);
    if (!q) return items;
    return items.filter((it) => {
      const hay = `${it.title || ""} ${it.company || ""} ${it.jeweller || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  const openUrl = async (url) => url && (await WebBrowser.openBrowserAsync(url));

  const renderCard = ({ item }) => (
    <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
      <TouchableOpacity activeOpacity={0.85} onPress={() => openUrl(item.imageUrl)}>
        <RemoteImage
          remoteUri={item.imageUrl}
          fallbackSource={require("../assets/icon.png")}
          style={styles.image}
        />
      </TouchableOpacity>

      <Text style={[styles.title, { color: C.brand }]}>{item.title}</Text>

      <View style={styles.rowWrap}>
        {!!item.jeweller && <Text style={[styles.meta, { color: C.text }]}>Jeweller: {item.jeweller}</Text>}
        {!!item.company && <Text style={[styles.meta, { color: C.text }]}>Company: {item.company}</Text>}
      </View>

      {/* Price removed as requested */}

      {!!item.description && <Text style={[styles.desc, { color: C.muted }]}>{item.description}</Text>}
    </View>
  );

  const ListHeader = (
    <>
      {/* ── PlatAfrica logo header ── */}
      <View style={[styles.header, { backgroundColor: C.card, borderColor: C.border }]}>
        <Logo variant="platafrica" />
      </View>

      {/* Search bar + count + live-link notice */}
      <View style={[styles.toolbar, { backgroundColor: C.card, borderBottomColor: C.border }]}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search title, company or jeweller"
          placeholderTextColor={C.muted}
          style={[styles.search, { borderColor: C.border, backgroundColor: C.card, color: C.text }]}
          autoCapitalize="none"
          returnKeyType="search"
        />
        <Text style={{ color: C.muted }}>
          Showing {filtered.length} item{filtered.length === 1 ? "" : "s"}
        </Text>

        <TouchableOpacity onPress={() => openUrl(LIVE_URL)} activeOpacity={0.7}>
          <Text style={[styles.linkText, { color: C.brand }]}>
            Looking to buy? View & bid on the live auction at app.platafrica.online
          </Text>
        </TouchableOpacity>

        {!!err && <Text style={[styles.error, { color: "crimson" }]}>{err}</Text>}
      </View>
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <FlatList
        data={filtered}
        keyExtractor={(x) => String(x.id)}
        renderItem={renderCard}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ padding: 16, paddingTop: 0, backgroundColor: C.bg }}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          !err ? (
            <View style={{ paddingTop: 40, alignItems: "center" }}>
              <Text style={{ color: C.muted }}>{items.length ? "No results" : "Loading auction items…"}</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

/* ──────────────────────────────────────────────────────────────
   Styles
─────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  error: { paddingTop: 4 },

  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderRadius: 14,
    margin: 16,
    marginBottom: 0,
    borderWidth: 1,
  },

  toolbar: { padding: 16, gap: 8, borderBottomWidth: 1, marginHorizontal: 16, marginBottom: 12, borderRadius: 12 },
  search: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  linkText: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "800",
    textDecorationLine: "underline",
  },

  card: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  image: { width: "100%", height: 220, borderRadius: 8, backgroundColor: "#11111111" },
  title: { marginTop: 8, fontWeight: "800", fontSize: 16 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 },
  meta: { fontSize: 13 },
  // price style kept (unused) in case you re-enable it later:
  price: { marginTop: 6, fontWeight: "900", fontSize: 16 },
  desc: { marginTop: 8, lineHeight: 20, fontSize: 13 },
});
