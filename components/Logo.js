import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

// Static requires so Metro can bundle both
const valterraLogo   = require('../assets/valterra-logo.png');     // keep existing
const platafricaLogo = require('../assets/platafrica-logo.png');   // <-- add this file

export default function Logo({ size = 160, variant = 'valterra' }) {
  const source = variant === 'platafrica' ? platafricaLogo : valterraLogo;
  return (
    <View style={styles.wrap}>
      <Image source={source} style={{ width: size, height: size, resizeMode: 'contain' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: 12 },
});
