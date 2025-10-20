// screens/AuctionScreen.js
import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";

import { palette } from "../theme";
import { useSettings } from "../context/SettingsContext";
import RemoteImage from "../components/RemoteImage";
import { fetchAuctionItems } from "../lib/directus";

/* ──────────────────────────────────────────────────────────────
   Helpers
─────────────────────────────────────────────────────────────── */
const fmtZAR = (n) => {
  if (n == null || isNaN(Number(n))) return "";
  try {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      maximumFractionDigits: 0,
    }).format(Number(n));
  } catch {
    return `R ${Number(n).toFixed(0)}`;
  }
};

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
   Screen (Search-only)
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

  const openSource = async (url) => url && (await WebBrowser.openBrowserAsync(url));

  const renderCard = ({ item }) => (
    <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
      <TouchableOpacity activeOpacity={0.85} onPress={() => openSource(item.imageUrl)}>
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

      <Text style={[styles.price, { color: item.price != null ? C.brand : C.muted }]}>
        {item.price != null ? fmtZAR(item.price) : "Price: —"}
      </Text>

      {!!item.description && <Text style={[styles.desc, { color: C.muted }]}>{item.description}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Search bar + count */}
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
      </View>

      {!!err && <Text style={[styles.error, { color: "crimson" }]}>{err}</Text>}

      <FlatList
        data={filtered}
        keyExtractor={(x) => String(x.id)}
        contentContainerStyle={{ padding: 16, backgroundColor: C.bg }}
        renderItem={renderCard}
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
  error: { padding: 12 },
  toolbar: { padding: 16, gap: 8, borderBottomWidth: 1 },
  search: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
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
  price: { marginTop: 6, fontWeight: "900", fontSize: 16 },
  desc: { marginTop: 8, lineHeight: 20, fontSize: 13 },
});
