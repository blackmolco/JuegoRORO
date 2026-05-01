import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/useGameStore';
import { CHARACTERS } from '../data/characters';
import { buildUnit, executeSkill, aiChooseSkill, checkBattleEnd, getNextUnit } from '../game/battleEngine';
import { COLORS } from '../constants/colors';
import BattleUnit from '../components/BattleUnit';
import SkillButton from '../components/SkillButton';

const BATTLE_STATES = {
  SETUP: 'setup',
  PLAYER_TURN: 'player_turn',
  ENEMY_TURN: 'enemy_turn',
  RESULT: 'result',
};

export default function BattleScreen({ route, navigation }) {
  const { stageId, enemyData, rewards, stageEnergy } = route.params ?? {};
  const { collection, battleDeck, recordBattleResult, useEnergy } = useGameStore();

  const [playerTeam, setPlayerTeam] = useState([]);
  const [enemyTeam, setEnemyTeam] = useState([]);
  const [state, setState] = useState(BATTLE_STATES.SETUP);
  const [activePlayerIdx, setActivePlayerIdx] = useState(0);
  const [activeEnemyIdx, setActiveEnemyIdx] = useState(-1);
  const [battleLog, setBattleLog] = useState([]);
  const [result, setResult] = useState(null);
  const [rewardsGained, setRewardsGained] = useState(null);
  const [turnCount, setTurnCount] = useState(0);

  const logScrollRef = useRef(null);
  const resultAnim = useRef(new Animated.Value(0)).current;

  // Build teams on mount
  useEffect(() => {
    const pTeam = battleDeck
      .map((ownedId) => {
        const owned = collection[ownedId];
        if (!owned) return null;
        return buildUnit({ ...owned, id: owned.characterId, characterId: owned.characterId });
      })
      .filter(Boolean);

    const eTeam = (enemyData ?? []).map((e) => {
      const unit = buildUnit({ id: e.id, characterId: e.id, runeBonus: e.runeBonus ?? 0 }, true, e.level);
      return unit;
    }).filter(Boolean);

    setPlayerTeam(pTeam);
    setEnemyTeam(eTeam);
    setState(BATTLE_STATES.PLAYER_TURN);
    addLog('⚓ ¡Batalla iniciada! Es el turno del jugador.');
  }, []);

  const addLog = (msg) => {
    setBattleLog((prev) => [...prev.slice(-30), msg]);
    setTimeout(() => logScrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  const activePlayer = playerTeam[activePlayerIdx];

  const endBattle = (outcome) => {
    setResult(outcome);
    setState(BATTLE_STATES.RESULT);
    const gained = recordBattleResult(outcome, stageId, rewards);
    setRewardsGained(gained);
    Animated.spring(resultAnim, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }).start();
  };

  const executePlayerSkill = (skillIndex) => {
    if (state !== BATTLE_STATES.PLAYER_TURN) return;
    if (!activePlayer || activePlayer.isDead) return;
    if (activePlayer.skillCooldowns[skillIndex] > 0) return;

    const aliveEnemies = enemyTeam.filter((u) => !u.isDead);
    if (aliveEnemies.length === 0) return;

    const pCopy = [...playerTeam];
    const eCopy = [...enemyTeam];

    const { logs } = executeSkill(pCopy[activePlayerIdx], skillIndex, pCopy, eCopy);
    logs.forEach(addLog);

    setPlayerTeam([...pCopy]);
    setEnemyTeam([...eCopy]);
    setTurnCount((t) => t + 1);

    const outcome = checkBattleEnd(pCopy, eCopy);
    if (outcome) { endBattle(outcome); return; }

    // Switch to enemy turn
    setState(BATTLE_STATES.ENEMY_TURN);
    addLog('👾 Turno del enemigo...');

    setTimeout(() => runEnemyTurns([...pCopy], [...eCopy]), 800);
  };

  const runEnemyTurns = (pTeam, eTeam) => {
    const aliveEnemies = eTeam.filter((u) => !u.isDead);
    if (aliveEnemies.length === 0) { endBattle('victory'); return; }

    let pCopy = [...pTeam];
    let eCopy = [...eTeam];
    let enemyIdx = 0;

    const runNextEnemy = () => {
      const alive = eCopy.filter((u) => !u.isDead);
      if (enemyIdx >= alive.length) {
        // All enemies attacked — back to player
        const pAlive = pCopy.filter((u) => !u.isDead);
        if (pAlive.length > 0) {
          // Find next alive player
          let nextIdx = 0;
          for (let i = 0; i < pCopy.length; i++) {
            if (!pCopy[i].isDead) { nextIdx = i; break; }
          }
          setActivePlayerIdx(nextIdx);
        }
        setPlayerTeam([...pCopy]);
        setEnemyTeam([...eCopy]);
        setState(BATTLE_STATES.PLAYER_TURN);
        addLog('⚔️ Tu turno.');
        return;
      }

      const enemy = alive[enemyIdx];
      const skillIdx = aiChooseSkill(enemy);
      const { logs } = executeSkill(enemy, skillIdx, eCopy, pCopy);
      logs.forEach(addLog);

      setPlayerTeam([...pCopy]);
      setEnemyTeam([...eCopy]);

      const outcome = checkBattleEnd(pCopy, eCopy);
      if (outcome) { endBattle(outcome); return; }

      enemyIdx++;
      setTimeout(runNextEnemy, 600);
    };

    runNextEnemy();
  };

  const switchActivePlayer = (idx) => {
    if (state !== BATTLE_STATES.PLAYER_TURN) return;
    if (playerTeam[idx]?.isDead) return;
    setActivePlayerIdx(idx);
  };

  const goBack = () => navigation.goBack();

  if (playerTeam.length === 0 && state !== BATTLE_STATES.RESULT) {
    return (
      <LinearGradient colors={['#0A0E1A', '#141928']} style={styles.root}>
        <Text style={styles.loadingText}>Preparando batalla...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0A0E1A', '#0D1220', '#141928']} style={styles.root}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goBack} style={styles.backBtn}>
          <Text style={styles.backText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.topTitle}>
          {state === BATTLE_STATES.PLAYER_TURN ? '⚔️ Tu turno' : state === BATTLE_STATES.ENEMY_TURN ? '👾 Enemigos...' : '⚡ Batalla'}
        </Text>
        <Text style={styles.turnCount}>T:{turnCount}</Text>
      </View>

      {/* Enemy team */}
      <View style={styles.teamSection}>
        <Text style={styles.teamLabel}>👾 ENEMIGOS</Text>
        <View style={styles.unitsRow}>
          {enemyTeam.map((unit, idx) => (
            <BattleUnit
              key={unit.uid ?? idx}
              unit={unit}
              isActive={false}
              isEnemy
            />
          ))}
        </View>
      </View>

      {/* VS divider */}
      <View style={styles.vsDivider}>
        <View style={styles.vsLine} />
        <Text style={styles.vsText}>VS</Text>
        <View style={styles.vsLine} />
      </View>

      {/* Player team */}
      <View style={styles.teamSection}>
        <Text style={styles.teamLabel}>⚓ TU TRIPULACIÓN</Text>
        <View style={styles.unitsRow}>
          {playerTeam.map((unit, idx) => (
            <TouchableOpacity key={unit.uid ?? idx} onPress={() => switchActivePlayer(idx)}>
              <BattleUnit
                unit={unit}
                isActive={idx === activePlayerIdx && !unit.isDead}
                isEnemy={false}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Skill buttons */}
      {state === BATTLE_STATES.PLAYER_TURN && activePlayer && !activePlayer.isDead && (
        <View style={styles.skillsSection}>
          <Text style={styles.skillsLabel}>
            🎯 Habilidades de {activePlayer.name}
          </Text>
          <View style={styles.skillsRow}>
            {activePlayer.skills.map((skillId, idx) => (
              <SkillButton
                key={skillId}
                skillId={skillId}
                cooldown={activePlayer.skillCooldowns[idx]}
                onPress={() => executePlayerSkill(idx)}
                index={idx}
              />
            ))}
          </View>
        </View>
      )}

      {state === BATTLE_STATES.ENEMY_TURN && (
        <View style={styles.waitSection}>
          <Text style={styles.waitText}>⏳ Los enemigos están atacando...</Text>
        </View>
      )}

      {/* Battle log */}
      <View style={styles.logSection}>
        <ScrollView ref={logScrollRef} style={styles.logScroll}>
          {battleLog.map((line, i) => (
            <Text key={i} style={[styles.logLine, i === battleLog.length - 1 && styles.logLineLast]}>
              {line}
            </Text>
          ))}
        </ScrollView>
      </View>

      {/* Result overlay */}
      {state === BATTLE_STATES.RESULT && (
        <View style={styles.resultOverlay}>
          <Animated.View style={[styles.resultCard, { transform: [{ scale: resultAnim }] }]}>
            <LinearGradient
              colors={result === 'victory' ? ['#1A3A1A', '#0D1E0D'] : ['#3A1A1A', '#1E0D0D']}
              style={styles.resultGrad}
            >
              <Text style={styles.resultEmoji}>{result === 'victory' ? '🏆' : '💀'}</Text>
              <Text style={styles.resultTitle}>
                {result === 'victory' ? '¡VICTORIA!' : 'DERROTA'}
              </Text>
              {rewardsGained && result === 'victory' && (
                <View style={styles.rewardsBox}>
                  <Text style={styles.rewardsTitle}>Recompensas obtenidas:</Text>
                  <Text style={styles.rewardLine}>✨ EXP: +{rewardsGained.expGain}</Text>
                  <Text style={styles.rewardLine}>🪙 Oro: +{rewardsGained.goldGain.toLocaleString()}</Text>
                  <Text style={styles.rewardLine}>💎 Cristales: +{rewardsGained.crystalGain}</Text>
                </View>
              )}
              <TouchableOpacity onPress={goBack} style={styles.resultBtn}>
                <Text style={styles.resultBtnText}>Continuar</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loadingText: { color: COLORS.text, textAlign: 'center', marginTop: 100, fontSize: 16 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#253045',
  },
  backBtn: { padding: 4 },
  backText: { color: COLORS.textMuted, fontSize: 18, fontWeight: 'bold' },
  topTitle: { flex: 1, color: COLORS.text, fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  turnCount: { color: COLORS.textDim, fontSize: 11 },
  teamSection: { paddingHorizontal: 12, paddingTop: 8 },
  teamLabel: { color: COLORS.textMuted, fontSize: 10, letterSpacing: 2, marginBottom: 4 },
  unitsRow: { flexDirection: 'row', justifyContent: 'center', gap: 4 },
  vsDivider: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, marginVertical: 6,
  },
  vsLine: { flex: 1, height: 1, backgroundColor: '#253045' },
  vsText: { color: COLORS.textDim, fontSize: 12, fontWeight: 'bold', marginHorizontal: 10 },
  skillsSection: { paddingHorizontal: 12, marginTop: 4 },
  skillsLabel: { color: COLORS.primary, fontSize: 11, fontWeight: 'bold', marginBottom: 4 },
  skillsRow: { flexDirection: 'row', gap: 4 },
  waitSection: { alignItems: 'center', paddingVertical: 12 },
  waitText: { color: COLORS.textMuted, fontSize: 13 },
  logSection: {
    flex: 1,
    margin: 12,
    backgroundColor: '#0D1220',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#253045',
    overflow: 'hidden',
  },
  logScroll: { padding: 8 },
  logLine: { color: COLORS.textDim, fontSize: 10, lineHeight: 16 },
  logLineLast: { color: COLORS.textMuted, fontWeight: 'bold' },
  resultOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultCard: {
    width: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#354560',
  },
  resultGrad: { padding: 30, alignItems: 'center' },
  resultEmoji: { fontSize: 64 },
  resultTitle: {
    color: COLORS.text, fontSize: 28, fontWeight: 'bold', marginTop: 8,
  },
  rewardsBox: { marginTop: 16, alignItems: 'center', gap: 4 },
  rewardsTitle: { color: COLORS.textMuted, fontSize: 12, marginBottom: 4 },
  rewardLine: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  resultBtn: {
    marginTop: 24,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resultBtnText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
});
