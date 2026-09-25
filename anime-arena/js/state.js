/* =========================================================
   Estado del jugador: guardado, unidades, estadísticas,
   invocaciones y progresión.
   ========================================================= */

const SAVE_KEY = 'animeSkyArena_save_v1';

let G = null; // estado global

function newGame(starterId) {
  G = {
    version: 1,
    mana: 25000,
    crystals: 300,
    scrolls: { unknown: 5, mystic: 3, ld: 0 },
    units: [],
    team: [],
    progress: {},       // stageKey -> estrellas (1..3)
    arena: { points: 1000, wins: 0, losses: 0, opponents: null },
    nextUid: 1,
    lastDaily: null,
    settings: { speed: 1, auto: false },
    stats: { summons: 0, battles: 0 },
  };
  const starter = addUnit(starterId, 5);
  const others = ['krilin', 'yamcha', 'usopp'].map(id => addUnit(id, 3));
  G.team = [starter.uid, ...others.map(u => u.uid)];
  save();
}

function save() {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(G)); } catch (e) { /* sin almacenamiento */ }
}

function load() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    G = JSON.parse(raw);
    // Migraciones suaves
    G.settings = Object.assign({ speed: 1, auto: false }, G.settings);
    G.stats = Object.assign({ summons: 0, battles: 0 }, G.stats);
    G.units = G.units.filter(u => CHARS[u.id]);
    G.team = G.team.filter(uid => getUnit(uid));
    return true;
  } catch (e) { return false; }
}

function resetGame() {
  try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* nada */ }
  G = null;
}

/* ---------- Unidades ---------- */
function addUnit(id, level = 1) {
  const u = { uid: G.nextUid++, id, level, xp: 0, awakened: false, sl: 0, locked: false };
  G.units.push(u);
  return u;
}
function getUnit(uid) { return G.units.find(u => u.uid === uid); }
function removeUnit(uid) {
  G.units = G.units.filter(u => u.uid !== uid);
  G.team = G.team.filter(t => t !== uid);
}

function xpNeeded(level) { return Math.round(60 + level * level * 6); }

/** Da XP a una unidad; devuelve cuántos niveles subió. */
function giveXp(u, amount) {
  let ups = 0;
  if (u.level >= MAX_LEVEL) return 0;
  u.xp += amount;
  while (u.level < MAX_LEVEL && u.xp >= xpNeeded(u.level)) {
    u.xp -= xpNeeded(u.level);
    u.level++; ups++;
  }
  if (u.level >= MAX_LEVEL) u.xp = 0;
  return ups;
}

function unitName(u) {
  const ch = CHARS[u.id];
  return u.awakened ? ch.name + ' ✦' : ch.name;
}

/** Estadísticas finales de una unidad (sin líder). */
function unitStats(u) {
  const ch = CHARS[u.id];
  const r = ROLES[ch.role];
  const sm = STAR_MULT[ch.stars];
  const lv = 0.35 + 0.65 * (u.level - 1) / (MAX_LEVEL - 1);
  const aw = u.awakened ? 1.15 : 1;
  return {
    hp: Math.round(10500 * r.hp * sm * lv * aw),
    atk: Math.round(760 * r.atk * sm * lv * aw),
    def: Math.round(600 * r.def * sm * lv * aw),
    spd: ch.spd + (u.awakened ? 8 : 0),
    cr: r.cr + (u.awakened ? 5 : 0),
    cdmg: r.cdmg,
    res: r.res,
    acc: r.acc + (u.awakened ? 10 : 0),
  };
}

function unitPower(u) {
  const s = unitStats(u);
  return Math.round(s.hp / 10 + s.atk * 1.6 + s.def * 1.2 + s.spd * 4 + (s.cr + s.cdmg) * 3);
}

function teamPower(uids) {
  return uids.map(getUnit).filter(Boolean).reduce((a, u) => a + unitPower(u), 0);
}

const STAT_NAMES = { hp: 'PV', atk: 'ATQ', def: 'DEF', spd: 'VEL', cr: 'Prob. Crítico', cdmg: 'Daño Crítico', res: 'Resistencia', acc: 'Precisión' };

function leaderText(ld) {
  if (!ld) return 'Sin habilidad de líder';
  const where = ld.el ? `aliados de ${ELEMENTS[ld.el].name}` : 'todos los aliados';
  const pct = ['cr', 'res', 'acc', 'cdmg'].includes(ld.stat) ? `+${ld.pct}%` : `+${ld.pct}%`;
  return `${STAT_NAMES[ld.stat]} ${pct} para ${where}`;
}

/* ---------- Economía ---------- */
function canAfford(cost) {
  return (!cost.mana || G.mana >= cost.mana) && (!cost.crystals || G.crystals >= cost.crystals);
}
function pay(cost) {
  if (!canAfford(cost)) return false;
  G.mana -= cost.mana || 0;
  G.crystals -= cost.crystals || 0;
  return true;
}

function sellValue(u) { return CHARS[u.id].stars ** 2 * 400 + u.level * 60; }
function feedXp(fodder) { return CHARS[fodder.id].stars ** 2 * 120 + fodder.level * 90 * CHARS[fodder.id].stars; }
function feedCost(target, n) { return 150 * target.level * n; }
const AWAKEN_COST = 15000;

/* ---------- Invocación ---------- */
function rollStars(rates) {
  const total = Object.values(rates).reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (const [st, w] of Object.entries(rates)) { r -= w; if (r < 0) return +st; }
  return +Object.keys(rates)[0];
}

