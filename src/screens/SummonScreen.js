import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/useGameStore';
import { CHARACTERS } from '../data/characters';
import { COLORS } from '../constants/colors';
import { ELEMENTS } from '../constants/elements';
import StarRating from '../components/StarRating';

const RARITY_RATES = [
  { stars: 5, rate: '2%', icon: '🌟', label: 'Legendario', color: '#E67E22' },
  { stars: 4, rate: '10%', icon: '⭐', label: 'Épico', color: '#8E44AD' },
  { stars: 3, rate: '25%', icon: '🔵', label: 'Raro', color: '#2980B9' },
  { stars: 2, rate: '30%', icon: '🟢', label: 'Poco común', color: '#27AE60' },
  { stars: 1, rate: '33%', icon: '⚪', label: 'Común', color: '#888888' },
];

const ResultCard = ({ characterId }) => {
  const base = CHARACTERS[characterId];
  if (!base) return null;
  const rarityColor = COLORS.rarity[base.stars] ?? '#888';
  return (
    <LinearGradient
      colors={[rarityColor + '44', '#1A2235']}
      style={styles.resultCard}
    >
      <Text style={styles.resultEmoji}>{base.emoji}</Text>
      <StarRating stars={base.stars} size={9} />
      <Text style={styles.resultName} numberOfLines={2}>{base.name}</Text>
      <Text style={[styles.resultElement, { color: COLORS.elements[base.element] }]}>
        {ELEMENTS[base.element]?.icon}
      </Text>
    </LinearGradient>
  );
};

