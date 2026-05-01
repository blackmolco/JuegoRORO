import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/useGameStore';
import { CHARACTERS } from '../data/characters';
import { COLORS } from '../constants/colors';
import { buildUnit, simulateBattle } from '../game/battleEngine';

// Predefined opponent teams
const ARENA_OPPONENTS = [
  {
    name: 'Rookie Pirata',
    rank: 'Bronce', icon: '🥉',
    team: [
      { id: 'coby', level: 10 },
      { id: 'tashigi', level: 10 },
    ],
  },
  {
    name: 'Corsario del Mar',
    rank: 'Plata', icon: '🥈',
    team: [
      { id: 'smoker', level: 20 },
      { id: 'tashigi', level: 20 },
      { id: 'coby', level: 18 },
    ],
  },
  {
    name: 'Supernova',
    rank: 'Oro', icon: '🥇',
    team: [
      { id: 'law', level: 35 },
      { id: 'crocodile', level: 35 },
      { id: 'enel', level: 35 },
    ],
  },
  {
    name: 'Capitán Pirata',
    rank: 'Diamante', icon: '💎',
    team: [
      { id: 'zoro', level: 45 },
      { id: 'sanji', level: 45 },
      { id: 'nami', level: 45 },
    ],
  },
  {
    name: 'Comandante Yonkou',
    rank: 'Maestro', icon: '🌟',
    team: [
      { id: 'ace', level: 55 },
      { id: 'marco', level: 55 },
      { id: 'katakuri', level: 55 },
    ],
  },
  {
    name: 'Almirante Marina',
    rank: 'Leyenda', icon: '👑',
    team: [
      { id: 'shanks', level: 60 },
      { id: 'kaido', level: 60 },
      { id: 'roger', level: 60 },
    ],
  },
];

const RANK_COLORS = {
  'Bronce': '#CD7F32',
  'Plata': '#C0C0C0',
  'Oro': '#FFD700',
  'Diamante': '#00BFFF',
  'Maestro': '#9B59B6',
  'Leyenda': '#E74C3C',
};

