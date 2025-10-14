// hooks/useOfflineImage.js
import { useEffect, useMemo, useState } from 'react';
import { Asset } from 'expo-asset';
import { useOfflineCache } from '../providers/OfflineCacheProvider';

export default function useOfflineImage(img) {
  const { getLocalFor, queue } = useOfflineCache();
  const [source, setSource] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (typeof img === 'number') {
        // Make sure static asset is ready
        try { await Asset.fromModule(img).downloadAsync(); } catch {}
        if (mounted) setSource(img);
        return;
      }
      if (typeof img === 'string') {
        const local = getLocalFor(img);
        // Queue for background caching; show remote immediately
        queue(img);
        if (mounted) setSource({ uri: local || img });
        return;
      }
      setSource(null);
    }

    run();
    return () => { mounted = false; };
  }, [img, getLocalFor, queue]);

  return source;
}
