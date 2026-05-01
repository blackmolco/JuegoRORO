import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CHARACTERS } from '../data/characters';
import { performSummon } from '../game/summonSystem';
import { buildUnit } from '../game/battleEngine';

const STORAGE_KEY = '@grand_line_save';

const initialState = {
  playerName: 'Pirata',
  playerLevel: 1,
  playerExp: 0,
  gold: 5000,
  crystals: 500,
  energy: 50,
  maxEnergy: 50,
  pityCount: 0,

  // Collection: { [ownedId]: { id, characterId, level, exp, stars, runeBonus, runes[] } }
  collection: {},
  // Deck for battle (array of ownedIds, max 3)
  battleDeck: [],
  // Progress
  completedStages: [],
  arenaWins: 0,
  arenaLosses: 0,
  // Stats
  totalBattles: 0,
  totalWins: 0,
};

// Give starter characters to new players
const buildStarterCollection = () => {
  const starters = ['nami', 'usopp', 'coby'];
  const collection = {};
  starters.forEach((id, idx) => {
    const ownedId = `owned_${id}_0`;
    collection[ownedId] = {
      id: ownedId,
      characterId: id,
      level: 5,
      exp: 0,
      runeBonus: 0,
      runes: [],
    };
  });
  return collection;
};

export const useGameStore = create((set, get) => ({
  ...initialState,
  isLoaded: false,

  // ─── Persistence ───────────────────────────────────────────
  loadGame: async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        set({ ...data, isLoaded: true });
      } else {
        const starterCollection = buildStarterCollection();
        const starterDeck = Object.keys(starterCollection).slice(0, 3);
        set({ ...initialState, collection: starterCollection, battleDeck: starterDeck, isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  saveGame: async () => {
    try {
      const state = get();
      const toSave = {
        playerName: state.playerName,
        playerLevel: state.playerLevel,
        playerExp: state.playerExp,
        gold: state.gold,
        crystals: state.crystals,
        energy: state.energy,
        maxEnergy: state.maxEnergy,
        pityCount: state.pityCount,
        collection: state.collection,
        battleDeck: state.battleDeck,
        completedStages: state.completedStages,
        arenaWins: state.arenaWins,
        arenaLosses: state.arenaLosses,
        totalBattles: state.totalBattles,
        totalWins: state.totalWins,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {}
  },

  resetGame: async () => {
    const starterCollection = buildStarterCollection();
    const starterDeck = Object.keys(starterCollection).slice(0, 3);
    const fresh = { ...initialState, collection: starterCollection, battleDeck: starterDeck, isLoaded: true };
    set(fresh);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  },

  // ─── Summon ────────────────────────────────────────────────
  summon: (count = 1) => {
    const state = get();
    const cost = count === 10 ? 1350 : 150;
    if (state.crystals < cost) return { success: false, reason: 'Cristales insuficientes' };

    const { results, newPity } = performSummon(count, state.pityCount);
    const newCollection = { ...state.collection };

    results.forEach((r) => {
      const ownedId = `owned_${r.characterId}_${Date.now()}_${Math.random()}`;
      newCollection[ownedId] = {
        id: ownedId,
        characterId: r.characterId,
        level: 1,
        exp: 0,
        runeBonus: 0,
        runes: [],
      };
    });

    set({ crystals: state.crystals - cost, collection: newCollection, pityCount: newPity });
    get().saveGame();
    return { success: true, results };
  },

  // ─── Deck management ──────────────────────────────────────
  setDeck: (ownedIds) => {
    const capped = ownedIds.slice(0, 3);
    set({ battleDeck: capped });
    get().saveGame();
  },

  addToDeck: (ownedId) => {
    const { battleDeck } = get();
    if (battleDeck.includes(ownedId)) return;
    if (battleDeck.length >= 3) return;
    set({ battleDeck: [...battleDeck, ownedId] });
    get().saveGame();
  },

  removeFromDeck: (ownedId) => {
    const { battleDeck } = get();
    set({ battleDeck: battleDeck.filter((id) => id !== ownedId) });
    get().saveGame();
  },

  // ─── Battle results ───────────────────────────────────────
  recordBattleResult: (outcome, stageId, rewards) => {
    const state = get();
    const isWin = outcome === 'victory';
    const expGain = isWin ? (rewards?.exp ?? 100) : 50;
    const goldGain = isWin ? (rewards?.gold ?? 500) : 0;
    const crystalGain = isWin ? (rewards?.crystals ?? 10) : 0;

    let newExp = state.playerExp + expGain;
    let newLevel = state.playerLevel;
    const expPerLevel = newLevel * 500;
    if (newExp >= expPerLevel) {
      newExp -= expPerLevel;
      newLevel++;
    }

    const newCompleted = isWin && stageId && !state.completedStages.includes(stageId)
      ? [...state.completedStages, stageId]
      : state.completedStages;

    set({
      playerLevel: newLevel,
      playerExp: newExp,
      gold: state.gold + goldGain,
      crystals: state.crystals + crystalGain,
      totalBattles: state.totalBattles + 1,
      totalWins: state.totalWins + (isWin ? 1 : 0),
      completedStages: newCompleted,
    });
    get().saveGame();
    return { expGain, goldGain, crystalGain };
  },

  recordArenaResult: (won) => {
    const state = get();
    set({
      arenaWins: state.arenaWins + (won ? 1 : 0),
      arenaLosses: state.arenaLosses + (won ? 0 : 1),
      crystals: state.crystals + (won ? 30 : 5),
      gold: state.gold + (won ? 2000 : 500),
    });
    get().saveGame();
  },

  // ─── Character upgrade ────────────────────────────────────
  levelUpCharacter: (ownedId) => {
    const state = get();
    const char = state.collection[ownedId];
    if (!char) return false;
    const cost = char.level * 200;
    if (state.gold < cost) return false;

    const updated = { ...char, level: Math.min(char.level + 1, 60) };
    set({
      gold: state.gold - cost,
      collection: { ...state.collection, [ownedId]: updated },
    });
    get().saveGame();
    return true;
  },

  // ─── Getters ──────────────────────────────────────────────
  getBattleUnits: () => {
    const { battleDeck, collection } = get();
    return battleDeck
      .map((ownedId) => {
        const owned = collection[ownedId];
        if (!owned) return null;
        return buildUnit({ ...owned, id: owned.characterId, characterId: owned.characterId });
      })
      .filter(Boolean);
  },

  getCharacterData: (ownedId) => {
    const { collection } = get();
    const owned = collection[ownedId];
    if (!owned) return null;
    return { ...owned, base: CHARACTERS[owned.characterId] };
  },

  useEnergy: (amount) => {
    const { energy } = get();
    if (energy < amount) return false;
    set({ energy: energy - amount });
    get().saveGame();
    return true;
  },
}));
