import { useMemo } from 'react';
import { useSettings } from './context/SettingsContext';

// Accent palette
const ACCENTS = {
  valterra: '#007179',     // Valterra green
  platafrica: '#00B26B',   // PlatAfrica parakeet
};

// LIGHT tokens (kept close to your original palette)
const light = {
  bg: '#FFFFFF',
  card: '#FFFFFF',
  text: '#001C48',          // platinum-navy
  muted: '#73929B',         // platinum
  border: '#d1d5db',
  shadow: 'rgba(0,0,0,0.1)',
  // legacy aliases for your code:
  white: '#FFFFFF',
  platinumNavy: '#001C48',
  platinum: '#73929B',
};

// DARK tokens
const dark = {
  bg: '#0B1220',
  card: '#0F172A',
  text: '#E5E7EB',
  muted: '#94A3B8',
  border: '#1F2937',
  shadow: 'rgba(0,0,0,0.5)',
  white: '#0B1220',        // keep alias to avoid crashes
  platinumNavy: '#E5E7EB', // flip for readability
  platinum: '#94A3B8',
};

// Hook to get themed colors (with accent + density)
export function useTheme() {
  const { effectiveScheme, accent, density } = useSettings();
  const colors = useMemo(() => {
    const base = effectiveScheme === 'dark' ? dark : light;
    const brand = ACCENTS[accent] || ACCENTS.valterra;
    return {
      ...base,
      brand,
      valterraGreen: brand, // alias so old code using palette.valterraGreen can be replaced gradually
    };
  }, [effectiveScheme, accent]);

  return {
    colors,
    density,
    isDark: effectiveScheme === 'dark',
  };
}

// For legacy imports that still do: import { palette } from '../theme'
export const palette = {
  white: light.white,
  platinumNavy: light.platinumNavy,
  platinum: light.platinum,
  valterraGreen: ACCENTS.valterra,
};
