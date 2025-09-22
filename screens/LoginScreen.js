import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Logo from '../components/Logo';
import { palette } from '../theme';
import { useAuth } from '../auth';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const { signIn } = useAuth();

  const validUser = { username: 'test@example.com', password: '123456' };

  function handleSubmit() {
    if (username.trim() === validUser.username && pwd.trim() === validUser.password) {
      Alert.alert('Login', 'Login successful!', [{ text: 'OK', onPress: () => signIn() }]);
    } else {
      Alert.alert('Login failed', 'Invalid username or password.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.card}>
        <Logo />
        <Text style={styles.h1}>Login</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
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
            <TouchableOpacity onPress={() => setShowPwd(v => !v)} style={styles.eyeBtn} accessibilityLabel="Show password">
              <Text style={{ fontSize: 18, color: palette.platinum }}>{showPwd ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleSubmit}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity
          style={[styles.btn, styles.btnOutline]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={[styles.btnText, { color: palette.valterraGreen }]}>Create an Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: { flexGrow: 1, justifyContent: 'center', padding: 20, backgroundColor: palette.white },
  card: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  h1: { fontSize: 28, color: palette.valterraGreen, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  field: { marginBottom: 12 },
  label: { fontSize: 14, color: palette.platinum, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: palette.platinum,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordWrap: { position: 'relative', justifyContent: 'center' },
  eyeBtn: { position: 'absolute', right: 10, height: '100%', justifyContent: 'center' },
  btn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  btnPrimary: { backgroundColor: palette.valterraGreen },
  btnOutline: { backgroundColor: '#fff', borderColor: palette.valterraGreen },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  divider: { height: 1, backgroundColor: palette.platinum, marginVertical: 14 },
});
