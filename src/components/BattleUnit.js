import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';
import { ELEMENTS, STATUS_EFFECTS } from '../constants/elements';
import HealthBar from './HealthBar';

export default function BattleUnit({ unit, isActive, isEnemy, onPress }) {
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(1)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 4, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const flash = () => {
    Animated.sequence([
      Animated.timing(flashAnim, { toValue: 0.3, duration: 100, useNativeDriver: true }),
      Animated.timing(flashAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  if (!unit) return null;

  const elementColor = COLORS.elements[unit.element] ?? '#888';
  const isDead = unit.isDead;
  const hpPct = unit.currentHp / unit.maxHp;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateX: shakeAnim }], opacity: isDead ? 0.3 : 1 },
      ]}
    >
      <Animated.View
        style={[
          styles.card,
          isActive && styles.activeCard,
          isEnemy && styles.enemyCard,
          { opacity: flashAnim },
        ]}
      >
        {/* Active indicator */}
        {isActive && <View style={styles.activePulse} />}

        {/* Element bar */}
        <View style={[styles.elemBar, { backgroundColor: elementColor }]} />

        {/* Status effects */}
        {unit.statusEffects && unit.statusEffects.length > 0 && (
          <View style={styles.effectsRow}>
            {unit.statusEffects.slice(0, 4).map((eff, i) => (
              <Text key={i} style={styles.effectIcon}>
                {STATUS_EFFECTS[eff.type]?.icon ?? '?'}
              </Text>
            ))}
          </View>
        )}

        {/* Avatar */}
        <Text style={[styles.emoji, isDead && styles.deadEmoji]}>{unit.emoji}</Text>

        {/* Name */}
        <Text style={styles.name} numberOfLines={1}>{unit.name}</Text>

        {/* Level */}
        <Text style={styles.level}>Lv.{unit.level}</Text>

        {/* HP bar */}
        <View style={styles.hpContainer}>
          <HealthBar current={unit.currentHp} max={unit.maxHp} showText={false} height={6} />
          <Text style={styles.hpText}>
            {Math.floor(hpPct * 100)}%
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 4,
  },
  card: {
    width: 88,
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    overflow: 'hidden',
  },
  activeCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  enemyCard: {
    borderColor: '#5A2020',
  },
  activePulse: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  elemBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderRadius: 1,
  },
  effectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 2,
    minHeight: 14,
  },
  effectIcon: { fontSize: 10, marginHorizontal: 1 },
  emoji: { fontSize: 32, marginVertical: 4 },
  deadEmoji: { opacity: 0.3 },
  name: {
    color: COLORS.text,
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  level: {
    color: COLORS.textMuted,
    fontSize: 8,
    marginBottom: 4,
  },
  hpContainer: {
    width: '100%',
  },
  hpText: {
    color: COLORS.textMuted,
    fontSize: 8,
    textAlign: 'center',
    marginTop: 1,
  },
});
