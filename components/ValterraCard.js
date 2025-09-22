import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ValterraCard({ title, subtitle, children }) {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0E1525',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#20304A',
  },
  title: {
    color: '#E6EDF3',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#A9B1BB',
    fontSize: 14,
    marginBottom: 12,
  },
  content: {
    gap: 8,
  },
});