export default function SummonScreen({ navigation }) {
  const { crystals, pityCount, summon } = useGameStore();
  const [results, setResults] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [summoning, setSummoning] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const doSummon = (count) => {
    if (summoning) return;
    setSummoning(true);

    const outcome = summon(count);
    if (!outcome.success) {
      alert(`❌ ${outcome.reason}`);
      setSummoning(false);
      return;
    }

    setResults(outcome.results);
    setModalVisible(true);
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1, tension: 80, friction: 8, useNativeDriver: true,
    }).start(() => setSummoning(false));
  };

  const closeModal = () => {
    setModalVisible(false);
    setResults([]);
  };

  return (
    <LinearGradient colors={['#0A0E1A', '#141928', '#0A0E1A']} style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🔮 Invocar</Text>
        <View style={styles.crystalBadge}>
          <Text style={styles.crystalText}>💎 {crystals}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Pity counter */}
        <LinearGradient colors={['#1A2A3A', '#0F1820']} style={styles.pityCard}>
          <Text style={styles.pityTitle}>⚡ Pity System</Text>
          <View style={styles.pityBar}>
            <View style={styles.pityTrack}>
              <View style={[styles.pityFill, { width: `${Math.min((pityCount / 100) * 100, 100)}%` }]} />
            </View>
            <Text style={styles.pityCount}>{pityCount}/100</Text>
          </View>
          <Text style={styles.pityNote}>
            {100 - pityCount} invocaciones para garantía 5★ • {Math.max(0, 50 - pityCount)} para garantía 4★
          </Text>
        </LinearGradient>

        {/* Banner */}
        <LinearGradient
          colors={['#2A1A4A', '#1A0A3A', '#0A0520']}
          style={styles.banner}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.bannerTitle}>🏴‍☠️ BANNER ESTÁNDAR</Text>
          <Text style={styles.bannerSubtitle}>Todos los personajes del Grand Line</Text>
          <View style={styles.featuredRow}>
            {['luffy_g5', 'zoro', 'ace', 'law', 'hancock'].map((id) => {
              const c = CHARACTERS[id];
              return c ? (
                <View key={id} style={styles.featuredChar}>
                  <Text style={styles.featuredEmoji}>{c.emoji}</Text>
                  <StarRating stars={c.stars} size={7} />
                </View>
              ) : null;
            })}
            <Text style={styles.featuredMore}>+más</Text>
          </View>
        </LinearGradient>

        {/* Summon buttons */}
        <View style={styles.summonButtons}>
          <TouchableOpacity
            onPress={() => doSummon(1)}
            disabled={summoning || crystals < 150}
            style={[styles.summonBtn, (summoning || crystals < 150) && styles.summonBtnDisabled]}
          >
            <LinearGradient
              colors={crystals >= 150 ? ['#1E3A5F', '#0F2040'] : ['#1A2235', '#141928']}
              style={styles.summonBtnGrad}
            >
              <Text style={styles.summonBtnLabel}>x1 Invocar</Text>
              <View style={styles.summonCost}>
                <Text style={styles.summonCostIcon}>💎</Text>
                <Text style={styles.summonCostText}>150</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => doSummon(10)}
            disabled={summoning || crystals < 1350}
            style={[styles.summonBtn, (summoning || crystals < 1350) && styles.summonBtnDisabled]}
          >
            <LinearGradient
              colors={crystals >= 1350 ? ['#3A2A1A', '#201508'] : ['#1A2235', '#141928']}
              style={styles.summonBtnGrad}
            >
              <Text style={styles.summonBtnLabel}>x10 Invocar</Text>
              <View style={styles.summonCost}>
                <Text style={styles.summonCostIcon}>💎</Text>
                <Text style={styles.summonCostText}>1,350</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>-10%</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Rates */}
        <View style={styles.ratesCard}>
          <Text style={styles.ratesTitle}>📊 Tasas de aparición</Text>
          {RARITY_RATES.map((r) => (
            <View key={r.stars} style={styles.rateRow}>
              <Text style={styles.rateIcon}>{r.icon}</Text>
              <Text style={[styles.rateLabel, { color: r.color }]}>{r.label}</Text>
              <Text style={styles.rateValue}>{r.rate}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Results Modal */}
      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
        <View style={styles.modalBg}>
          <Animated.View style={[styles.modal, { transform: [{ scale: scaleAnim }] }]}>
            <LinearGradient colors={['#141928', '#0A0E1A']} style={styles.modalGrad}>
              <Text style={styles.modalTitle}>✨ ¡Resultados!</Text>
              <View style={styles.resultsGrid}>
                {results.map((r, i) => (
                  <ResultCard key={i} characterId={r.characterId} />
                ))}
              </View>
              {results.some((r) => (CHARACTERS[r.characterId]?.stars ?? 0) >= 4) && (
                <Text style={styles.newCharBanner}>
                  {results.some((r) => (CHARACTERS[r.characterId]?.stars ?? 0) >= 5)
                    ? '🌟 ¡PERSONAJE LEGENDARIO!' : '⭐ ¡Personaje Épico!'}
                </Text>
              )}
              <TouchableOpacity onPress={closeModal} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>¡Genial!</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
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
  crystalBadge: {
    backgroundColor: '#253045', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12,
  },
  crystalText: { color: '#5B9CF6', fontSize: 14, fontWeight: 'bold' },
  content: { padding: 16, paddingBottom: 40 },
  pityCard: {
    borderRadius: 14, padding: 14, marginBottom: 16,
    borderWidth: 1, borderColor: '#253045',
  },
  pityTitle: { color: COLORS.text, fontSize: 13, fontWeight: 'bold', marginBottom: 8 },
  pityBar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  pityTrack: {
    flex: 1, height: 8, backgroundColor: '#0A0E1A',
    borderRadius: 4, overflow: 'hidden',
  },
  pityFill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 4 },
  pityCount: { color: COLORS.textMuted, fontSize: 11 },
  pityNote: { color: COLORS.textMuted, fontSize: 10 },
  banner: {
    borderRadius: 16, padding: 20, marginBottom: 16,
    borderWidth: 1, borderColor: '#3A2A5A', alignItems: 'center',
  },
  bannerTitle: { color: COLORS.primary, fontSize: 16, fontWeight: 'bold', letterSpacing: 2 },
  bannerSubtitle: { color: COLORS.textMuted, fontSize: 12, marginTop: 4, marginBottom: 14 },
  featuredRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featuredChar: { alignItems: 'center', gap: 2 },
  featuredEmoji: { fontSize: 28 },
  featuredMore: { color: COLORS.textMuted, fontSize: 12, marginLeft: 4 },
  summonButtons: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  summonBtn: { flex: 1, borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: '#253045' },
  summonBtnDisabled: { opacity: 0.5 },
  summonBtnGrad: { padding: 16, alignItems: 'center' },
  summonBtnLabel: { color: COLORS.text, fontSize: 14, fontWeight: 'bold', marginBottom: 6 },
  summonCost: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  summonCostIcon: { fontSize: 14 },
  summonCostText: { color: '#5B9CF6', fontSize: 15, fontWeight: 'bold' },
  discountBadge: {
    backgroundColor: '#E74C3C', borderRadius: 6, paddingHorizontal: 4, paddingVertical: 1,
  },
  discountText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  ratesCard: {
    backgroundColor: '#141928', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#253045',
  },
  ratesTitle: { color: COLORS.textMuted, fontSize: 12, fontWeight: 'bold', marginBottom: 10, letterSpacing: 1 },
  rateRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 5, gap: 10 },
  rateIcon: { fontSize: 14 },
  rateLabel: { flex: 1, fontSize: 12, fontWeight: 'bold' },
  rateValue: { color: COLORS.text, fontSize: 13, fontWeight: 'bold' },
  // Modal
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', alignItems: 'center', justifyContent: 'center' },
  modal: { width: '90%', borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#354560' },
  modalGrad: { padding: 20, alignItems: 'center' },
  modalTitle: { color: COLORS.primary, fontSize: 20, fontWeight: 'bold', marginBottom: 16 },
  resultsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  resultCard: {
    width: 72, height: 90, borderRadius: 10, alignItems: 'center',
    justifyContent: 'center', padding: 4, gap: 2,
    borderWidth: 1, borderColor: '#253045',
  },
  resultEmoji: { fontSize: 28 },
  resultName: { color: COLORS.text, fontSize: 7, textAlign: 'center', fontWeight: 'bold' },
  resultElement: { fontSize: 10 },
  newCharBanner: {
    color: COLORS.primary, fontSize: 16, fontWeight: 'bold',
    marginTop: 12, textAlign: 'center',
  },
  closeBtn: {
    marginTop: 16, backgroundColor: COLORS.primary,
    paddingHorizontal: 40, paddingVertical: 12, borderRadius: 12,
  },
  closeBtnText: { color: '#000', fontWeight: 'bold', fontSize: 15 },
});
