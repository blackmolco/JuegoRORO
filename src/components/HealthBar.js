import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function HealthBar({ current, max, showText = true, height = 8 }) {
  const pct = Math.max(0, Math.min(1, current / max));
  const color = pct > 0.5 ? COLORS.hp : pct > 0.25 ? COLORS.hpMid : COLORS.hpLow;

  return (
    <View>
      <View style={[styles.track, { height }]}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color, height }]} />
      </View>
      {showText && (
        <Text style={styles.label}>
          {current} / {max}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    backgroundColor: '#1A2235',
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: 4,
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
});
