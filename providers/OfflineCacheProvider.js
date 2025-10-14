// providers/OfflineCacheProvider.js
import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

// Simple hash for filenames
function hash(s) {
  let h = 0, i, chr;
  if (s.length === 0) return h.toString();
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    h = (h << 5) - h + chr;
    h |= 0;
  }
  return String(h);
}

const OfflineCacheContext = createContext(null);

export function OfflineCacheProvider({ children }) {
  const [map, setMap] = useState({}); // { remoteUri: localFileUri }
  const [caching, setCaching] = useState(false);
  const [clearing, setClearing] = useState(false);
  const queued = useRef(new Set());

  // Load previously cached index if you want (optional)
  // For brevity, we rebuild map from filesystem on demand.

  async function cacheUri(uri) {
    if (!uri || typeof uri !== 'string' || uri.startsWith('file://')) return uri;
    const dir = FileSystem.cacheDirectory + 'offline/';
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true }).catch(() => {});
    const file = `${dir}${hash(uri)}.bin`;

    // If already exists, use it
    try {
      const info = await FileSystem.getInfoAsync(file);
      if (info.exists) return file;
    } catch {}

    // Download
    const { uri: local } = await FileSystem.downloadAsync(uri, file);
    return local;
  }

  // Public: resolve an image source
  async function resolveSource(img) {
    if (typeof img === 'number') {
      // static asset -> ensure loaded
      await Asset.fromModule(img).downloadAsync().catch(() => {});
      return img;
    }
    if (typeof img === 'string') {
      const local = await cacheUri(img);
      return { uri: local || img };
    }
    return null;
  }

  // Queue a remote url for background cache
  function queue(uri) {
    if (!uri || queued.current.has(uri)) return;
    queued.current.add(uri);
    // Fire & forget
    cacheUri(uri)
      .then(local => {
        if (local) setMap(prev => ({ ...prev, [uri]: local }));
      })
      .catch(() => {});
  }

  // Warm cache for assets/data you know ahead of time
  async function warmCache() {
    try {
      setCaching(true);
      // 1) Static bundled assets you want ready (edit these as needed):
      // Example logos / theme images / placeholders
      const statics = [
        require('../assets/icon.png'),
        require('../assets/platafrica-logo.png'),
        // Theme images example (if used):
        // require('../assets/theme/new-horizon-hero.png'),
        // require('../assets/theme/new-horizon-radiate.png'),
        // require('../assets/theme/new-horizon-explainer.png'),
        // require('../assets/theme/expressive-white.png'),
        // require('../assets/theme/platinum-rare.png'),
      ];
      await Asset.loadAsync(statics);

      // 2) Any remote images/JSON you've registered via queue()
      const uris = Array.from(queued.current);
      for (const u of uris) {
        const local = await cacheUri(u);
        if (local) setMap(prev => ({ ...prev, [u]: local }));
      }
    } finally {
      setCaching(false);
    }
  }

  async function clearCache() {
    try {
      setClearing(true);
      await FileSystem.deleteAsync(FileSystem.cacheDirectory + 'offline/', { idempotent: true });
      setMap({});
      queued.current.clear();
    } finally {
      setClearing(false);
    }
  }

  const value = useMemo(
    () => ({
      getLocalFor: (uri) => map[uri],
      resolveSource,
      queue,
      warmCache,
      clearCache,
      caching,
      clearing,
    }),
    [map, caching, clearing]
  );

  return (
    <OfflineCacheContext.Provider value={value}>
      {children}
    </OfflineCacheContext.Provider>
  );
}

export function useOfflineCache() {
  return useContext(OfflineCacheContext);
}