function summonOne(type) {
  const sc = SCROLLS[type];
  let stars = rollStars(sc.rates);
  let pool = CHAR_LIST.filter(c => sc.pool(c));
  // En el pergamino místico, Luz/Oscuridad solo aparece con probabilidad reducida
  if (type === 'mystic') {
    const ld = Math.random() * 100 < sc.ldRate;
    pool = pool.filter(c => ld ? (c.el === 'luz' || c.el === 'oscuridad') : (c.el !== 'luz' && c.el !== 'oscuridad'));
  }
  let candidates = pool.filter(c => c.stars === stars);
  // si no hay candidatos para esa rareza, baja/sube hasta encontrar
  let tries = 0;
  while (!candidates.length && tries < 6) {
    stars = stars > 2 ? stars - 1 : 5;
    candidates = pool.filter(c => c.stars === stars);
    tries++;
  }
  const ch = candidates[Math.floor(Math.random() * candidates.length)];
  const u = addUnit(ch.id, 1);
  G.stats.summons++;
  return u;
}

/* ---------- Campaña ---------- */
function stageKey(r, s) { return `${r}-${s}`; }
function stageUnlocked(r, s) {
  if (r === 0 && s === 0) return true;
  if (s > 0) return !!G.progress[stageKey(r, s - 1)];
  return !!G.progress[stageKey(r - 1, STAGES_PER_REGION - 1)];
}
function stageLevel(r, s) { return REGIONS[r].baseLv + Math.round(s * 1.3); }

// RNG determinista (para que cada fase tenga siempre los mismos enemigos)
function seededRng(seed) {
  let x = seed * 9301 + 49297;
  return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; };
}

function buildStage(r, s) {
  const reg = REGIONS[r];
  const rng = seededRng((r + 1) * 100 + s * 7 + 3);
  const lv = stageLevel(r, s);
  const pick = () => reg.pool[Math.floor(rng() * reg.pool.length)];
  const waves = [];
  const count = s === 0 && r === 0 ? 2 : 3;
  for (let w = 0; w < 3; w++) {
    const wave = [];
    const n = w === 2 ? count - 1 : count;
    for (let i = 0; i < n; i++) wave.push({ id: pick(), level: Math.max(1, lv - 1 + w), mob: true });
    if (w === 2) wave.splice(Math.floor(n / 2), 0, { id: reg.bosses[s], level: lv + 2, boss: true });
    waves.push(wave);
  }
  return {
    waves, level: lv,
    reward: {
      mana: 350 + (r * 5 + s) * 220,
      xp: 60 + (r * 5 + s) * 55,
      firstCrystals: s === STAGES_PER_REGION - 1 ? 60 : 25,
    },
  };
}

/* ---------- Arena ---------- */
function arenaRank(points) {
  if (points >= 1800) return { name: 'Leyenda', icon: '👑' };
  if (points >= 1500) return { name: 'Guardián', icon: '🛡️' };
  if (points >= 1300) return { name: 'Retador', icon: '⚔️' };
  if (points >= 1100) return { name: 'Luchador', icon: '🥊' };
  return { name: 'Principiante', icon: '🌱' };
}

function avgTeamLevel() {
  const units = G.team.map(getUnit).filter(Boolean);
  if (!units.length) return 1;
  return units.reduce((a, u) => a + u.level, 0) / units.length;
}

const ARENA_NAMES = ['KameSennin99', 'ZanpakutoMaster', 'PiratKing', 'NeoTokyo88', 'HokageFan', 'SaiyanPride',
  'Espada4', 'MugiwaraCrew', 'Capsule_Kid', 'HollowIchi', 'GomuGomu', 'SharinganX', 'ShinigamiRoro', 'NakamaPower'];

function generateArenaOpponents() {
  const lvl = avgTeamLevel();
  const tier = Math.min(4, Math.floor((G.arena.points - 900) / 250));
  const opps = [];
  for (let i = 0; i < 3; i++) {
    const diff = [-2, 0, 2][i];
    const maxStars = Math.min(5, 3 + Math.max(0, tier) + (i === 2 ? 1 : 0));
    const pool = CHAR_LIST.filter(c => c.stars <= maxStars && c.stars >= Math.max(2, maxStars - 2));
    const team = [];
    for (let k = 0; k < 4; k++) {
      const c = pool[Math.floor(Math.random() * pool.length)];
      team.push({ id: c.id, level: Math.max(1, Math.min(MAX_LEVEL, Math.round(lvl + diff + (Math.random() * 2 - 1)))), awakened: Math.random() < 0.15 * tier });
    }
    opps.push({
      name: ARENA_NAMES[Math.floor(Math.random() * ARENA_NAMES.length)],
      points: Math.max(900, G.arena.points + diff * 40 + Math.round(Math.random() * 40 - 20)),
      team,
      difficulty: ['Fácil', 'Normal', 'Difícil'][i],
    });
  }
  G.arena.opponents = opps;
  save();
}

/* ---------- Recompensa diaria ---------- */
function todayStr() { return new Date().toISOString().slice(0, 10); }
function dailyAvailable() { return G.lastDaily !== todayStr(); }
function claimDaily() {
  if (!dailyAvailable()) return null;
  G.lastDaily = todayStr();
  G.crystals += 100;
  G.scrolls.mystic += 1;
  G.mana += 10000;
  save();
  return { crystals: 100, mystic: 1, mana: 10000 };
}
