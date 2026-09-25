/* =========================================================
   Anime Sky Arena — datos del juego
   Elementos, estados, personajes, campaña.
   ========================================================= */

const MAX_LEVEL = 40;

/* ---------- Elementos (triángulo + Luz/Oscuridad) ---------- */
const ELEMENTS = {
  fuego:     { name: 'Fuego',     color: '#ff5a36', dark: '#8a1c0a', icon: '🔥', beats: 'viento' },
  agua:      { name: 'Agua',      color: '#3aa7ff', dark: '#0c3d78', icon: '💧', beats: 'fuego' },
  viento:    { name: 'Viento',    color: '#f2c230', dark: '#7a5a00', icon: '🌪️', beats: 'agua' },
  luz:       { name: 'Luz',       color: '#fff3b0', dark: '#8c7a2a', icon: '✨', beats: 'oscuridad' },
  oscuridad: { name: 'Oscuridad', color: '#b073ff', dark: '#3a1470', icon: '🌙', beats: 'luz' },
};

/** 1 = ventaja, -1 = desventaja, 0 = neutro */
function elemRel(att, def) {
  if (ELEMENTS[att].beats === def) return 1;
  if (ELEMENTS[def].beats === att) return -1;
  return 0;
}

/* ---------- Roles (modificadores de estadísticas) ---------- */
const ROLES = {
  atk: { name: 'Ataque',  hp: 0.88, atk: 1.2,  def: 0.85, cr: 25, cdmg: 70, res: 15, acc: 0 },
  def: { name: 'Defensa', hp: 1.0,  atk: 0.85, def: 1.3,  cr: 15, cdmg: 50, res: 25, acc: 0 },
  hp:  { name: 'Vida',    hp: 1.3,  atk: 0.85, def: 0.95, cr: 15, cdmg: 50, res: 20, acc: 0 },
  sup: { name: 'Soporte', hp: 1.05, atk: 0.9,  def: 1.05, cr: 15, cdmg: 50, res: 25, acc: 25 },
};

const STAR_MULT = { 2: 0.62, 3: 0.74, 4: 0.87, 5: 1 };

/* ---------- Estados alterados ---------- */
const EFFECTS = {
  // beneficiosos
  atkUp:    { name: 'Ataque +',        icon: '🗡️', good: true,  desc: '+50% ATQ' },
  defUp:    { name: 'Defensa +',       icon: '🛡️', good: true,  desc: '+70% DEF' },
  spdUp:    { name: 'Velocidad +',     icon: '💨', good: true,  desc: '+30% VEL' },
  critUp:   { name: 'Crítico +',       icon: '🎯', good: true,  desc: '+30% prob. crítico' },
  immunity: { name: 'Inmunidad',       icon: '✳️', good: true,  desc: 'Inmune a efectos dañinos' },
  regen:    { name: 'Regeneración',    icon: '💚', good: true,  desc: 'Recupera 15% PV por turno' },
  shield:   { name: 'Escudo',          icon: '🔰', good: true,  desc: 'Absorbe daño' },
  // dañinos
  atkDown:  { name: 'Ataque −',        icon: '🔻', good: false, desc: '−50% ATQ' },
  defDown:  { name: 'Defensa −',       icon: '💔', good: false, desc: '−70% DEF' },
  slow:     { name: 'Lentitud',        icon: '🐌', good: false, desc: '−30% VEL' },
  stun:     { name: 'Aturdido',        icon: '💫', good: false, desc: 'Pierde su turno' },
  dot:      { name: 'Daño continuo',   icon: '☠️', good: false, desc: 'Pierde 5% PV por turno (acumulable)' },
  silence:  { name: 'Sellado',         icon: '🔇', good: false, desc: 'Solo puede usar la habilidad 1' },
};

/* ---------- Constructores de habilidades ---------- */
const hit  = (name, mult, o = {}) => ({ name, target: 'enemy',   mult, hits: 1, cd: 0, fx: [], ...o });
const aoe  = (name, mult, o = {}) => ({ name, target: 'enemies', mult, hits: 1, cd: 0, fx: [], ...o });
const sup  = (name, target, o = {}) => ({ name, target, mult: 0, hits: 1, cd: 0, fx: [], ...o });

const deb    = (id, turns, chance = 100, to = 'target') => ({ t: 'debuff', id, turns, chance, to });
const buf    = (id, turns, to = 'self') => ({ t: 'buff', id, turns, to });
const heal   = (pct, to = 'self') => ({ t: 'heal', pct, to });
const atb    = (amt, to = 'self') => ({ t: 'atb', amt, to });
const extra  = (chance = 100) => ({ t: 'extra', chance });
const cleanse = (to = 'self', n = 1) => ({ t: 'cleanse', to, n });
const strip  = (n, to = 'target') => ({ t: 'strip', n, to });
const shield = (pct, turns, to = 'self') => ({ t: 'shield', pct, turns, to });

/* ---------- Personajes ----------
   look: apariencia del retrato generado (ver portrait.js)
   leader: habilidad de líder (stat, pct, el opcional) */
