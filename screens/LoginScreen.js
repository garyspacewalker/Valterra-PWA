import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView,
} from "react-native";
import Logo from "../components/Logo";
import { palette } from "../theme";
import { useAuth } from "../auth";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signIn, resendVerification } = useAuth();

  async function handleSubmit() {
    if (!email.trim() || !pwd.trim()) {
      Alert.alert("Validation", "Enter email and password.");
      return;
    }
    try {
      setLoading(true);
      const res = await signIn(email.trim(), pwd);
      if (!res?.ok) {
        Alert.alert("Login failed", res?.message ?? "Please try again.");
      }
    } catch (e) {
      Alert.alert("Login failed", e?.message ?? "Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const handleResend = async () => {
    try {
      await resendVerification();
      Alert.alert("Verification email sent", "Check your inbox and spam folder.");
    } catch {
      Alert.alert("Could not resend", "Try logging in again to trigger a new email.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.card}>
        <Logo />
        <Text style={styles.h1}>Login</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email} onChangeText={setEmail} placeholder="you@example.com"
            autoCapitalize="none" keyboardType="email-address" style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              value={pwd} onChangeText={setPwd} placeholder="••••••••"
              secureTextEntry={!showPwd} style={[styles.input, { paddingRight: 44 }]}
            />
            <TouchableOpacity onPress={() => setShowPwd(v => !v)} style={styles.eyeBtn} accessibilityLabel="Show password">
              <Text style={{ fontSize: 18, color: palette.platinum }}>{showPwd ? "🙈" : "👁"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[styles.btn, styles.btnPrimary, loading && { opacity: 0.7 }]} onPress={handleSubmit} disabled={loading}>
          <Text style={styles.btnText}>{loading ? "Signing in..." : "Login"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend} style={{ marginTop: 10 }}>
          <Text style={{ color: palette.platinum, textAlign: "center" }}>
            Didn’t receive the email? Tap to resend.
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={() => navigation.navigate("Register")}>
          <Text style={[styles.btnText, { color: palette.valterraGreen }]}>Create an Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, justifyContent: "center", padding: 20, backgroundColor: palette.white },
  card: {
    width: "100%", maxWidth: 900, alignSelf: "center", backgroundColor: "#fff",
    padding: 24, borderRadius: 14, shadowColor: "#000", shadowOpacity: 0.08,
    shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2,
  },
  h1: { fontSize: 28, color: palette.valterraGreen, fontWeight: "700", marginBottom: 12, textAlign: "center" },
  field: { marginBottom: 12 },
  label: { fontSize: 14, color: palette.platinum, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: palette.platinum, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, backgroundColor: "#fff",
  },
  passwordWrap: { position: "relative", justifyContent: "center" },
  eyeBtn: { position: "absolute", right: 10, height: "100%", justifyContent: "center" },
  btn: {
    paddingVertical: 12, borderRadius: 10, alignItems: "center", marginTop: 6,
    borderWidth: 1, borderColor: "transparent",
  },
  btnPrimary: { backgroundColor: palette.valterraGreen },
  btnOutline: { backgroundColor: "#fff", borderColor: palette.valterraGreen },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  divider: { height: 1, backgroundColor: palette.platinum, marginVertical: 14 },
});
