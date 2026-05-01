import React, { useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/useGameStore';
import { COLORS } from '../constants/colors';

const MenuButton = ({ icon, label, sublabel, onPress, gradient }) => (
  <TouchableOpacity onPress={onPress} style={styles.menuBtn} activeOpacity={0.8}>
    <LinearGradient colors={gradient} style={styles.menuBtnGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <Text style={styles.menuIcon}>{icon}</Text>
      <View>
        <Text style={styles.menuLabel}>{label}</Text>
        {sublabel ? <Text style={styles.menuSub}>{sublabel}</Text> : null}
      </View>
      <Text style={styles.arrow}>›</Text>
    </LinearGradient>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const { loadGame, isLoaded, playerName, playerLevel, playerExp, gold, crystals, energy, maxEnergy } = useGameStore();

  useEffect(() => {
    if (!isLoaded) loadGame();
  }, []);

  if (!isLoaded) {
    return (
      <LinearGradient colors={['#0A0E1A', '#141928']} style={styles.loading}>
        <Text style={styles.loadingText}>⚓ Cargando Grand Line Legends...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0A0E1A', '#0E1525', '#141928']} style={styles.root}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#0D1A33', '#0A0E1A']}
          style={styles.header}
        >
          <View style={styles.titleRow}>
            <Text style={styles.titleMain}>🏴‍☠️ Grand Line</Text>
            <Text style={styles.titleSub}>LEGENDS</Text>
          </View>

          {/* Player info bar */}
          <View style={styles.infoBar}>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>👤</Text>
              <View>
                <Text style={styles.infoLabel}>{playerName}</Text>
                <Text style={styles.infoValue}>Nv. {playerLevel}</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>💎</Text>
              <View>
                <Text style={styles.infoLabel}>Cristales</Text>
                <Text style={[styles.infoValue, { color: '#5B9CF6' }]}>{crystals.toLocaleString()}</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoIcon}>🪙</Text>
              <View>
                <Text style={styles.infoLabel}>Oro</Text>
                <Text style={[styles.infoValue, { color: COLORS.primary }]}>{gold.toLocaleString()}</Text>
              </View>
            </View>
          </View>

          {/* Energy bar */}
          <View style={styles.energyRow}>
            <Text style={styles.energyIcon}>⚡</Text>
            <View style={styles.energyTrack}>
              <View style={[styles.energyFill, { width: `${(energy / maxEnergy) * 100}%` }]} />
            </View>
            <Text style={styles.energyText}>{energy}/{maxEnergy}</Text>
          </View>
        </LinearGradient>

        {/* Main menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚔️ COMBATE</Text>
          <MenuButton
            icon="🗺️"
            label="Aventura"
            sublabel="Conquista las islas del Grand Line"
            onPress={() => navigation.navigate('Dungeon')}
            gradient={['#1A3A5C', '#0D1E33']}
          />
          <MenuButton
            icon="⚔️"
            label="Arena"
            sublabel="Desafía a otros piratas"
            onPress={() => navigation.navigate('Arena')}
            gradient={['#3A1A1A', '#1E0D0D']}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 TRIPULACIÓN</Text>
          <MenuButton
            icon="📜"
            label="Colección"
            sublabel="Administra tus personajes"
            onPress={() => navigation.navigate('Collection')}
            gradient={['#1A2E1A', '#0D1A0D']}
          />
          <MenuButton
            icon="🔮"
            label="Invocar"
            sublabel="Convoca nuevos piratas legendarios"
            onPress={() => navigation.navigate('Summon')}
            gradient={['#2A1A3A', '#150D1E']}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: COLORS.primary, fontSize: 18, fontWeight: 'bold' },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  titleRow: { alignItems: 'center', marginBottom: 16 },
  titleMain: {
    color: COLORS.primary,
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  titleSub: {
    color: COLORS.text,
    fontSize: 14,
    letterSpacing: 8,
    marginTop: -4,
    opacity: 0.7,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  infoCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: '#253045',
  },
  infoIcon: { fontSize: 16 },
  infoLabel: { color: COLORS.textMuted, fontSize: 9 },
  infoValue: { color: COLORS.text, fontSize: 13, fontWeight: 'bold' },
  energyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  energyIcon: { fontSize: 14 },
  energyTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#1A2235',
    borderRadius: 4,
    overflow: 'hidden',
  },
  energyFill: {
    height: '100%',
    backgroundColor: '#F39C12',
    borderRadius: 4,
  },
  energyText: { color: COLORS.textMuted, fontSize: 11 },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: {
    color: COLORS.textMuted,
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  menuBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#253045',
  },
  menuBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  menuIcon: { fontSize: 28 },
  menuLabel: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  menuSub: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  arrow: { color: COLORS.textDim, fontSize: 22, marginLeft: 'auto' },
});
