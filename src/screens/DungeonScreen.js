import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/useGameStore';
import { ISLANDS } from '../data/dungeons';
import { CHARACTERS } from '../data/characters';
import { COLORS } from '../constants/colors';

const StageButton = ({ stage, completed, onPress, disabled }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} activeOpacity={0.8}>
    <LinearGradient
      colors={completed ? ['#1A3A1A', '#0F2010'] : disabled ? ['#1A1A1A', '#111111'] : ['#1A2A3A', '#0F1A25']}
      style={[styles.stageBtn, completed && styles.stageBtnDone]}
    >
      <View style={styles.stageLeft}>
        <Text style={styles.stageNum}>{stage.stageNum}</Text>
      </View>
      <View style={styles.stageMid}>
        <Text style={styles.stageName}>{stage.name}</Text>
        <View style={styles.stageRewards}>
          <Text style={styles.stageRewardItem}>✨{stage.rewards.exp}</Text>
          <Text style={styles.stageRewardItem}>🪙{stage.rewards.gold}</Text>
          <Text style={styles.stageRewardItem}>💎{stage.rewards.crystals}</Text>
          <Text style={styles.stageRewardItem}>⚡{stage.energy}</Text>
        </View>
      </View>
      <View style={styles.stageRight}>
        {completed ? (
          <Text style={styles.completedStar}>⭐</Text>
        ) : disabled ? (
          <Text style={styles.lockIcon}>🔒</Text>
        ) : (
          <Text style={styles.playIcon}>▶</Text>
        )}
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default function DungeonScreen({ navigation }) {
  const { completedStages, energy, playerLevel, battleDeck } = useGameStore();
  const [selectedIsland, setSelectedIsland] = useState(0);

  const island = ISLANDS[selectedIsland];

  const goToBattle = (stage) => {
    if (battleDeck.length === 0) {
      alert('¡Necesitas al menos 1 personaje en tu equipo!\nVe a Colección para configurar tu equipo.');
      return;
    }
    if (energy < stage.energy) {
      alert(`¡No tienes suficiente energía! Necesitas ${stage.energy} ⚡`);
      return;
    }

    // Build enemy data from stage
    const enemies = [...stage.enemies];
    if (stage.boss) {
      enemies.push(stage.boss);
    }

    navigation.navigate('Battle', {
      stageId: stage.id,
      enemyData: enemies,
      rewards: stage.rewards,
      stageEnergy: stage.energy,
      stageName: stage.name,
    });
  };

  return (
    <LinearGradient colors={['#0A0E1A', '#141928']} style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🗺️ Aventura</Text>
        <View style={styles.energyBadge}>
          <Text style={styles.energyText}>⚡ {energy}</Text>
        </View>
      </View>

      {/* Island tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.islandTabs}>
        {ISLANDS.map((isl, idx) => {
          const isLocked = playerLevel < isl.unlockLevel;
          return (
            <TouchableOpacity
              key={isl.id}
              onPress={() => !isLocked && setSelectedIsland(idx)}
              style={[
                styles.islandTab,
                selectedIsland === idx && styles.islandTabActive,
                isLocked && styles.islandTabLocked,
              ]}
            >
              <Text style={styles.islandTabIcon}>{isLocked ? '🔒' : isl.icon}</Text>
              <Text style={[styles.islandTabName, selectedIsland === idx && styles.islandTabNameActive]}>
                {isl.name}
              </Text>
              {isLocked && (
                <Text style={styles.islandTabLock}>Nv.{isl.unlockLevel}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Island info */}
      <LinearGradient
        colors={['#1A2A3A', '#0A0E1A']}
        style={styles.islandInfo}
      >
        <Text style={styles.islandIcon}>{island.icon}</Text>
        <View style={styles.islandTextBlock}>
          <Text style={styles.islandName}>{island.name}</Text>
          <Text style={styles.islandDesc}>{island.description}</Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>
            {island.stages.filter((s) => completedStages.includes(s.id)).length}/{island.stages.length}
          </Text>
        </View>
      </LinearGradient>

      {/* Stages */}
      <ScrollView style={styles.stagesList} contentContainerStyle={{ paddingBottom: 30 }}>
        {island.stages.map((stage, idx) => {
          const isCompleted = completedStages.includes(stage.id);
          const prevCompleted = idx === 0 || completedStages.includes(island.stages[idx - 1]?.id);
          const isDisabled = !prevCompleted && !isCompleted && playerLevel < island.unlockLevel + idx * 5;

          return (
            <StageButton
              key={stage.id}
              stage={stage}
              completed={isCompleted}
              disabled={isDisabled}
              onPress={() => goToBattle(stage)}
            />
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  back: { padding: 4 },
  backText: { color: COLORS.text, fontSize: 28 },
  title: { color: COLORS.text, fontSize: 20, fontWeight: 'bold', flex: 1 },
  energyBadge: {
    backgroundColor: '#253045',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  energyText: { color: COLORS.primary, fontSize: 13, fontWeight: 'bold' },
  islandTabs: {
    paddingHorizontal: 12,
    marginBottom: 8,
    flexGrow: 0,
  },
  islandTab: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: '#141928',
    borderWidth: 1,
    borderColor: '#253045',
    minWidth: 90,
  },
  islandTabActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '22',
  },
  islandTabLocked: { opacity: 0.5 },
  islandTabIcon: { fontSize: 20, marginBottom: 2 },
  islandTabName: { color: COLORS.textMuted, fontSize: 10, fontWeight: 'bold', textAlign: 'center' },
  islandTabNameActive: { color: COLORS.primary },
  islandTabLock: { color: COLORS.danger, fontSize: 9, marginTop: 2 },
  islandInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 14,
    borderRadius: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#253045',
  },
  islandIcon: { fontSize: 32 },
  islandTextBlock: { flex: 1 },
  islandName: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  islandDesc: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  progressBadge: {
    backgroundColor: '#253045',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  progressText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },
  stagesList: { paddingHorizontal: 12 },
  stageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#253045',
  },
  stageBtnDone: { borderColor: '#2ECC71' + '66' },
  stageLeft: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRightWidth: 1,
    borderRightColor: '#253045',
  },
  stageNum: { color: COLORS.textMuted, fontSize: 16, fontWeight: 'bold' },
  stageMid: { flex: 1, paddingHorizontal: 14, paddingVertical: 10 },
  stageName: { color: COLORS.text, fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  stageRewards: { flexDirection: 'row', gap: 10 },
  stageRewardItem: { color: COLORS.textMuted, fontSize: 10 },
  stageRight: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedStar: { fontSize: 20 },
  lockIcon: { fontSize: 18 },
  playIcon: { color: COLORS.primary, fontSize: 22, fontWeight: 'bold' },
});
