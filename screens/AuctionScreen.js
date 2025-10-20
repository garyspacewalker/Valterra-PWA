import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";
import { palette } from "../theme";

import RemoteImage from "../components/RemoteImage";
import { fetchAuctionItems } from "../lib/directus";

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

export default function AuctionScreen() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("All");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  useEffect(() => {
    let mounted = true;
    fetchAuctionItems({ limit: 200 })
      .then((rows) => {
        if (!mounted) return;
        setItems(rows);
        if (__DEV__) {
          const s = rows?.[0];
          console.log("Auction sample (mapped):", {
            id: s?.id, title: s?.title, price: s?.price, priceKey: s?.priceKey, imageUrl: s?.imageUrl,
          });
        }
      })
      .catch((e) => mounted && setErr(e.message || "Failed to load auction items"));
    return () => { mounted = false; };
  }, []);

  const companyChips = useMemo(() => {
    const s = new Set();
    items.forEach((i) => i.company && s.add(i.company));
    return ["All", ...Array.from(s)];
  }, [items]);

  const jewellerChips = useMemo(() => {
    const s = new Set();
    items.forEach((i) => i.jeweller && s.add(i.jeweller));
    return ["All", ...Array.from(s)];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = priceMin ? Number(priceMin) : null;
    const max = priceMax ? Number(priceMax) : null;
    return items.filter((it) => {
      if (q) {
        const hay = `${it.title ?? ""} ${it.company ?? ""} ${it.jeweller ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (filterType === "company" && filterValue !== "All" && (it.company || "") !== filterValue) return false;
      if (filterType === "jeweller" && filterValue !== "All" && (it.jeweller || "") !== filterValue) return false;

      const price = it.price != null ? Number(it.price) : null;
      if (min != null && !isNaN(min) && price != null && price < min) return false;
      if (max != null && !isNaN(max) && price != null && price > max) return false;

      return true;
    });
  }, [items, query, filterType, filterValue, priceMin, priceMax]);

  const openSource = async (url) => {
    if (!url) return;
    await WebBrowser.openBrowserAsync(url);
  };

  const renderCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => openSource(item.imageUrl)}>
          <RemoteImage
            remoteUri={item.imageUrl}
            fallbackSource={require("../assets/icon.png")}
            style={styles.image}
          />
        </TouchableOpacity>

        {/* TEMP: if image still doesn’t render, show URL as text to confirm */}
        {__DEV__ && !item.imageUrl && (
          <Text style={{ color: "crimson", marginTop: 6 }}>No imageUrl for this item</Text>
        )}

        <Text style={styles.title}>{item.title}</Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 2 }}>
          {!!item.jeweller && <Text style={styles.meta}>Jeweller: {item.jeweller}</Text>}
          {!!item.company && <Text style={styles.meta}>Company: {item.company}</Text>}
          {item.price != null && (
            <Text style={[styles.meta, { fontWeight: "700" }]}>{fmtZAR(item.price)}</Text>
          )}
        </View>

        {/* TEMP: show key for price (remove later) */}
        {__DEV__ && item.price != null && item.priceKey && (
          <Text style={{ color: "#9aa4b2", marginTop: 2, fontSize: 12 }}>price from: {item.priceKey}</Text>
        )}

        {!!item.description && <Text style={styles.desc}>{item.description}</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.white }}>
      <View style={styles.toolbar}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search title, company or jeweller"
          placeholderTextColor="#9aa4b2"
          style={styles.search}
          autoCapitalize="none"
          returnKeyType="search"
        />

        <View style={styles.segment}>
          <Chip label="All" active={filterType === "all"} onPress={() => { setFilterType("all"); setFilterValue("All"); }} />
          <Chip label="Company" active={filterType === "company"} onPress={() => { setFilterType("company"); setFilterValue("All"); }} />
          <Chip label="Jeweller" active={filterType === "jeweller"} onPress={() => { setFilterType("jeweller"); setFilterValue("All"); }} />
        </View>

        {filterType === "company" && (
          <ChipRow data={companyChips} value={filterValue} onChange={setFilterValue} />
        )}
        {filterType === "jeweller" && (
          <ChipRow data={jewellerChips} value={filterValue} onChange={setFilterValue} />
        )}

        <View style={styles.priceRow}>
          <TextInput value={priceMin} onChangeText={setPriceMin} keyboardType="numeric" placeholder="Min price" style={styles.priceInput} />
          <TextInput value={priceMax} onChangeText={setPriceMax} keyboardType="numeric" placeholder="Max price" style={styles.priceInput} />
        </View>
      </View>

      {!!err && <Text style={styles.error}>{err}</Text>}

      <FlatList
        data={filtered}
        keyExtractor={(x) => String(x.id)}
        contentContainerStyle={{ padding: 16 }}
        renderItem={renderCard}
        ListEmptyComponent={
          !err ? (
            <View style={{ paddingTop: 40, alignItems: "center" }}>
              <Text style={{ color: palette.platinum }}>
                {items.length ? "No results" : "Loading auction items…"}
              </Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

function Chip({ label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.chip, active ? styles.chipActive : styles.chipIdle]}>
      <Text style={active ? styles.chipTextActive : styles.chipTextIdle}>{label}</Text>
    </TouchableOpacity>
  );
}
function ChipRow({ data, value, onChange }) {
  return (
    <View style={styles.chipRow}>
      {data.map((label) => (
        <Chip key={label} label={label} active={value === label} onPress={() => onChange(label)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  error: { color: "crimson", padding: 12 },
  toolbar: { padding: 16, gap: 10, borderBottomWidth: 1, borderBottomColor: "#e5e7eb", backgroundColor: "#fff" },
  search: { borderWidth: 1, borderColor: palette.platinum, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, backgroundColor: "#fff" },
  segment: { flexDirection: "row", gap: 8, marginTop: 4 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  chip: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 999, borderWidth: 1 },
  chipIdle: { backgroundColor: "#fff", borderColor: palette.platinum },
  chipActive: { backgroundColor: palette.valterraGreen, borderColor: palette.valterraGreen },
  chipTextIdle: { color: palette.platinumNavy, fontWeight: "600" },
  chipTextActive: { color: "#fff", fontWeight: "700" },
  priceRow: { flexDirection: "row", gap: 10 },
  priceInput: { flex: 1, borderWidth: 1, borderColor: palette.platinum, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#fff" },
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 12, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  image: { width: "100%", height: 220, borderRadius: 8, backgroundColor: "#eee" },
  title: { marginTop: 8, fontWeight: "700", fontSize: 16, color: palette.valterraGreen },
  meta: { color: palette.platinumNavy },
  desc: { color: palette.platinum, marginTop: 6 },
});
