import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/colors';
import { SKILLS } from '../data/skills';

export default function SkillButton({ skillId, cooldown, onPress, index }) {
  const skill = SKILLS[skillId];
  if (!skill) return null;

  const onCooldown = cooldown > 0;
  const labels = ['I', 'II', 'III'];

  return (
    <TouchableOpacity
      onPress={onCooldown ? null : onPress}
      style={[styles.wrapper, onCooldown && styles.disabled]}
      activeOpacity={onCooldown ? 1 : 0.7}
    >
      <LinearGradient
        colors={onCooldown ? ['#1A2235', '#0F1620'] : ['#1E3A5F', '#0F2040']}
        style={styles.button}
      >
        {onCooldown && (
          <View style={styles.cooldownOverlay}>
            <Text style={styles.cooldownText}>{cooldown}</Text>
          </View>
        )}
        <Text style={styles.label}>{labels[index] ?? 'I'}</Text>
        <Text style={styles.skillName} numberOfLines={2}>{skill.name}</Text>
        {skill.cooldown > 0 && (
          <Text style={styles.cdInfo}>CD:{skill.cooldown}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 4,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#253045',
    minHeight: 70,
  },
  disabled: {
    opacity: 0.5,
    borderColor: '#1A2235',
  },
  button: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cooldownOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderRadius: 10,
  },
  cooldownText: {
    color: COLORS.textMuted,
    fontSize: 22,
    fontWeight: 'bold',
  },
  label: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  skillName: {
    color: COLORS.text,
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
  cdInfo: {
    color: COLORS.textMuted,
    fontSize: 9,
    marginTop: 2,
  },
});
