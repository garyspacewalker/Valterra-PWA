import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Button } from "react-native";
import { useAuth } from "../auth";

export default function VerifiedScreen({ navigation }) {
  const { refreshUser, emailVerified } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      await refreshUser();
      setChecking(false);
    })();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
        <Text style={{ marginTop: 8 }}>Finalizing verification…</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 24 }}>
      <Text style={{ fontSize: 18 }}>
        {emailVerified ? "Your email is verified ✅" : "We couldn’t confirm verification yet."}
      </Text>
      <Button title="Continue" onPress={() => navigation.replace("Tabs")} />
    </View>
  );
}
