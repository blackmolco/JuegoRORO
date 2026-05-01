import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameStore } from '../store/useGameStore';
import { CHARACTERS } from '../data/characters';
import { ELEMENTS, ROLES } from '../constants/elements';
import { COLORS } from '../constants/colors';
import CharacterCard from '../components/CharacterCard';
import StarRating from '../components/StarRating';
import HealthBar from '../components/HealthBar';

const ELEMENT_FILTERS = ['todos', 'fuego', 'agua', 'viento', 'luz', 'oscuridad'];
const SORT_OPTIONS = ['rarity', 'level', 'name'];

export default function CollectionScreen({ navigation }) {
  const { collection, battleDeck, addToDeck, removeFromDeck, levelUpCharacter, gold } = useGameStore();
  const [filter, setFilter] = useState('todos');
  const [sort, setSort] = useState('rarity');
  const [selected, setSelected] = useState(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const owned = Object.values(collection).map((o) => ({
    ...o,
    base: CHARACTERS[o.characterId],
  })).filter((o) => o.base);

  const filtered = owned
    .filter((o) => filter === 'todos' || o.base.element === filter)
    .sort((a, b) => {
      if (sort === 'rarity') return b.base.stars - a.base.stars;
      if (sort === 'level') return b.level - a.level;
      return a.base.name.localeCompare(b.base.name);
    });

  const inDeck = selected ? battleDeck.includes(selected.id) : false;
  const deckFull = battleDeck.length >= 3;

  const openDetail = (char) => { setSelected(char); setDetailVisible(true); };
  const closeDetail = () => { setDetailVisible(false); setSelected(null); };

  const toggleDeck = () => {
    if (!selected) return;
    if (inDeck) {
      removeFromDeck(selected.id);
    } else if (!deckFull) {
      addToDeck(selected.id);
    }
  };

  const doLevelUp = () => {
    if (!selected) return;
    const success = levelUpCharacter(selected.id);
    if (success) {
      const updated = collection[selected.id];
      setSelected({ ...selected, level: updated?.level ?? selected.level + 1 });
    }
  };

  const renderChar = ({ item }) => {
    const isDeckMember = battleDeck.includes(item.id);
    return (
      <CharacterCard
        character={item.base}
        owned={item}
        onPress={() => openDetail(item)}
        selected={isDeckMember}
      />
    );
  };

  return (
    <LinearGradient colors={['#0A0E1A', '#141928']} style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📜 Colección</Text>
        <Text style={styles.count}>{owned.length} personajes</Text>
      </View>

      {/* Deck preview */}
      <View style={styles.deckRow}>
        <Text style={styles.deckLabel}>⚔️ Equipo ({battleDeck.length}/3):</Text>
        {battleDeck.map((id) => {
          const member = collection[id];
          const base = CHARACTERS[member?.characterId];
          return base ? (
            <Text key={id} style={styles.deckMember}>{base.emoji}</Text>
          ) : null;
        })}
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {ELEMENT_FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            style={[styles.filterBtn, filter === f && styles.filterActive]}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'todos' ? '🌊 Todos' : `${ELEMENTS[f]?.icon} ${ELEMENTS[f]?.name}`}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sort */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Ordenar:</Text>
        {SORT_OPTIONS.map((s) => (
          <TouchableOpacity key={s} onPress={() => setSort(s)} style={[styles.sortBtn, sort === s && styles.sortActive]}>
            <Text style={[styles.sortText, sort === s && styles.sortTextActive]}>
              {s === 'rarity' ? '★ Rareza' : s === 'level' ? '▲ Nivel' : '🔤 Nombre'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={renderChar}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <Text style={styles.empty}>No tienes personajes de este tipo.</Text>
        }
      />

      {/* Detail Modal */}
      <Modal visible={detailVisible} transparent animationType="slide" onRequestClose={closeDetail}>
        <View style={styles.modalBg}>
          {selected && (() => {
            const base = selected.base;
            const levelUpCost = selected.level * 200;
            const canAfford = gold >= levelUpCost;
            const elementColor = COLORS.elements[base.element] ?? '#888';
            const rarityColor = COLORS.rarity[base.stars] ?? '#888';

            return (
              <LinearGradient colors={['#141928', '#0A0E1A']} style={styles.modal}>
                <TouchableOpacity onPress={closeDetail} style={styles.modalClose}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>

                {/* Character header */}
                <LinearGradient
                  colors={[rarityColor + '44', '#1A2235']}
                  style={styles.modalHeader}
                >
                  <Text style={styles.modalEmoji}>{base.emoji}</Text>
                  <Text style={styles.modalName}>{base.name}</Text>
                  <Text style={styles.modalTitle}>{base.title}</Text>
                  <StarRating stars={base.stars} size={14} />
                  <View style={styles.modalBadges}>
                    <View style={[styles.badge, { backgroundColor: elementColor + '33', borderColor: elementColor }]}>
                      <Text style={{ color: elementColor, fontSize: 12, fontWeight: 'bold' }}>
                        {ELEMENTS[base.element]?.icon} {ELEMENTS[base.element]?.name}
                      </Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: '#253045', borderColor: '#354560' }]}>
                      <Text style={{ color: COLORS.text, fontSize: 12 }}>
                        {ROLES[base.role]?.icon} {ROLES[base.role]?.name}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>

                <ScrollView style={styles.modalBody}>
                  {/* Level & HP */}
                  <View style={styles.levelRow}>
                    <Text style={styles.levelLabel}>Nivel {selected.level}/60</Text>
                    <TouchableOpacity
                      onPress={doLevelUp}
                      style={[styles.levelUpBtn, !canAfford && styles.levelUpDisabled]}
                      disabled={!canAfford || selected.level >= 60}
                    >
                      <Text style={styles.levelUpText}>
                        ▲ Subir Nivel (🪙 {levelUpCost.toLocaleString()})
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Stats */}
                  <View style={styles.statsGrid}>
                    {[
                      { label: '❤️ HP', value: Math.floor(base.baseStats.hp * (1 + (selected.level - 1) * 0.06)) },
                      { label: '⚔️ ATK', value: Math.floor(base.baseStats.atk * (1 + (selected.level - 1) * 0.06)) },
                      { label: '🛡️ DEF', value: Math.floor(base.baseStats.def * (1 + (selected.level - 1) * 0.06)) },
                      { label: '💨 VEL', value: base.baseStats.spd },
                      { label: '💥 CRIT', value: `${base.baseStats.crit}%` },
                      { label: '🗡️ CRIT+', value: `${base.baseStats.critDmg}%` },
                    ].map((stat) => (
                      <View key={stat.label} style={styles.statBox}>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                        <Text style={styles.statValue}>{stat.value}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Lore */}
                  <View style={styles.loreBox}>
                    <Text style={styles.loreTitleLabel}>📖 Historia</Text>
                    <Text style={styles.loreText}>{base.lore}</Text>
                  </View>

                  {/* Deck button */}
                  <TouchableOpacity
                    onPress={toggleDeck}
                    style={[styles.deckBtn, inDeck ? styles.deckBtnRemove : (deckFull ? styles.deckBtnDisabled : styles.deckBtnAdd)]}
                    disabled={!inDeck && deckFull}
                  >
                    <Text style={styles.deckBtnText}>
                      {inDeck ? '✕ Quitar del Equipo' : deckFull ? 'Equipo lleno (3/3)' : '+ Agregar al Equipo'}
                    </Text>
                  </TouchableOpacity>
                </ScrollView>
              </LinearGradient>
            );
          })()}
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
  count: { color: COLORS.textMuted, fontSize: 12 },
  deckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#141928',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#253045',
  },
  deckLabel: { color: COLORS.textMuted, fontSize: 12 },
  deckMember: { fontSize: 22 },
  filterScroll: { paddingHorizontal: 12, marginVertical: 8, flexGrow: 0 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#253045',
    marginRight: 8,
    backgroundColor: '#141928',
  },
  filterActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '22' },
  filterText: { color: COLORS.textMuted, fontSize: 12 },
  filterTextActive: { color: COLORS.primary, fontWeight: 'bold' },
  sortRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 8, gap: 8 },
  sortLabel: { color: COLORS.textMuted, fontSize: 11 },
  sortBtn: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
    borderWidth: 1, borderColor: '#253045', backgroundColor: '#141928',
  },
  sortActive: { borderColor: COLORS.primary },
  sortText: { color: COLORS.textMuted, fontSize: 10 },
  sortTextActive: { color: COLORS.primary },
  grid: { paddingHorizontal: 8, paddingBottom: 20 },
  empty: { color: COLORS.textMuted, textAlign: 'center', marginTop: 40, fontSize: 14 },
  // Modal
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modal: { borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '90%' },
  modalClose: {
    position: 'absolute', top: 16, right: 16, zIndex: 10,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#253045', alignItems: 'center', justifyContent: 'center',
  },
  modalCloseText: { color: COLORS.text, fontSize: 16, fontWeight: 'bold' },
  modalHeader: {
    alignItems: 'center', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    gap: 6,
  },
  modalEmoji: { fontSize: 64 },
  modalName: { color: COLORS.text, fontSize: 22, fontWeight: 'bold' },
  modalTitle: { color: COLORS.textMuted, fontSize: 12 },
  modalBadges: { flexDirection: 'row', gap: 8, marginTop: 4 },
  badge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1,
  },
  modalBody: { padding: 16 },
  levelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  levelLabel: { color: COLORS.text, fontSize: 14, fontWeight: 'bold' },
  levelUpBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
  },
  levelUpDisabled: { backgroundColor: '#253045' },
  levelUpText: { color: '#000', fontSize: 11, fontWeight: 'bold' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  statBox: {
    flex: 1, minWidth: '28%', backgroundColor: '#1A2235',
    borderRadius: 8, padding: 10, alignItems: 'center',
    borderWidth: 1, borderColor: '#253045',
  },
  statLabel: { color: COLORS.textMuted, fontSize: 10 },
  statValue: { color: COLORS.text, fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  loreBox: {
    backgroundColor: '#1A2235', borderRadius: 10, padding: 12, marginBottom: 16,
    borderWidth: 1, borderColor: '#253045',
  },
  loreTitleLabel: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold', marginBottom: 6 },
  loreText: { color: COLORS.textMuted, fontSize: 12, lineHeight: 18 },
  deckBtn: {
    padding: 14, borderRadius: 12, alignItems: 'center', marginBottom: 20,
  },
  deckBtnAdd: { backgroundColor: COLORS.primary },
  deckBtnRemove: { backgroundColor: '#E74C3C' },
  deckBtnDisabled: { backgroundColor: '#253045' },
  deckBtnText: { color: '#000', fontWeight: 'bold', fontSize: 14 },
});
