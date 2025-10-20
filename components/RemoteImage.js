// components/RemoteImage.js
import React from 'react';
import { Image as ExpoImage } from 'expo-image';

// Soft, generic blurhash to show an instant preview while loading
const GENERIC_BLURHASH = 'L5H2EC=PM+yV0g-mq.wG9c010J}I';

export default function RemoteImage({ remoteUri, fallbackSource, style }) {
  if (remoteUri) {
    return (
      <ExpoImage
        source={{ uri: remoteUri }}
        style={style}
        contentFit="cover"
        placeholder={GENERIC_BLURHASH}
        transition={200}
        cachePolicy="memory-disk"
        allowDownscaling
      />
    );
  }
  return <ExpoImage source={fallbackSource} style={style} contentFit="cover" />;
}
