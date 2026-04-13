// ============================================================
//  Dragon Ball TCG — Card Definitions
// ============================================================
// Card types:
//   "fighter"   — plays to Active Zone, has HP & attacks
//   "support"   — one-shot effect (draw, heal, ki boost)
//   "transform" — upgrades the active fighter (attaches)
// ============================================================

const CARDS = [

  // ────────────────────────────────────────────────────────
  //  FIGHTERS — Saiyans
  // ────────────────────────────────────────────────────────
  {
    id: "goku_base",
    name: "Son Goku",
    type: "fighter",
    rarity: "comun",
    saga: "Saiyan",
    hp: 120,
    kiCost: 1,
    power: 30,
    image: "🟠",
    color: "#FF8C00",
    description: "El Saiyan más poderoso de la Tierra.",
    attacks: [
      { name: "Kamehameha", damage: 30, kiCost: 0 },
      { name: "Kaioken x4",  damage: 50, kiCost: 2 }
    ],
    weakness: "frieza",
    resistance: null
  },
  {
    id: "goku_ssj",
    name: "Goku Super Saiyan",
    type: "fighter",
    rarity: "raro",
    saga: "Frieza",
    hp: 150,
    kiCost: 3,
    power: 50,
    image: "⚡",
    color: "#FFD700",
    description: "¡La leyenda del Super Saiyan se hace realidad!",
    attacks: [
      { name: "Kamehameha SSJ",  damage: 50, kiCost: 0 },
      { name: "Genkidama",       damage: 80, kiCost: 3 }
    ],
    weakness: "cell",
    resistance: "frieza"
  },
  {
    id: "goku_ssj3",
    name: "Goku SSJ3",
    type: "fighter",
    rarity: "epico",
    saga: "Buu",
    hp: 180,
    kiCost: 5,
    power: 70,
    image: "💛",
    color: "#FFD700",
    description: "El poder del SSJ3 hace temblar la tierra.",
    attacks: [
      { name: "Kamehameha x10", damage: 70, kiCost: 0 },
      { name: "Genkidama Gigante", damage: 110, kiCost: 4 }
    ],
    weakness: "beerus",
    resistance: "cell"
  },
  {
    id: "goku_ssjblue",
    name: "Goku SSJ Blue",
    type: "fighter",
    rarity: "legendario",
    saga: "DBS",
    hp: 200,
    kiCost: 6,
    power: 85,
    image: "🔵",
    color: "#00BFFF",
    description: "El ki divino del Super Saiyan Blue.",
    attacks: [
      { name: "Kamehameha Divina", damage: 85, kiCost: 0 },
      { name: "SSGSS Kaioken x20", damage: 130, kiCost: 5 }
    ],
    weakness: "jiren",
    resistance: "frieza"
  },
  {
    id: "goku_ui",
    name: "Goku Ultra Instinto",
    type: "fighter",
    rarity: "legendario",
    saga: "DBS",
    hp: 220,
    kiCost: 8,
    power: 100,
    image: "⬜",
    color: "#C0C0C0",
    description: "La técnica de los Dioses. Movimiento sin pensar.",
    attacks: [
      { name: "Ataque Automático", damage: 100, kiCost: 0 },
      { name: "Autonomous Ultra Instinct", damage: 160, kiCost: 6 }
    ],
    weakness: null,
    resistance: "jiren"
  },
  {
    id: "vegeta_base",
    name: "Vegeta",
    type: "fighter",
    rarity: "comun",
    saga: "Saiyan",
    hp: 110,
    kiCost: 1,
    power: 28,
    image: "🔵",
    color: "#1E90FF",
    description: "El Príncipe de los Saiyans.",
    attacks: [
      { name: "Galick Gun",    damage: 28, kiCost: 0 },
      { name: "Final Flash",  damage: 45, kiCost: 2 }
    ],
    weakness: "frieza",
    resistance: null
  },
  {
    id: "vegeta_ssj",
    name: "Vegeta Super Saiyan",
    type: "fighter",
    rarity: "raro",
    saga: "Cell",
    hp: 140,
    kiCost: 3,
    power: 48,
    image: "💥",
    color: "#FFD700",
    description: "El orgullo de los Saiyans libera su poder.",
    attacks: [
      { name: "Final Flash SSJ", damage: 48, kiCost: 0 },
      { name: "Big Bang Attack", damage: 75, kiCost: 3 }
    ],
    weakness: "cell",
    resistance: "frieza"
  },
  {
    id: "gohan_ssj2",
    name: "Gohan SSJ2",
    type: "fighter",
    rarity: "epico",
    saga: "Cell",
    hp: 170,
    kiCost: 4,
    power: 75,
    image: "⚡",
    color: "#ADFF2F",
    description: "La rabia de Gohan desata el poder más grande.",
    attacks: [
      { name: "Father-Son Kamehameha", damage: 75, kiCost: 0 },
      { name: "Masenko Definitivo",    damage: 115, kiCost: 4 }
    ],
    weakness: "buu",
    resistance: "cell"
  },
  {
    id: "trunks_future",
    name: "Trunks del Futuro",
    type: "fighter",
    rarity: "raro",
    saga: "Cell",
    hp: 130,
    kiCost: 3,
    power: 45,
    image: "⚔️",
    color: "#9370DB",
    description: "Viajero del tiempo que defiende el futuro.",
    attacks: [
      { name: "Masenko",          damage: 45, kiCost: 0 },
      { name: "Burning Attack",   damage: 70, kiCost: 3 }
    ],
    weakness: "black",
    resistance: "frieza"
  },
  {
    id: "broly_ssj",
    name: "Broly SSJ Legendario",
    type: "fighter",
    rarity: "legendario",
    saga: "Movies",
    hp: 210,
    kiCost: 7,
    power: 95,
    image: "🟢",
    color: "#00FF7F",
    description: "El Saiyan Legendario cuyo poder no tiene límite.",
    attacks: [
      { name: "Eraser Cannon",      damage: 95,  kiCost: 0 },
      { name: "Gigantic Pressure",  damage: 145, kiCost: 5 }
    ],
    weakness: null,
    resistance: "goku_base"
  },
  {
    id: "gogeta_ssjblue",
    name: "Gogeta SSJ Blue",
    type: "fighter",
    rarity: "legendario",
    saga: "DBS",
    hp: 230,
    kiCost: 9,
    power: 110,
    image: "🌀",
    color: "#00BFFF",
    description: "La fusión perfecta en su máximo poder.",
    attacks: [
      { name: "Stardust Fall",      damage: 110, kiCost: 0 },
      { name: "Ultimate Kamehameha",damage: 170, kiCost: 7 }
    ],
    weakness: null,
    resistance: "broly_ssj"
  },
  {
    id: "vegito_ssjblue",
    name: "Vegito SSJ Blue",
    type: "fighter",
    rarity: "legendario",
    saga: "DBS",
    hp: 225,
    kiCost: 9,
    power: 108,
    image: "✨",
    color: "#9400D3",
    description: "El guerrero más poderoso del multiverso.",
    attacks: [
      { name: "Spirit Sword",   damage: 108, kiCost: 0 },
      { name: "Final Kamehameha", damage: 165, kiCost: 7 }
    ],
    weakness: null,
    resistance: "zamasu"
  },

  // ────────────────────────────────────────────────────────
  //  FIGHTERS — Villains
  // ────────────────────────────────────────────────────────
  {
    id: "frieza_final",
    name: "Freezer Forma Final",
    type: "fighter",
    rarity: "raro",
    saga: "Frieza",
    hp: 145,
    kiCost: 3,
    power: 50,
    image: "👑",
    color: "#DA70D6",
    description: "El Señor del Universo en su forma definitiva.",
    attacks: [
      { name: "Death Beam",  damage: 50, kiCost: 0 },
      { name: "Death Ball",  damage: 80, kiCost: 3 }
    ],
    weakness: "goku_ssj",
    resistance: "goku_base"
  },
  {
    id: "frieza_golden",
    name: "Freezer Dorado",
    type: "fighter",
    rarity: "epico",
    saga: "DBS",
    hp: 175,
    kiCost: 5,
    power: 72,
    image: "🥇",
    color: "#FFD700",
    description: "El resultado del entrenamiento de Freezer.",
    attacks: [
      { name: "Golden Death Beam", damage: 72,  kiCost: 0 },
      { name: "Supernova Dorada",  damage: 112, kiCost: 4 }
    ],
    weakness: "goku_ssjblue",
    resistance: "vegeta_base"
  },
  {
    id: "cell_perfect",
    name: "Cell Perfecto",
    type: "fighter",
    rarity: "epico",
    saga: "Cell",
    hp: 190,
    kiCost: 5,
    power: 78,
    image: "🧬",
    color: "#7CFC00",
    description: "La forma perfecta del Androide Celular.",
    attacks: [
      { name: "Kamehameha Perfecto", damage: 78,  kiCost: 0 },
      { name: "Solar Kamehameha",    damage: 120, kiCost: 5 }
    ],
    weakness: "gohan_ssj2",
    resistance: "trunks_future"
  },
  {
    id: "majin_buu",
    name: "Majin Buu",
    type: "fighter",
    rarity: "raro",
    saga: "Buu",
    hp: 160,
    kiCost: 3,
    power: 55,
    image: "🍬",
    color: "#FF69B4",
    description: "El demonio mágico sellado por el mago Bibidi.",
    attacks: [
      { name: "Candy Beam",       damage: 55, kiCost: 0 },
      { name: "Massacre Charge",  damage: 85, kiCost: 3 }
    ],
    weakness: "goku_ssj3",
    resistance: "cell_perfect"
  },
  {
    id: "kid_buu",
    name: "Kid Buu",
    type: "fighter",
    rarity: "epico",
    saga: "Buu",
    hp: 200,
    kiCost: 6,
    power: 90,
    image: "👹",
    color: "#FF1493",
    description: "La forma más pura y destructiva de Buu.",
    attacks: [
      { name: "Planet Burst",      damage: 90,  kiCost: 0 },
      { name: "Super Vanishing Ball", damage: 140, kiCost: 5 }
    ],
    weakness: "goku_ssj3",
    resistance: "gohan_ssj2"
  },
  {
    id: "zamasu_fused",
    name: "Zamasu Fusionado",
    type: "fighter",
    rarity: "legendario",
    saga: "DBS",
    hp: 215,
    kiCost: 8,
    power: 98,
    image: "☠️",
    color: "#7B68EE",
    description: "La fusión del dios caído, inmortal y poderoso.",
    attacks: [
      { name: "Holy Wrath",        damage: 98,  kiCost: 0 },
      { name: "Divine Lasso",      damage: 150, kiCost: 6 }
    ],
    weakness: "vegito_ssjblue",
    resistance: "goku_base"
  },
  {
    id: "jiren",
    name: "Jiren",
    type: "fighter",
    rarity: "legendario",
    saga: "DBS",
    hp: 205,
    kiCost: 7,
    power: 95,
    image: "🔴",
    color: "#DC143C",
    description: "El orgullo del Universo 11. Poder que supera los límites.",
    attacks: [
      { name: "Power Impact",       damage: 95,  kiCost: 0 },
      { name: "Overheat Magnetron", damage: 148, kiCost: 6 }
    ],
    weakness: "goku_ui",
    resistance: "goku_ssjblue"
  },
  {
    id: "beerus",
    name: "Beerus, Dios de la Destrucción",
    type: "fighter",
    rarity: "legendario",
    saga: "DBS",
    hp: 240,
    kiCost: 9,
    power: 115,
    image: "😾",
    color: "#9400D3",
    description: "El Dios de la Destrucción del Universo 7.",
    attacks: [
      { name: "Cataclysmic Orb",    damage: 115, kiCost: 0 },
      { name: "Sphere of Destruction", damage: 175, kiCost: 7 }
    ],
    weakness: null,
    resistance: "goku_ssj3"
  },

  // ────────────────────────────────────────────────────────
  //  FIGHTERS — Allies
  // ────────────────────────────────────────────────────────
  {
    id: "piccolo",
    name: "Piccolo",
    type: "fighter",
    rarity: "comun",
    saga: "Saiyan",
    hp: 100,
    kiCost: 1,
    power: 25,
    image: "💚",
    color: "#228B22",
    description: "El Namekiano que se convirtió en mentor de Gohan.",
    attacks: [
      { name: "Makankosappo",   damage: 25, kiCost: 0 },
      { name: "Hellzone Grenade", damage: 40, kiCost: 2 }
    ],
    weakness: "frieza_final",
    resistance: null
  },
  {
    id: "krillin",
    name: "Krilin",
    type: "fighter",
    rarity: "comun",
    saga: "Saiyan",
    hp: 80,
    kiCost: 1,
    power: 20,
    image: "⭕",
    color: "#FF8C00",
    description: "El mejor amigo de Goku y el guerrero humano más fuerte.",
    attacks: [
      { name: "Kienzan",        damage: 20, kiCost: 0 },
      { name: "Destructo Disc", damage: 35, kiCost: 2 }
    ],
    weakness: "frieza_final",
    resistance: null
  },
  {
    id: "android18",
    name: "Androide 18",
    type: "fighter",
    rarity: "raro",
    saga: "Cell",
    hp: 135,
    kiCost: 2,
    power: 40,
    image: "💙",
    color: "#4169E1",
    description: "Androide de energía infinita.",
    attacks: [
      { name: "Infinity Bullet", damage: 40, kiCost: 0 },
      { name: "Energy Barrage",  damage: 65, kiCost: 3 }
    ],
    weakness: "cell_perfect",
    resistance: "goku_base"
  },
  {
    id: "hit",
    name: "Hit",
    type: "fighter",
    rarity: "epico",
    saga: "DBS",
    hp: 165,
    kiCost: 4,
    power: 65,
    image: "⏱️",
    color: "#708090",
    description: "El asesino que manipula el tiempo.",
    attacks: [
      { name: "Time-Skip",          damage: 65,  kiCost: 0 },
      { name: "Pure Progress Assault", damage: 100, kiCost: 4 }
    ],
    weakness: "goku_ssj",
    resistance: "vegeta_ssj"
  },

  // ────────────────────────────────────────────────────────
  //  SUPPORT CARDS
  // ────────────────────────────────────────────────────────
  {
    id: "senzu_bean",
    name: "Semilla del Ermitaño",
    type: "support",
    rarity: "raro",
    saga: "General",
    kiCost: 2,
    image: "🌱",
    color: "#32CD32",
    description: "Restaura 60 HP al personaje activo.",
    effect: { type: "heal", amount: 60 }
  },
  {
    id: "kaioken",
    name: "Kaioken",
    type: "support",
    rarity: "comun",
    saga: "Saiyan",
    kiCost: 1,
    image: "🔴",
    color: "#FF0000",
    description: "El siguiente ataque hace +20 de daño.",
    effect: { type: "powerBoost", amount: 20, turns: 1 }
  },
  {
    id: "training_hyperbolic",
    name: "Cámara Hiperbólica del Tiempo",
    type: "support",
    rarity: "epico",
    saga: "Cell",
    kiCost: 3,
    image: "⏳",
    color: "#8A2BE2",
    description: "Roba 2 cartas adicionales.",
    effect: { type: "draw", amount: 2 }
  },
  {
    id: "dragon_radar",
    name: "Radar de las Esferas del Dragón",
    type: "support",
    rarity: "raro",
    saga: "General",
    kiCost: 2,
    image: "📡",
    color: "#00CED1",
    description: "Recupera 1 Esfera del Dragón perdida.",
    effect: { type: "recoverSphere", amount: 1 }
  },
  {
    id: "fusion_dance",
    name: "Danza de la Fusión",
    type: "support",
    rarity: "legendario",
    saga: "Buu",
    kiCost: 4,
    image: "🕺",
    color: "#FF6347",
    description: "Tu personaje activo gana +30 HP y +15 de poder esta ronda.",
    effect: { type: "fusionBoost", hpBonus: 30, powerBonus: 15 }
  },
  {
    id: "potara",
    name: "Pendientes Potara",
    type: "support",
    rarity: "legendario",
    saga: "Buu",
    kiCost: 5,
    image: "💛",
    color: "#FFD700",
    description: "Tu personaje activo gana +50 HP y +25 de poder esta ronda.",
    effect: { type: "fusionBoost", hpBonus: 50, powerBonus: 25 }
  },
  {
    id: "zenkai_boost",
    name: "Zenkai",
    type: "support",
    rarity: "raro",
    saga: "Saiyan",
    kiCost: 2,
    image: "💪",
    color: "#FF8C00",
    description: "Gana +2 Ki extra este turno.",
    effect: { type: "kiBoost", amount: 2 }
  },
  {
    id: "scouter",
    name: "Escáner de Poder",
    type: "support",
    rarity: "comun",
    saga: "Saiyan",
    kiCost: 0,
    image: "🔭",
    color: "#00FF00",
    description: "Roba 1 carta.",
    effect: { type: "draw", amount: 1 }
  },

  // ────────────────────────────────────────────────────────
  //  TRANSFORM CARDS (upgrade active fighter)
  // ────────────────────────────────────────────────────────
  {
    id: "transform_ssj",
    name: "Transformación: Super Saiyan",
    type: "transform",
    rarity: "raro",
    saga: "Frieza",
    kiCost: 3,
    image: "⚡",
    color: "#FFD700",
    description: "+40 HP, +20 poder al personaje activo.",
    effect: { hpBonus: 40, powerBonus: 20 }
  },
  {
    id: "transform_ssj2",
    name: "Transformación: SSJ2",
    type: "transform",
    rarity: "epico",
    saga: "Cell",
    kiCost: 4,
    image: "💥",
    color: "#FFD700",
    description: "+60 HP, +30 poder al personaje activo.",
    effect: { hpBonus: 60, powerBonus: 30 }
  },
  {
    id: "transform_ultra",
    name: "Transformación: Ultra Ego",
    type: "transform",
    rarity: "legendario",
    saga: "DBS",
    kiCost: 6,
    image: "👁️",
    color: "#9400D3",
    description: "+80 HP, +40 poder al personaje activo.",
    effect: { hpBonus: 80, powerBonus: 40 }
  }
];