export default function ArenaScreen({ navigation }) {
  const { collection, battleDeck, arenaWins, arenaLosses, recordArenaResult } = useGameStore();
  const [fightResult, setFightResult] = useState(null);
  const [fighting, setFighting] = useState(false);
  const [lastOpponent, setLastOpponent] = useState(null);

  const totalArena = arenaWins + arenaLosses;
  const winRate = totalArena > 0 ? Math.round((arenaWins / totalArena) * 100) : 0;

  const fight = (opponent) => {
    if (battleDeck.length === 0) {
      alert('¡Configura tu equipo en Colección primero!');
      return;
    }
    setFighting(true);
    setLastOpponent(opponent);

    // Build player units
    const playerUnits = battleDeck.map((ownedId) => {
      const owned = collection[ownedId];
      if (!owned) return null;
      return buildUnit({ ...owned, id: owned.characterId, characterId: owned.characterId });
    }).filter(Boolean);

    // Build enemy units
    const enemyUnits = opponent.team.map((e) =>
      buildUnit({ id: e.id, characterId: e.id, runeBonus: 0 }, true, e.level)
    ).filter(Boolean);

    if (playerUnits.length === 0 || enemyUnits.length === 0) {
      setFighting(false);
      return;
    }

    // Simulate battle
    setTimeout(() => {
      const result = simulateBattle(playerUnits, enemyUnits);
      setFightResult(result);
      recordArenaResult(result.outcome === 'victory');
      setFighting(false);
    }, 500);
  };

  return (
    <LinearGradient colors={['#0A0E1A', '#141928']} style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>⚔️ Arena</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats */}
        <LinearGradient colors={['#1A2A3A', '#0F1820']} style={styles.statsCard}>
          <Text style={styles.statsTitle}>📊 Tu Récord</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>{arenaWins}</Text>
              <Text style={styles.statLabel}>Victorias</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: COLORS.danger }]}>{arenaLosses}</Text>
              <Text style={styles.statLabel}>Derrotas</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNum, { color: COLORS.primary }]}>{winRate}%</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
            </View>
          </View>
        </LinearGradient>

        {/* My deck preview */}
        <View style={styles.deckPreview}>
          <Text style={styles.deckPreviewLabel}>Tu equipo:</Text>
          <View style={styles.deckPreviewChars}>
            {battleDeck.length > 0 ? battleDeck.map((id) => {
              const owned = collection[id];
              const base = CHARACTERS[owned?.characterId];
              return base ? (
                <View key={id} style={styles.deckChar}>
                  <Text style={styles.deckCharEmoji}>{base.emoji}</Text>
                  <Text style={styles.deckCharName}>{base.name.split(' ')[0]}</Text>
                  <Text style={styles.deckCharLv}>Lv.{owned.level}</Text>
                </View>
              ) : null;
            }) : <Text style={styles.noDeck}>Sin equipo configurado</Text>}
          </View>
        </View>

        {/* Last result */}
        {fightResult && lastOpponent && (
          <View style={[
            styles.resultBanner,
            { borderColor: fightResult.outcome === 'victory' ? COLORS.success : COLORS.danger },
          ]}>
            <Text style={styles.resultBannerEmoji}>
              {fightResult.outcome === 'victory' ? '🏆' : '💀'}
            </Text>
            <View>
              <Text style={[
                styles.resultBannerTitle,
                { color: fightResult.outcome === 'victory' ? COLORS.success : COLORS.danger },
              ]}>
                {fightResult.outcome === 'victory' ? '¡Victoria!' : 'Derrota'}
              </Text>
              <Text style={styles.resultBannerSub}>
                vs {lastOpponent.name} • {fightResult.turns} turnos
              </Text>
              <Text style={styles.resultBannerReward}>
                {fightResult.outcome === 'victory' ? '💎 +30 • 🪙 +2,000' : '💎 +5 • 🪙 +500'}
              </Text>
            </View>
          </View>
        )}

        {/* Opponents */}
        <Text style={styles.opponentsTitle}>Desafiar oponentes:</Text>
        {ARENA_OPPONENTS.map((opp, idx) => {
          const rankColor = RANK_COLORS[opp.rank] ?? '#888';
          return (
            <LinearGradient
              key={idx}
              colors={['#1A2235', '#0F1520']}
              style={styles.oppCard}
            >
              <View style={styles.oppLeft}>
                <Text style={styles.oppRankIcon}>{opp.icon}</Text>
                <View>
                  <Text style={[styles.oppRank, { color: rankColor }]}>{opp.rank}</Text>
                  <Text style={styles.oppName}>{opp.name}</Text>
                </View>
              </View>
              <View style={styles.oppTeam}>
                {opp.team.map((e, i) => {
                  const base = CHARACTERS[e.id];
                  return base ? (
                    <View key={i} style={styles.oppChar}>
                      <Text style={{ fontSize: 20 }}>{base.emoji}</Text>
                      <Text style={styles.oppCharLv}>Lv.{e.level}</Text>
                    </View>
                  ) : null;
                })}
              </View>
              <TouchableOpacity
                onPress={() => fight(opp)}
                disabled={fighting}
                style={[styles.fightBtn, fighting && styles.fightBtnDisabled]}
              >
                <Text style={styles.fightBtnText}>{fighting ? '...' : '⚔️'}</Text>
              </TouchableOpacity>
            </LinearGradient>
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
  content: { padding: 16, paddingBottom: 40 },
  statsCard: {
    borderRadius: 16, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: '#253045',
  },
  statsTitle: { color: COLORS.textMuted, fontSize: 11, letterSpacing: 2, marginBottom: 12, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { color: COLORS.text, fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 40, backgroundColor: '#253045' },
  deckPreview: {
    backgroundColor: '#141928',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#253045',
  },
  deckPreviewLabel: { color: COLORS.textMuted, fontSize: 11, marginBottom: 8 },
  deckPreviewChars: { flexDirection: 'row', gap: 12 },
  deckChar: { alignItems: 'center' },
  deckCharEmoji: { fontSize: 28 },
  deckCharName: { color: COLORS.text, fontSize: 9, fontWeight: 'bold', marginTop: 2 },
  deckCharLv: { color: COLORS.textMuted, fontSize: 8 },
  noDeck: { color: COLORS.textMuted, fontSize: 12 },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141928',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 2,
    gap: 12,
  },
  resultBannerEmoji: { fontSize: 32 },
  resultBannerTitle: { fontSize: 16, fontWeight: 'bold' },
  resultBannerSub: { color: COLORS.textMuted, fontSize: 11, marginTop: 2 },
  resultBannerReward: { color: COLORS.primary, fontSize: 11, marginTop: 4, fontWeight: 'bold' },
  opponentsTitle: { color: COLORS.textMuted, fontSize: 11, letterSpacing: 2, fontWeight: 'bold', marginBottom: 10 },
  oppCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#253045',
    gap: 10,
  },
  oppLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  oppRankIcon: { fontSize: 24 },
  oppRank: { fontSize: 10, fontWeight: 'bold' },
  oppName: { color: COLORS.text, fontSize: 13, fontWeight: 'bold', marginTop: 1 },
  oppTeam: { flexDirection: 'row', gap: 4 },
  oppChar: { alignItems: 'center' },
  oppCharLv: { color: COLORS.textDim, fontSize: 8 },
  fightBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fightBtnDisabled: { backgroundColor: '#253045' },
  fightBtnText: { fontSize: 18 },
});
