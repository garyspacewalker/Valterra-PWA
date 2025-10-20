// lib/analytics.js
const DEBUG = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

export function logScreen(name, params = {}) {
  if (DEBUG) console.log('[screen]', name, params);
}

export function logEvent(name, params = {}) {
  if (DEBUG) console.log('[event]', name, params);
}
