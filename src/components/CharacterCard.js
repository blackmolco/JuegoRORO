import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { ELEMENTS } from '../constants/elements';
import StarRating from './StarRating';

export default function CharacterCard({ character, owned, onPress, selected, compact = false }) {
  const base = character;
  if (!base) return null;

  const elementColor = COLORS.elements[base.element] ?? '#888';
  const rarityColor = COLORS.rarity[base.stars] ?? '#888';
  const level = owned?.level ?? 1;

  if (compact) {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.compact, selected && styles.compactSelected]}>
        <LinearGradient
          colors={[rarityColor + '33', '#1A2235']}
          style={styles.compactGrad}
        >
          <Text style={styles.compactEmoji}>{base.emoji}</Text>
          <View style={styles.compactBadge}>
            <Text style={[styles.compactElement, { color: elementColor }]}>
              {ELEMENTS[base.element]?.icon}
            </Text>
          </View>
          {selected && <View style={styles.selectedDot} />}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={[styles.card, selected && styles.cardSelected]}>
      <LinearGradient
        colors={[rarityColor + '44', '#1A2235', '#0A0E1A']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Element strip */}
        <View style={[styles.elementStrip, { backgroundColor: elementColor }]} />

        {/* Top: rarity + element */}
        <View style={styles.topRow}>
          <View style={[styles.elementBadge, { backgroundColor: elementColor + '33', borderColor: elementColor }]}>
            <Text style={{ fontSize: 12 }}>{ELEMENTS[base.element]?.icon}</Text>
          </View>
          <View style={[styles.starsBadge, { borderColor: rarityColor }]}>
            <Text style={[styles.starsText, { color: rarityColor }]}>{base.stars}★</Text>
          </View>
        </View>

        {/* Character emoji / avatar */}
        <Text style={styles.emoji}>{base.emoji}</Text>

        {/* Name */}
        <Text style={styles.name} numberOfLines={1}>{base.name}</Text>
        <Text style={styles.title} numberOfLines={1}>{base.title}</Text>

        {/* Stars */}
        <View style={styles.starsRow}>
          <StarRating stars={base.stars} size={10} />
        </View>

        {/* Level if owned */}
        {owned && (
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Lv.{level}</Text>
          </View>
        )}

        {selected && <View style={styles.selectedOverlay} />}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 110,
    height: 155,
    borderRadius: 12,
    overflow: 'hidden',
    margin: 6,
    borderWidth: 1,
    borderColor: '#253045',
  },
  cardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  gradient: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
  },
  elementStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 4,
    marginTop: 6,
  },
  elementBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsBadge: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  starsText: { fontSize: 9, fontWeight: 'bold' },
  emoji: { fontSize: 40, marginVertical: 4 },
  name: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    color: COLORS.textMuted,
    fontSize: 8,
    textAlign: 'center',
    marginTop: 2,
  },
  starsRow: { marginTop: 4 },
  levelBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  levelText: { color: COLORS.primary, fontSize: 9, fontWeight: 'bold' },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.primary + '22',
    borderRadius: 12,
  },
  // Compact styles
  compact: {
    width: 58,
    height: 58,
    borderRadius: 8,
    overflow: 'hidden',
    margin: 4,
    borderWidth: 1,
    borderColor: '#253045',
  },
  compactSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  compactGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactEmoji: { fontSize: 26 },
  compactBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  compactElement: { fontSize: 10 },
  selectedDot: {
    position: 'absolute',
    bottom: 3,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
});