// ──────────────────────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────────────────────

/** Returns a deep copy of a card by id */
function getCardById(id) {
  const card = CARDS.find(c => c.id === id);
  if (!card) return null;
  return JSON.parse(JSON.stringify(card));
}

/** Returns a shuffled deck of `size` cards drawn from the full pool */
function buildDeck(size = 20) {
  // Weight distribution: legendarios are rare
  const weights = { comun: 4, raro: 3, epico: 2, legendario: 1 };
  const pool = [];
  CARDS.forEach(c => {
    const w = weights[c.rarity] || 1;
    for (let i = 0; i < w; i++) pool.push(c.id);
  });
  // Shuffle pool and pick `size` cards (allow repeats up to 2 per card)
  const shuffled = shuffle([...pool]);
  const counts = {};
  const deck = [];
  for (const id of shuffled) {
    if (deck.length >= size) break;
    counts[id] = (counts[id] || 0) + 1;
    if (counts[id] <= 2) deck.push(getCardById(id));
  }
  // Fill remainder if needed
  while (deck.length < size) {
    const fallback = getCardById("goku_base");
    deck.push(fallback);
  }
  return shuffle(deck);
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const RARITY_COLORS = {
  comun:      "#9E9E9E",
  raro:       "#2196F3",
  epico:      "#9C27B0",
  legendario: "#FF8F00"
};

const RARITY_LABELS = {
  comun:      "Común",
  raro:       "Raro",
  epico:      "Épico",
  legendario: "Legendario"
};
