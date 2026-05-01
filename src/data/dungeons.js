// Dungeons organized as islands. Each island has stages.
// Enemy teams are arrays of { characterId, level, runeBonus }

export const ISLANDS = [
  {
    id: 'east_blue',
    name: 'Mar del Este',
    icon: '⚓',
    description: 'Las aguas donde comenzó la leyenda. Piratas y Marines novatos.',
    unlockLevel: 1,
    stages: [
      {
        id: 'eb_1', name: 'Puerto Foosha', stageNum: 1, energy: 3,
        rewards: { exp: 100, crystals: 10, gold: 500 },
        enemies: [
          { id: 'pirate_grunt', level: 5 },
          { id: 'pirate_grunt', level: 5 },
        ],
        boss: null,
      },
      {
        id: 'eb_2', name: 'Isla del Bandido', stageNum: 2, energy: 3,
        rewards: { exp: 150, crystals: 10, gold: 700 },
        enemies: [
          { id: 'pirate_grunt', level: 8 },
          { id: 'marine_grunt', level: 8 },
          { id: 'pirate_grunt', level: 8 },
        ],
        boss: null,
      },
      {
        id: 'eb_3', name: 'Base del Capitán Kuro', stageNum: 3, energy: 4,
        rewards: { exp: 200, crystals: 15, gold: 1000 },
        enemies: [
          { id: 'baroque_agent', level: 10 },
          { id: 'pirate_grunt', level: 12 },
        ],
        boss: { id: 'alvida', level: 15, runeBonus: 0.1 },
      },
      {
        id: 'eb_4', name: 'Marinford del Este', stageNum: 4, energy: 5,
        rewards: { exp: 300, crystals: 20, gold: 1500 },
        enemies: [
          { id: 'marine_grunt', level: 15 },
          { id: 'coby', level: 15 },
          { id: 'marine_grunt', level: 15 },
        ],
        boss: { id: 'tashigi', level: 18, runeBonus: 0.15 },
      },
      {
        id: 'eb_5', name: 'Arlong Park', stageNum: 5, energy: 6,
        rewards: { exp: 500, crystals: 30, gold: 2500 },
        enemies: [
          { id: 'baroque_agent', level: 20 },
          { id: 'marine_grunt', level: 20 },
        ],
        boss: { id: 'smoker', level: 25, runeBonus: 0.2 },
      },
    ],
  },
  {
    id: 'grand_line',
    name: 'Grand Line',
    icon: '🗺️',
    description: 'El océano más peligroso. Piratas de primera categoría.',
    unlockLevel: 10,
    stages: [
      {
        id: 'gl_1', name: 'Whiskey Peak', stageNum: 1, energy: 5,
        rewards: { exp: 600, crystals: 25, gold: 3000 },
        enemies: [
          { id: 'baroque_agent', level: 25 },
          { id: 'baroque_agent', level: 25 },
          { id: 'baroque_agent', level: 28 },
        ],
        boss: null,
      },
      {
        id: 'gl_2', name: 'Alabasta', stageNum: 2, energy: 5,
        rewards: { exp: 800, crystals: 30, gold: 4000 },
        enemies: [
          { id: 'baroque_agent', level: 30 },
          { id: 'tashigi', level: 30 },
        ],
        boss: { id: 'crocodile', level: 35, runeBonus: 0.2 },
      },
      {
        id: 'gl_3', name: 'Jaya', stageNum: 3, energy: 6,
        rewards: { exp: 1000, crystals: 35, gold: 5000 },
        enemies: [
          { id: 'buggy', level: 33 },
          { id: 'alvida', level: 33 },
        ],
        boss: { id: 'buggy', level: 38, runeBonus: 0.25 },
      },
      {
        id: 'gl_4', name: 'Skypiea', stageNum: 4, energy: 7,
        rewards: { exp: 1200, crystals: 40, gold: 6000 },
        enemies: [
          { id: 'enel', level: 35 },
          { id: 'marine_grunt', level: 35 },
          { id: 'baroque_agent', level: 35 },
        ],
        boss: { id: 'enel', level: 42, runeBonus: 0.3 },
      },
      {
        id: 'gl_5', name: 'Enies Lobby', stageNum: 5, energy: 8,
        rewards: { exp: 2000, crystals: 60, gold: 10000 },
        enemies: [
          { id: 'robin', level: 38 },
          { id: 'tashigi', level: 40 },
        ],
        boss: { id: 'smoker', level: 45, runeBonus: 0.35 },
      },
    ],
  },
  {
    id: 'new_world',
    name: 'Nuevo Mundo',
    icon: '🌋',
    description: 'El territorio de los Yonkou. Solo los más fuertes sobreviven.',
    unlockLevel: 25,
    stages: [
      {
        id: 'nw_1', name: 'Punk Hazard', stageNum: 1, energy: 8,
        rewards: { exp: 2500, crystals: 50, gold: 12000 },
        enemies: [
          { id: 'smoker', level: 45 },
          { id: 'tashigi', level: 45 },
        ],
        boss: { id: 'law', level: 50, runeBonus: 0.3 },
      },
      {
        id: 'nw_2', name: 'Dressrosa', stageNum: 2, energy: 9,
        rewards: { exp: 3000, crystals: 60, gold: 15000 },
        enemies: [
          { id: 'crocodile', level: 48 },
          { id: 'buggy', level: 48 },
          { id: 'smoker', level: 50 },
        ],
        boss: { id: 'doflamingo', level: 55, runeBonus: 0.35 },
      },
      {
        id: 'nw_3', name: 'Whole Cake Island', stageNum: 3, energy: 10,
        rewards: { exp: 4000, crystals: 80, gold: 20000 },
        enemies: [
          { id: 'hancock', level: 52 },
          { id: 'law', level: 52 },
        ],
        boss: { id: 'katakuri', level: 58, runeBonus: 0.4 },
      },
      {
        id: 'nw_4', name: 'Wano', stageNum: 4, energy: 12,
        rewards: { exp: 6000, crystals: 100, gold: 30000 },
        enemies: [
          { id: 'zoro', level: 55 },
          { id: 'sanji', level: 55 },
          { id: 'law', level: 55 },
        ],
        boss: { id: 'kaido', level: 60, runeBonus: 0.5 },
      },
      {
        id: 'nw_5', name: 'Marineford', stageNum: 5, energy: 15,
        rewards: { exp: 10000, crystals: 200, gold: 50000 },
        enemies: [
          { id: 'shanks', level: 58 },
          { id: 'katakuri', level: 58 },
        ],
        boss: { id: 'whitebeard', level: 65, runeBonus: 0.6 },
      },
    ],
  },
];

export const getIslandById = (id) => ISLANDS.find((i) => i.id === id) || null;
export const getStageById = (stageId) => {
  for (const island of ISLANDS) {
    const stage = island.stages.find((s) => s.id === stageId);
    if (stage) return { stage, island };
  }
  return null;
};