const CHAR_LIST = [
  /* ===== Dragon Ball Z ===== */
  { id: 'goku', name: 'Son Goku', series: 'Dragon Ball Z', el: 'luz', stars: 5, role: 'atk', spd: 108,
    look: { hair: '#1b1b1b', style: 'goku', skin: '#f6cfa6', eyes: '#1b1b1b', outfit: '#f47b20', collar: '#1d3fa6', mouth: 'grin' },
    leader: { stat: 'atk', pct: 25 },
    skills: [
      hit('Puño Kaiō-ken', 3.7, { desc: 'Golpe veloz que llena un 20% su barra de ataque.', fx: [atb(0.2)] }),
      hit('Kamehameha', 5.4, { cd: 3, desc: 'La técnica insignia de la Escuela Tortuga.', fx: [deb('stun', 1, 35)] }),
      aoe('Genkidama', 4.4, { cd: 5, desc: 'Reúne la energía del universo y la lanza contra todos.', fx: [deb('defDown', 2, 100)] }),
    ] },
  { id: 'vegeta', name: 'Vegeta', series: 'Dragon Ball Z', el: 'oscuridad', stars: 5, role: 'atk', spd: 104,
    look: { hair: '#1b1b1b', style: 'vegeta', skin: '#f3c9a0', eyes: '#1b1b1b', outfit: '#1f3fa8', collar: '#f2f2f2', brow: 'angry', mouth: 'smirk' },
    leader: { stat: 'cdmg', pct: 35 },
    skills: [
      hit('Ráfaga Saiyajin', 2.0, { hits: 2, desc: 'Dos golpes rápidos.', fx: [deb('defDown', 2, 30)] }),
      sup('Orgullo del Príncipe', 'self', { cd: 4, desc: 'Se potencia y actúa de nuevo.', fx: [buf('atkUp', 3), buf('critUp', 3), extra(100)] }),
      hit('Final Flash', 7.2, { cd: 5, ignoreDef: 0.3, desc: 'Ataque devastador que ignora 30% de la defensa.' }),
    ] },
  { id: 'piccolo', name: 'Piccolo', series: 'Dragon Ball Z', el: 'viento', stars: 4, role: 'def', spd: 101,
    look: { hair: '#6bbf3a', style: 'bald', skin: '#7fcf4a', eyes: '#1b1b1b', outfit: '#5b2a86', collar: '#f2f2f2', extras: ['turban', 'antenna'], brow: 'angry' },
    leader: { stat: 'def', pct: 30 },
    skills: [
      hit('Rayo de los Ojos', 3.4, { desc: 'Puede bajar el ataque.', fx: [deb('atkDown', 2, 40)] }),
      hit('Makankōsappō', 4.8, { cd: 4, ignoreDef: 0.5, desc: 'Rayo perforante que ignora 50% de la defensa.' }),
      sup('Regeneración Namekiana', 'allies', { cd: 4, desc: 'Cura a todo el equipo y elimina un efecto dañino.', fx: [heal(0.25, 'allies'), cleanse('allies')] }),
    ] },
  { id: 'gohan', name: 'Son Gohan', series: 'Dragon Ball Z', el: 'agua', stars: 4, role: 'atk', spd: 103,
    look: { hair: '#1b1b1b', style: 'spiky', skin: '#f6cfa6', eyes: '#1b1b1b', outfit: '#5b2a86', collar: '#e84b2a', brow: 'angry' },
    leader: { stat: 'cdmg', pct: 25 },
    skills: [
      hit('Masenko', 3.6, { desc: 'Onda de energía concentrada.' }),
      sup('Poder Oculto', 'self', { cd: 4, desc: 'Libera su poder oculto y vuelve a actuar.', fx: [buf('atkUp', 3), buf('critUp', 3), extra(100)] }),
      aoe('Kamehameha Padre-Hijo', 4.0, { cd: 5, desc: 'Puede bajar el ataque de todos los enemigos.', fx: [deb('atkDown', 2, 50)] }),
    ] },
  { id: 'frieza', name: 'Freezer', series: 'Dragon Ball Z', el: 'oscuridad', stars: 5, role: 'atk', spd: 106,
    look: { hair: '#8b3fb8', style: 'bald', skin: '#f2f0f5', eyes: '#c0152f', outfit: '#f2f0f5', collar: '#8b3fb8', extras: ['dome', 'lipstick'], mouth: 'smirk' },
    leader: { stat: 'atk', pct: 33, el: 'oscuridad' },
    skills: [
      hit('Rayo Mortal', 3.6, { desc: 'Puede causar daño continuo.', fx: [deb('dot', 2, 60)] }),
      hit('Disco Destructor', 5.0, { cd: 3, ignoreDef: 0.25, desc: 'Corta a través de todo y elimina un efecto beneficioso.', fx: [strip(1)] }),
      aoe('Supernova', 3.9, { cd: 5, desc: 'Una esfera de destrucción total. Aplica 2 daños continuos.', fx: [deb('dot', 2, 80), deb('dot', 2, 80)] }),
    ] },
  { id: 'cell', name: 'Cell Perfecto', series: 'Dragon Ball Z', el: 'viento', stars: 5, role: 'hp', spd: 100,
    look: { hair: '#2b2b2b', style: 'bald', skin: '#9bd06a', eyes: '#c2185b', outfit: '#2b2b2b', collar: '#9bd06a', extras: ['crest', 'cheeks'], mouth: 'smirk' },
    leader: { stat: 'hp', pct: 33 },
    skills: [
      hit('Absorción', 3.3, { hpScale: 0.06, lifesteal: 0.35, desc: 'Absorbe 35% del daño. Escala con su PV.' }),
      aoe('Kamehameha Perfecto', 3.2, { cd: 3, hpScale: 0.05, desc: 'Puede ralentizar. Escala con su PV.', fx: [deb('slow', 2, 50)] }),
      sup('Regeneración Celular', 'self', { cd: 4, desc: 'Se cura 45%, elimina efectos y sube su defensa.', fx: [heal(0.45), cleanse('self', 5), buf('defUp', 2)] }),
    ] },
  { id: 'krilin', name: 'Krilin', series: 'Dragon Ball Z', el: 'fuego', stars: 3, role: 'sup', spd: 105,
    look: { hair: '#1b1b1b', style: 'bald', skin: '#f6cfa6', eyes: '#1b1b1b', outfit: '#f47b20', collar: '#1d3fa6', extras: ['dots'], mouth: 'grin' },
    leader: null,
    skills: [
      hit('Kienzan', 3.4, { ignoreDef: 0.2, desc: 'Disco cortante que ignora 20% de la defensa.' }),
      aoe('Taiyōken', 0, { cd: 4, desc: 'Destello solar: puede aturdir y bajar el ataque de todos.', fx: [deb('stun', 1, 40), deb('atkDown', 2, 60)] }),
      sup('Semilla del Ermitaño', 'ally', { cd: 4, desc: 'Cura 35% a un aliado y elimina un efecto dañino.', fx: [heal(0.35, 'target'), cleanse('target')] }),
    ] },
  { id: 'trunks', name: 'Trunks del Futuro', series: 'Dragon Ball Z', el: 'fuego', stars: 4, role: 'atk', spd: 107,
    look: { hair: '#b7a3e0', style: 'bob', skin: '#f6cfa6', eyes: '#3a6fd8', outfit: '#1f3a6b', collar: '#f2c230', extras: ['sword'] },
    leader: { stat: 'spd', pct: 10 },
    skills: [
      hit('Corte del Futuro', 3.6, { desc: 'Puede bajar la defensa.', fx: [deb('defDown', 1, 30)] }),
      aoe('Burning Attack', 3.0, { cd: 3, desc: 'Puede causar daño continuo.', fx: [deb('dot', 1, 50)] }),
      hit('Espada Brave', 5.2, { cd: 4, bonusDebuff: 0.3, desc: '+30% de daño por cada efecto dañino del objetivo.' }),
    ] },
  { id: 'yamcha', name: 'Yamcha', series: 'Dragon Ball Z', el: 'agua', stars: 2, role: 'atk', spd: 102,
    look: { hair: '#1b1b1b', style: 'long', skin: '#f3c9a0', eyes: '#1b1b1b', outfit: '#f47b20', collar: '#1d3fa6', extras: ['scarX'] },
    leader: null,
    skills: [
      hit('Colmillo de Lobo', 1.3, { hits: 3, desc: 'Tres golpes feroces.' }),
      hit('Sōkidan', 4.2, { cd: 4, desc: 'Esfera de ki teledirigida. Puede ralentizar.', fx: [deb('slow', 1, 50)] }),
    ] },
  { id: 'tenshinhan', name: 'Ten Shin Han', series: 'Dragon Ball Z', el: 'viento', stars: 3, role: 'def', spd: 99,
    look: { hair: '#f6cfa6', style: 'bald', skin: '#f6cfa6', eyes: '#1b1b1b', outfit: '#2e8b57', collar: '#f2c230', extras: ['thirdEye'], brow: 'angry' },
    leader: null,
    skills: [
      hit('Dodonpa', 3.4, { desc: 'Puede ralentizar.', fx: [deb('slow', 1, 30)] }),
      aoe('Kikōhō', 3.1, { cd: 4, desc: 'Puede aturdir a todos.', fx: [deb('stun', 1, 25)] }),
      sup('Técnica de los Cuatro Brazos', 'self', { cd: 3, desc: 'Aumenta su crítico y su barra de ataque.', fx: [buf('critUp', 2), atb(0.5)] }),
    ] },

  /* ===== Bleach ===== */
  { id: 'ichigo', name: 'Ichigo Kurosaki', series: 'Bleach', el: 'fuego', stars: 5, role: 'atk', spd: 110,
    look: { hair: '#ff8a1f', style: 'spiky', skin: '#f6cfa6', eyes: '#6b3a12', outfit: '#1b1b1b', collar: '#f2f2f2', brow: 'angry', extras: ['sword'] },
    leader: { stat: 'atk', pct: 33, el: 'fuego' },
    skills: [
      hit('Corte de Zangetsu', 3.7, { desc: 'Puede bajar la defensa.', fx: [deb('defDown', 2, 25)] }),
      hit('Getsuga Tenshō', 5.3, { cd: 3, critBonus: 0.3, desc: 'Colmillo lunar. +30% prob. de crítico.' }),
      sup('Bankai: Tensa Zangetsu', 'self', { cd: 5, desc: 'Libera su Bankai: ATQ, VEL y crítico arriba; vuelve a actuar.', fx: [buf('atkUp', 3), buf('spdUp', 3), buf('critUp', 3), extra(100)] }),
    ] },
  { id: 'rukia', name: 'Rukia Kuchiki', series: 'Bleach', el: 'agua', stars: 4, role: 'sup', spd: 104,
    look: { hair: '#1b1b1b', style: 'bob', skin: '#f8dcc2', eyes: '#5b3fa0', outfit: '#1b1b1b', collar: '#f2f2f2' },
    leader: { stat: 'res', pct: 30 },
    skills: [
      hit('Tsukishiro', 3.3, { desc: 'Puede ralentizar.', fx: [deb('slow', 2, 50)] }),
      aoe('Hakuren', 3.0, { cd: 4, desc: 'Ola de hielo que puede congelar (aturdir).', fx: [deb('stun', 1, 30)] }),
      aoe('Some no Mai', 2.6, { cd: 4, desc: 'Reduce 30% la barra de ataque y puede bajar la defensa.', fx: [atb(-0.3, 'enemies'), deb('defDown', 2, 60)] }),
    ] },
  { id: 'byakuya', name: 'Byakuya Kuchiki', series: 'Bleach', el: 'luz', stars: 5, role: 'atk', spd: 105,
    look: { hair: '#1b1b1b', style: 'long', skin: '#f8dcc2', eyes: '#4a4a6a', outfit: '#f2f2f2', collar: '#1b1b1b', extras: ['kenseikan', 'scarf'] },
    leader: { stat: 'cr', pct: 20 },
    skills: [
      hit('Senbonzakura', 0.95, { hits: 4, desc: 'Mil cerezos cortantes: 4 golpes.' }),
      aoe('Kageyoshi', 3.6, { cd: 4, desc: 'Puede causar daño continuo.', fx: [deb('dot', 2, 60)] }),
      hit('Senkei: Shūkei Hakuteiken', 6.6, { cd: 5, ignoreDef: 0.3, desc: 'Ignora 30% de la defensa y sube su crítico.', fx: [buf('critUp', 2)] }),
    ] },
  { id: 'aizen', name: 'Sōsuke Aizen', series: 'Bleach', el: 'oscuridad', stars: 5, role: 'sup', spd: 108,
    look: { hair: '#6b4424', style: 'slick', skin: '#f6cfa6', eyes: '#6b3a12', outfit: '#f2f2f2', collar: '#1b1b1b', mouth: 'smirk' },
    leader: { stat: 'spd', pct: 15 },
    skills: [
      hit('Kyōka Suigetsu', 3.4, { desc: 'Reduce 20% la barra de ataque y puede ralentizar.', fx: [atb(-0.2, 'target'), deb('slow', 1, 50)] }),
      aoe('Hipnosis Perfecta', 2.8, { cd: 4, desc: 'Puede bajar el ataque de todos y reduce su barra 30%.', fx: [deb('atkDown', 2, 70), atb(-0.3, 'enemies')] }),
      hit('Hadō #90: Kurohitsugi', 6.2, { cd: 5, desc: 'Puede aturdir y quita 2 efectos beneficiosos.', fx: [strip(2), deb('stun', 1, 75)] }),
    ] },
  { id: 'kenpachi', name: 'Kenpachi Zaraki', series: 'Bleach', el: 'viento', stars: 4, role: 'hp', spd: 99,
    look: { hair: '#1b1b1b', style: 'kenpachi', skin: '#e9bf94', eyes: '#1b1b1b', outfit: '#f2f2f2', collar: '#1b1b1b', extras: ['eyepatch', 'scarV'], brow: 'angry', mouth: 'grin' },
    leader: { stat: 'atk', pct: 20 },
    skills: [
      hit('Tajo Brutal', 3.4, { missingHp: 1.0, desc: 'Más daño cuanto menos PV tenga.' }),
      sup('Sed de Batalla', 'self', { cd: 3, desc: 'Sube su ataque y se cura 20%.', fx: [buf('atkUp', 2), heal(0.2)] }),
      hit('Nozarashi', 5.6, { cd: 5, ignoreDef: 0.5, missingHp: 0.6, desc: 'Ignora 50% de la defensa. Más daño con poca vida.' }),
    ] },
  { id: 'toshiro', name: 'Tōshirō Hitsugaya', series: 'Bleach', el: 'agua', stars: 5, role: 'atk', spd: 106,
    look: { hair: '#eef6ff', style: 'spiky', skin: '#f8dcc2', eyes: '#2f9e6b', outfit: '#1b1b1b', collar: '#3aa7ff', brow: 'angry', extras: ['scarf'] },
    leader: { stat: 'atk', pct: 33, el: 'agua' },
    skills: [
      hit('Hyōrinmaru', 3.6, { desc: 'Puede ralentizar.', fx: [deb('slow', 2, 40)] }),
      hit('Ryūsenka', 5.0, { cd: 3, desc: 'Congela al objetivo: puede aturdir.', fx: [deb('stun', 1, 50)] }),
      aoe('Bankai: Daiguren Hyōrinmaru', 3.9, { cd: 5, desc: 'Ralentiza y puede bajar la defensa de todos.', fx: [deb('slow', 2, 80), deb('defDown', 2, 50)] }),
    ] },
  { id: 'orihime', name: 'Orihime Inoue', series: 'Bleach', el: 'luz', stars: 4, role: 'sup', spd: 100,
    look: { hair: '#ff7a3c', style: 'long', skin: '#fbe0c8', eyes: '#6b3a12', outfit: '#f2f2f2', collar: '#3a6fd8', extras: ['hairclip'], mouth: 'smile' },
    leader: { stat: 'hp', pct: 25 },
    skills: [
      hit('Koten Zanshun', 3.0, { desc: 'Tras atacar cura 10% al aliado más herido.', fx: [heal(0.1, 'lowest')] }),
      sup('Sōten Kisshun', 'allies', { cd: 3, desc: 'Cura 22% a todos y elimina un efecto dañino.', fx: [heal(0.22, 'allies'), cleanse('allies')] }),
      sup('Santen Kesshun', 'allies', { cd: 4, desc: 'Escudo (20% PV) y defensa arriba para todos.', fx: [shield(0.2, 2, 'allies'), buf('defUp', 2, 'allies')] }),
    ] },
  { id: 'renji', name: 'Renji Abarai', series: 'Bleach', el: 'fuego', stars: 3, role: 'atk', spd: 104,
    look: { hair: '#d4202a', style: 'tied', skin: '#f3c9a0', eyes: '#6b3a12', outfit: '#1b1b1b', collar: '#f2f2f2', extras: ['tattoo', 'bandana:#f2f2f2'], brow: 'angry' },
    leader: null,
    skills: [
      hit('Zabimaru', 1.9, { hits: 2, desc: 'Espada serpiente: 2 golpes.' }),
      aoe('Hikotsu Taihō', 3.2, { cd: 4, desc: 'Puede causar daño continuo.', fx: [deb('dot', 1, 40)] }),
    ] },
  { id: 'uryu', name: 'Uryū Ishida', series: 'Bleach', el: 'luz', stars: 4, role: 'atk', spd: 107,
    look: { hair: '#1b1b1b', style: 'bob', skin: '#f8dcc2', eyes: '#3a6fd8', outfit: '#f2f2f2', collar: '#3a6fd8', extras: ['glasses'] },
    leader: { stat: 'acc', pct: 20 },
    skills: [
      hit('Flechas Quincy', 0.8, { hits: 5, desc: 'Lluvia de 5 flechas espirituales.' }),
      aoe('Licht Regen', 3.0, { cd: 3, desc: 'Puede bajar la defensa de todos.', fx: [deb('defDown', 2, 40)] }),
      hit('Seele Schneider', 5.5, { cd: 4, ignoreDef: 0.4, desc: 'Ignora 40% de la defensa.' }),
    ] },
  { id: 'ulquiorra', name: 'Ulquiorra Cifer', series: 'Bleach', el: 'oscuridad', stars: 4, role: 'atk', spd: 103,
    look: { hair: '#1b1b1b', style: 'bob', skin: '#f4f4f4', eyes: '#2fbf5f', outfit: '#f2f2f2', collar: '#1b1b1b', extras: ['horn', 'tears'] },
    leader: { stat: 'def', pct: 20 },
    skills: [
      hit('Cero', 3.6, { desc: 'Puede bajar el ataque.', fx: [deb('atkDown', 1, 30)] }),
      sup('Segunda Etapa', 'self', { cd: 4, desc: 'Sube su ataque, gana inmunidad y vuelve a actuar.', fx: [buf('atkUp', 3), buf('immunity', 2), extra(100)] }),
      hit('Lanza del Relámpago', 6.0, { cd: 5, desc: 'Elimina un efecto beneficioso.', fx: [strip(1)] }),
    ] },

  /* ===== Akira ===== */
  { id: 'kaneda', name: 'Shōtarō Kaneda', series: 'Akira', el: 'fuego', stars: 4, role: 'atk', spd: 112,
    look: { hair: '#2a1a12', style: 'short', skin: '#f3c9a0', eyes: '#1b1b1b', outfit: '#c8102e', collar: '#c8102e', extras: ['pill'], mouth: 'grin' },
    leader: { stat: 'spd', pct: 12 },
    skills: [
      hit('Embestida en Moto', 3.4, { desc: 'Llena un 25% su barra de ataque.', fx: [atb(0.25)] }),
      hit('Cañón Láser', 5.2, { cd: 4, ignoreDef: 0.4, desc: 'Ignora 40% de la defensa.' }),
      sup('La Pandilla de las Cápsulas', 'allies', { cd: 4, desc: 'Velocidad arriba y +25% barra para todo el equipo.', fx: [buf('spdUp', 2, 'allies'), atb(0.25, 'allies')] }),
    ] },
  { id: 'tetsuo', name: 'Tetsuo Shima', series: 'Akira', el: 'oscuridad', stars: 5, role: 'hp', spd: 98,
    look: { hair: '#1b1b1b', style: 'short', skin: '#f3c9a0', eyes: '#1b1b1b', outfit: '#c8102e', collar: '#6b6b6b', extras: ['cape:#8a0f1e'], brow: 'angry' },
    leader: { stat: 'hp', pct: 33, el: 'oscuridad' },
    skills: [
      hit('Telequinesis', 3.2, { hpScale: 0.05, lifesteal: 0.3, desc: 'Absorbe 30% del daño. Escala con su PV.' }),
      aoe('Onda Psíquica', 2.9, { cd: 3, hpScale: 0.04, desc: 'Reduce 25% la barra de ataque enemiga.', fx: [atb(-0.25, 'enemies')] }),
      aoe('Poder Descontrolado', 3.6, { cd: 5, hpScale: 0.07, desc: 'Daño continuo a todos y gana inmunidad.', fx: [deb('dot', 2, 70), buf('immunity', 1)] }),
    ] },
  { id: 'kei', name: 'Kei', series: 'Akira', el: 'viento', stars: 3, role: 'sup', spd: 106,
    look: { hair: '#2a1a12', style: 'bob', skin: '#f3c9a0', eyes: '#1b1b1b', outfit: '#3d5a3a', collar: '#3d5a3a' },
    leader: null,
    skills: [
      hit('Disparo Certero', 3.3, { desc: 'Puede bajar la defensa.', fx: [deb('defDown', 1, 40)] }),
      sup('Médium Psíquica', 'ally', { cd: 4, desc: 'Cura 30% a un aliado y le da regeneración.', fx: [heal(0.3, 'target'), buf('regen', 2, 'target')] }),
    ] },

  /* ===== One Piece ===== */
  { id: 'luffy', name: 'Monkey D. Luffy', series: 'One Piece', el: 'luz', stars: 5, role: 'atk', spd: 107,
    look: { hair: '#1b1b1b', style: 'short', skin: '#f3c9a0', eyes: '#1b1b1b', outfit: '#d4202a', collar: '#d4202a', extras: ['strawhat', 'scarEye'], mouth: 'grin' },
    leader: { stat: 'atk', pct: 30 },
    skills: [
      hit('Gomu Gomu no Pistol', 3.7, { desc: 'Llena un 15% su barra de ataque.', fx: [atb(0.15)] }),
      hit('Gomu Gomu no Gatling', 1.1, { hits: 5, cd: 3, desc: '5 golpes. Puede bajar la defensa.', fx: [deb('defDown', 2, 40)] }),
      aoe('Gear 5: Bajrang Gun', 4.2, { cd: 5, desc: 'El poder de Nika golpea a todos y sube su ataque.', fx: [buf('atkUp', 2)] }),
    ] },
  { id: 'zoro', name: 'Roronoa Zoro', series: 'One Piece', el: 'viento', stars: 5, role: 'atk', spd: 104,
    look: { hair: '#58c46a', style: 'flat', skin: '#e9bf94', eyes: '#1b1b1b', outfit: '#2e7d4f', collar: '#f2f2f2', extras: ['scarZoro', 'earrings', 'sword'], brow: 'angry' },
    leader: { stat: 'cdmg', pct: 35 },
    skills: [
      hit('Oni Giri', 1.3, { hits: 3, desc: 'Estilo de tres espadas: 3 cortes.' }),
      aoe('Santōryū: Tatsumaki', 3.3, { cd: 3, desc: 'Torbellino cortante. Puede bajar la defensa.', fx: [deb('defDown', 1, 40)] }),
      hit('Kyūtōryū: Asura', 7.0, { cd: 5, critBonus: 0.5, desc: 'Nueve espadas. +50% prob. de crítico.' }),
    ] },
  { id: 'sanji', name: 'Vinsmoke Sanji', series: 'One Piece', el: 'fuego', stars: 4, role: 'atk', spd: 110,
    look: { hair: '#f5d547', style: 'bangs', skin: '#f6cfa6', eyes: '#3a6fd8', outfit: '#1b1b1b', collar: '#3a6fd8', extras: ['curlyBrow', 'goatee'] },
    leader: { stat: 'spd', pct: 12, el: 'fuego' },
    skills: [
      hit('Collier Shoot', 3.5, { desc: 'Puede causar daño continuo.', fx: [deb('dot', 1, 30)] }),
      aoe('Diable Jambe: Concassé', 3.0, { cd: 3, desc: 'Pierna en llamas. Puede causar daño continuo.', fx: [deb('dot', 2, 50)] }),
      hit('Ifrit Jambe', 6.0, { cd: 5, bonusDebuff: 0.2, desc: '+20% de daño por efecto dañino del objetivo.' }),
    ] },
  { id: 'nami', name: 'Nami', series: 'One Piece', el: 'agua', stars: 4, role: 'sup', spd: 106,
    look: { hair: '#ff7a1f', style: 'long', skin: '#f6cfa6', eyes: '#6b3a12', outfit: '#3a9ad8', collar: '#f2f2f2', mouth: 'smile' },
    leader: { stat: 'res', pct: 25 },
    skills: [
      hit('Clima-Tact', 3.2, { desc: 'Puede ralentizar.', fx: [deb('slow', 1, 40)] }),
      aoe('Thunderbolt Tempo', 2.8, { cd: 4, desc: 'Puede aturdir a todos.', fx: [deb('stun', 1, 30)] }),
      sup('Mirage Tempo', 'allies', { cd: 4, desc: 'Defensa arriba y +20% barra para todo el equipo.', fx: [buf('defUp', 2, 'allies'), atb(0.2, 'allies')] }),
    ] },
  { id: 'ace', name: 'Portgas D. Ace', series: 'One Piece', el: 'fuego', stars: 5, role: 'atk', spd: 106,
    look: { hair: '#1b1b1b', style: 'messy', skin: '#e9bf94', eyes: '#1b1b1b', outfit: '#e9bf94', collar: '#e9bf94', extras: ['cowboy', 'freckles'], mouth: 'smile' },
    leader: { stat: 'cr', pct: 18 },
    skills: [
      hit('Hiken', 3.7, { desc: 'Puño de fuego. Puede causar daño continuo.', fx: [deb('dot', 2, 50)] }),
      aoe('Hibashira', 3.1, { cd: 3, desc: 'Columna de fuego. Puede causar daño continuo.', fx: [deb('dot', 1, 60)] }),
      aoe('Dai Enkai: Entei', 4.3, { cd: 5, bonusDebuff: 0.1, desc: '+10% de daño por efecto dañino del objetivo.' }),
    ] },
  { id: 'law', name: 'Trafalgar Law', series: 'One Piece', el: 'agua', stars: 5, role: 'sup', spd: 107,
    look: { hair: '#1b1b1b', style: 'messy', skin: '#e9bf94', eyes: '#6b6b3a', outfit: '#f2c230', collar: '#1b1b1b', extras: ['furhat', 'goatee'] },
    leader: { stat: 'def', pct: 30 },
    skills: [
      hit('Scalpel', 3.3, { desc: 'Elimina un efecto beneficioso.', fx: [strip(1)] }),
      aoe('Room: Shambles', 0, { cd: 4, desc: 'Intercambia el ritmo: −25% barra a enemigos, +25% a aliados.', fx: [atb(-0.25, 'enemies'), atb(0.25, 'allies')] }),
      hit('Gamma Knife', 5.8, { cd: 5, ignoreDef: 0.6, desc: 'Destruye desde dentro: ignora 60% DEF y baja la defensa.', fx: [deb('defDown', 2, 100)] }),
    ] },
  { id: 'chopper', name: 'Tony Tony Chopper', series: 'One Piece', el: 'agua', stars: 3, role: 'sup', spd: 101,
    look: { hair: '#8a5a2b', style: 'bald', skin: '#9a6a3a', eyes: '#1b1b1b', outfit: '#e85a8a', collar: '#e85a8a', extras: ['chopperhat', 'bluenose'], mouth: 'smile' },
    leader: null,
    skills: [
      hit('Kung Fu Point', 3.0, { desc: 'Golpe de pezuña.' }),
      sup('Rumble Ball: Medicina', 'allies', { cd: 3, desc: 'Cura 20% a todo el equipo.', fx: [heal(0.2, 'allies')] }),
    ] },
  { id: 'shanks', name: 'Shanks el Pelirrojo', series: 'One Piece', el: 'luz', stars: 5, role: 'def', spd: 105,
    look: { hair: '#c0171f', style: 'messy', skin: '#e9bf94', eyes: '#1b1b1b', outfit: '#f2f2f2', collar: '#1b1b1b', extras: ['cape:#1b1b1b', 'scarShanks'], mouth: 'smile' },
    leader: { stat: 'def', pct: 33 },
    skills: [
      hit('Gryphon', 3.5, { desc: 'Puede bajar el ataque.', fx: [deb('atkDown', 2, 30)] }),
      aoe('Haoshoku Haki', 0, { cd: 4, desc: 'Voluntad del Rey: puede aturdir y reduce 20% la barra.', fx: [deb('stun', 1, 50), atb(-0.2, 'enemies')] }),
      hit('Divine Departure', 6.2, { cd: 5, ignoreDef: 0.3, desc: 'Ignora 30% DEF y sube la defensa del equipo.', fx: [buf('defUp', 2, 'allies')] }),
    ] },
  { id: 'blackbeard', name: 'Barbanegra', series: 'One Piece', el: 'oscuridad', stars: 5, role: 'hp', spd: 97,
    look: { hair: '#1b1b1b', style: 'messy', skin: '#d8a878', eyes: '#1b1b1b', outfit: '#1b1b1b', collar: '#f2f2f2', extras: ['bandana', 'beard'], mouth: 'grin' },
    leader: { stat: 'hp', pct: 25 },
    skills: [
      hit('Kurouzu', 3.3, { hpScale: 0.05, desc: 'Atrae con oscuridad y elimina un efecto beneficioso.', fx: [strip(1)] }),
      aoe('Terremoto Gura Gura', 3.0, { cd: 4, hpScale: 0.05, desc: 'Puede bajar la defensa de todos.', fx: [deb('defDown', 2, 60)] }),
      aoe('Oscuridad Absoluta', 0, { cd: 5, desc: 'Anula poderes: quita 2 beneficios y puede sellar habilidades.', fx: [strip(2, 'enemies'), deb('silence', 2, 70)] }),
    ] },
  { id: 'usopp', name: 'Usopp', series: 'One Piece', el: 'viento', stars: 2, role: 'atk', spd: 108,
    look: { hair: '#1b1b1b', style: 'messy', skin: '#c89060', eyes: '#1b1b1b', outfit: '#8a6a3a', collar: '#8a6a3a', extras: ['longnose', 'goggles'], mouth: 'grin' },
    leader: null,
    skills: [
      hit('Kabuto: Hissatsu', 3.3, { desc: 'Puede ralentizar.', fx: [deb('slow', 1, 20)] }),
      hit('Pop Green', 4.0, { cd: 4, desc: 'Semilla explosiva. Puede causar daño continuo.', fx: [deb('dot', 2, 50)] }),
    ] },

  /* ===== Naruto ===== */
  { id: 'naruto', name: 'Naruto Uzumaki', series: 'Naruto', el: 'viento', stars: 5, role: 'hp', spd: 104,
    look: { hair: '#ffd23a', style: 'spiky', skin: '#f6cfa6', eyes: '#2f7fe0', outfit: '#f47b20', collar: '#1b1b1b', extras: ['headband', 'whiskers'], mouth: 'grin' },
    leader: { stat: 'hp', pct: 33, el: 'viento' },
    skills: [
      hit('Rasengan', 3.5, { hpScale: 0.03, desc: 'Esfera de chakra giratoria. Escala con su PV.' }),
      aoe('Kage Bunshin no Jutsu', 1.0, { hits: 3, cd: 3, desc: 'Sus clones golpean 3 veces a todos.' }),
      aoe('Rasenshuriken', 4.2, { cd: 5, desc: 'Baja la defensa y se cura 20%.', fx: [deb('defDown', 2, 70), heal(0.2)] }),
    ] },
  { id: 'sasuke', name: 'Sasuke Uchiha', series: 'Naruto', el: 'fuego', stars: 5, role: 'atk', spd: 109,
    look: { hair: '#1c2440', style: 'sasuke', skin: '#f8dcc2', eyes: '#c0152f', outfit: '#f2f2f2', collar: '#5b2a86', brow: 'angry' },
    leader: { stat: 'cdmg', pct: 33, el: 'fuego' },
    skills: [
      hit('Chidori', 3.6, { desc: 'Mil pájaros. Puede aturdir.', fx: [deb('stun', 1, 15)] }),
      aoe('Amaterasu', 3.2, { cd: 4, desc: 'Llamas negras: daño continuo de 3 turnos.', fx: [deb('dot', 3, 80)] }),
      hit('Kirin', 6.8, { cd: 5, critBonus: 0.3, desc: 'El rayo del cielo. +30% prob. de crítico.' }),
    ] },
  { id: 'kakashi', name: 'Kakashi Hatake', series: 'Naruto', el: 'agua', stars: 4, role: 'sup', spd: 105,
    look: { hair: '#dfe3ea', style: 'kakashi', skin: '#f6cfa6', eyes: '#1b1b1b', outfit: '#2f5d3a', collar: '#1c2440', extras: ['mask', 'headbandTilt'] },
    leader: { stat: 'acc', pct: 25 },
    skills: [
      hit('Raikiri', 3.5, { desc: 'Corte relámpago.' }),
      hit('Sharingan: Copia', 3.0, { cd: 3, desc: 'Quita un beneficio y puede sellar habilidades.', fx: [strip(1), deb('silence', 2, 60)] }),
      aoe('Kamui', 3.4, { cd: 5, desc: 'Reduce 30% la barra de ataque de todos.', fx: [atb(-0.3, 'enemies')] }),
    ] },
  { id: 'itachi', name: 'Itachi Uchiha', series: 'Naruto', el: 'oscuridad', stars: 5, role: 'sup', spd: 106,
    look: { hair: '#1b1b1b', style: 'long', skin: '#f3d6bd', eyes: '#c0152f', outfit: '#1b1b1b', collar: '#c0152f', extras: ['lines', 'headband'] },
    leader: { stat: 'res', pct: 33 },
    skills: [
      hit('Katon: Gōkakyū', 3.4, { desc: 'Bola de fuego. Puede causar daño continuo.', fx: [deb('dot', 1, 40)] }),
      hit('Tsukuyomi', 3.8, { cd: 4, desc: 'Genjutsu: puede aturdir.', fx: [deb('stun', 1, 80)] }),
      sup("Susano'o", 'allies', { cd: 5, desc: 'Escudo (25% PV) e inmunidad para todo el equipo.', fx: [shield(0.25, 2, 'allies'), buf('immunity', 2, 'allies')] }),
    ] },
];

