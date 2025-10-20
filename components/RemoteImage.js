// components/RemoteImage.js
import React from 'react';
import { StyleSheet } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

// Soft placeholder while images load
const GENERIC_BLURHASH = 'L5H2EC=PM+yV0g-mq.wG9c010J}I';

/**
 * Usage options this component supports:
 *  - <RemoteImage source={require('../assets/pic.jpg')} />
 *  - <RemoteImage source={{ uri: 'https://...' }} />
 *  - <RemoteImage uri="https://..." />
 *  - <RemoteImage src="https://..." />
 */
export default function RemoteImage(props) {
  const {
    source,
    uri,
    src,
    style,
    resizeMode,       // 'cover' | 'contain' | 'center' | ...
    contentFit,       // override expo-image fit
    placeholder = GENERIC_BLURHASH,
    transition = 200,
    ...rest
  } = props;

  // Normalize source
  let finalSource = source;
  if (!finalSource && uri) finalSource = { uri };
  if (!finalSource && src) {
    finalSource = typeof src === 'string' ? { uri: src } : src;
  }
  if (!finalSource) return null;

  // Map react-native Image resizeMode to expo-image contentFit (if needed)
  const fit =
    contentFit ||
    (resizeMode === 'contain'
      ? 'contain'
      : resizeMode === 'center'
      ? 'contain'
      : 'cover');

  return (
    <ExpoImage
      source={finalSource}
      style={[styles.img, style]}
      contentFit={fit}
      placeholder={placeholder}
      transition={transition}
      cachePolicy="memory-disk"
      allowDownscaling
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  img: { width: '100%', height: 200, borderRadius: 10 },
});
