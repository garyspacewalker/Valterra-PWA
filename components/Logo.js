import React from 'react';
import { Image, View, StyleSheet } from 'react-native';

export default function Logo({ size = 160 }) {
  const source = require('../assets/valterra-logo.png'); // make sure the file exists
  return (
    <View style={styles.wrap}>
      <Image source={source} style={{ width: size, height: size, resizeMode: 'contain' }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', marginBottom: 12 },
});