const CHARS = Object.fromEntries(CHAR_LIST.map(c => [c.id, c]));

/* ---------- Invocación ---------- */
const SCROLLS = {
  unknown: { name: 'Pergamino Desconocido', icon: '📜', color: '#9c8a6a',
             rates: { 2: 70, 3: 27, 4: 3 }, pool: c => c.el !== 'luz' && c.el !== 'oscuridad' },
  mystic:  { name: 'Pergamino Místico', icon: '🔮', color: '#6b8cff',
             rates: { 3: 70, 4: 25, 5: 5 }, pool: c => true, ldRate: 5 },
  ld:      { name: 'Pergamino de Luz y Oscuridad', icon: '☯️', color: '#e0c060',
             rates: { 4: 80, 5: 20 }, pool: c => c.el === 'luz' || c.el === 'oscuridad' },
};

const SHOP = [
  { item: 'mystic',  qty: 1,  cost: { crystals: 100 } },
  { item: 'mystic',  qty: 11, cost: { crystals: 1000 } },
  { item: 'ld',      qty: 1,  cost: { crystals: 350 } },
  { item: 'unknown', qty: 1,  cost: { mana: 6000 } },
];

/* ---------- Campaña ---------- */
const REGIONS = [
  { id: 'kame', name: 'Isla Kame', emoji: '🏝️', bg: ['#4fb3e8', '#f7e3a1'], baseLv: 1,
    pool: ['yamcha', 'krilin', 'tenshinhan', 'usopp'], bosses: ['krilin', 'tenshinhan', 'yamcha', 'gohan', 'piccolo'] },
  { id: 'soul', name: 'Sociedad de Almas', emoji: '⛩️', bg: ['#6a5a8a', '#e8d9c0'], baseLv: 7,
    pool: ['renji', 'rukia', 'kei', 'chopper', 'uryu'], bosses: ['renji', 'rukia', 'uryu', 'kenpachi', 'byakuya'] },
  { id: 'tokyo', name: 'Neo-Tokio', emoji: '🏍️', bg: ['#1a1030', '#c8102e'], baseLv: 13,
    pool: ['kei', 'kaneda', 'trunks', 'tenshinhan', 'renji'], bosses: ['kaneda', 'trunks', 'kei', 'kaneda', 'tetsuo'] },
  { id: 'grandline', name: 'Grand Line', emoji: '🏴‍☠️', bg: ['#1f6fb0', '#9fd9f0'], baseLv: 19,
    pool: ['usopp', 'chopper', 'nami', 'sanji', 'kaneda'], bosses: ['sanji', 'nami', 'zoro', 'ace', 'blackbeard'] },
  { id: 'konoha', name: 'Aldea de la Hoja', emoji: '🍃', bg: ['#2f7a3a', '#f0d8a0'], baseLv: 25,
    pool: ['kakashi', 'sanji', 'rukia', 'gohan', 'piccolo'], bosses: ['kakashi', 'naruto', 'sasuke', 'kakashi', 'itachi'] },
  { id: 'hueco', name: 'Hueco Mundo', emoji: '💀', bg: ['#0e0e1a', '#6a6a8a'], baseLv: 31,
    pool: ['ulquiorra', 'kenpachi', 'trunks', 'uryu', 'kakashi'], bosses: ['ulquiorra', 'toshiro', 'frieza', 'cell', 'aizen'] },
];
const STAGES_PER_REGION = 5;

const STARTERS = ['gohan', 'trunks', 'kenpachi'];
