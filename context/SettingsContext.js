// context/SettingsContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

const STORAGE_KEY = '@valterra.settings';
const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  // Appearance
  const [themeMode, setThemeMode] = useState('system'); // 'system' | 'light' | 'dark'
  const [accent, setAccent] = useState('valterra');     // 'valterra' | 'platafrica'
  // Layout / accessibility
  const [density, setDensity] = useState('comfortable'); // 'comfortable' | 'compact'
  const [reduceMotion, setReduceMotion] = useState(false);
  const [largeType, setLargeType] = useState(false);     // Large text for headings

  const systemScheme = Appearance.getColorScheme() || 'light';

  // Load persisted settings
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const saved = JSON.parse(raw);
        if (saved.themeMode) setThemeMode(saved.themeMode);
        if (saved.accent) setAccent(saved.accent);
        if (saved.density) setDensity(saved.density);
        if (typeof saved.reduceMotion === 'boolean') setReduceMotion(saved.reduceMotion);
        if (typeof saved.largeType === 'boolean') setLargeType(saved.largeType);
      } catch { /* noop */ }
    })();
  }, []);

  // Persist settings
  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ themeMode, accent, density, reduceMotion, largeType })
    ).catch(() => {});
  }, [themeMode, accent, density, reduceMotion, largeType]);

  // Derived values
  const effectiveScheme = useMemo(() => {
    if (themeMode === 'dark' || themeMode === 'light') return themeMode;
    return systemScheme;
  }, [themeMode, systemScheme]);

  // Scale up type when Large Text is enabled
  const typeScale = largeType ? 1.16 : 1.0;

  const value = useMemo(
    () => ({
      // state
      themeMode, setThemeMode,
      accent, setAccent,
      density, setDensity,
      reduceMotion, setReduceMotion,
      largeType, setLargeType,
      // derived
      effectiveScheme,
      typeScale,
    }),
    [themeMode, accent, density, reduceMotion, largeType, effectiveScheme, typeScale]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
