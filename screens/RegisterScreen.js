// screens/RegisterScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import Logo from "../components/Logo";
import { palette } from "../theme";
import { useAuth } from "../auth";
import { auth } from "../firebaseConfig";
import { updateProfile } from "firebase/auth";

export default function RegisterScreen({ navigation }) {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Pull signUp (sends verification email) and signOut (so we return to auth stack)
  const { signUp, signOut } = useAuth();

  const submit = async () => {
    if (!fullname.trim() || !email.trim() || !pwd.trim() || !confirm.trim()) {
      Alert.alert("Validation", "Please fill all fields.");
      return;
    }
    if (pwd !== confirm) {
      Alert.alert("Validation", "Passwords do not match.");
      return;
    }

    try {
      setSubmitting(true);

      // Create the account + send verification email (handled inside signUp)
      const res = await signUp(email.trim(), pwd);

      // Optional: set displayName on the Firebase user (while they are still signed in)
      if (auth.currentUser && fullname.trim()) {
        await updateProfile(auth.currentUser, { displayName: fullname.trim() });
      }

      if (res?.ok) {
        // ✅ Option A: immediately sign out so the stack shows Login/Register
        await signOut();

        Alert.alert(
          "Verify your email",
          "We’ve sent a verification link to your inbox. Please verify, then log in.",
          [{ text: "OK", onPress: () => navigation.replace("Login") }]
        );
      } else {
        Alert.alert("Sign up failed", res?.message ?? "Please try again.");
      }
    } catch (e) {
      Alert.alert("Sign up failed", e?.message ?? "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.card}>
        <Logo />
        <Text style={styles.h1}>Create Account</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={fullname}
            onChangeText={setFullname}
            placeholder="John Doe"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              value={pwd}
              onChangeText={setPwd}
              placeholder="••••••••"
              secureTextEntry={!showPwd}
              style={[styles.input, { paddingRight: 44 }]}
            />
            <TouchableOpacity
              onPress={() => setShowPwd((v) => !v)}
              style={styles.eyeBtn}
              accessibilityLabel="Toggle password visibility"
            >
              <Text style={{ fontSize: 18, color: palette.platinum }}>
                {showPwd ? "🙈" : "👁"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.passwordWrap}>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="••••••••"
              secureTextEntry={!showConfirm}
              style={[styles.input, { paddingRight: 44 }]}
            />
            <TouchableOpacity
              onPress={() => setShowConfirm((v) => !v)}
              style={styles.eyeBtn}
              accessibilityLabel="Toggle confirm password visibility"
            >
              <Text style={{ fontSize: 18, color: palette.platinum }}>
                {showConfirm ? "🙈" : "👁"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary, submitting && { opacity: 0.7 }]}
          onPress={submit}
          disabled={submitting}
        >
          <Text style={styles.btnText}>
            {submitting ? "Sending..." : "Register"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.replace("Login")}
          style={{ marginTop: 14 }}
        >
          <Text style={{ color: palette.valterraGreen, textAlign: "center" }}>
            Already have an account? Login here
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: palette.white,
  },
  card: {
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  h1: {
    fontSize: 28,
    color: palette.valterraGreen,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  field: { marginBottom: 12 },
  label: { fontSize: 14, color: palette.platinum, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: palette.platinum,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  passwordWrap: { position: "relative", justifyContent: "center" },
  eyeBtn: {
    position: "absolute",
    right: 10,
    height: "100%",
    justifyContent: "center",
  },
  btn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
    borderWidth: 1,
    borderColor: "transparent",
  },
  btnPrimary: { backgroundColor: palette.valterraGreen },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
