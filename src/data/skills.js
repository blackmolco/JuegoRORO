// Skill structure:
// { id, name, desc, cooldown, target, effects[], multiplier, aoe }
// target: 'enemy' | 'ally' | 'self' | 'all_enemies' | 'all_allies'
// effects: [{ type, chance, value, duration }]

export const SKILLS = {
  // ─── Luffy Gear 5 ───────────────────────────────────────────
  luffy_g5_s1: {
    id: 'luffy_g5_s1', name: 'Gomu Gomu no Gigant', cooldown: 0,
    desc: 'Golpe de goma gigante. Tiene 30% de aturdir.',
    target: 'enemy', multiplier: 3.8,
    effects: [{ type: 'stun', chance: 30, duration: 1 }],
  },
  luffy_g5_s2: {
    id: 'luffy_g5_s2', name: 'Fuego Fuego no Mi Pistol', cooldown: 3,
    desc: 'Disparo de fuego que quema a todos los enemigos.',
    target: 'all_enemies', multiplier: 2.4,
    effects: [{ type: 'burn', chance: 75, duration: 2 }],
  },
  luffy_g5_s3: {
    id: 'luffy_g5_s3', name: 'Bajrang Gun', cooldown: 5,
    desc: 'Puño planetario. Daño masivo e ignora escudos.',
    target: 'enemy', multiplier: 8.5,
    effects: [{ type: 'def_down', chance: 100, duration: 2 }],
    ignoreShield: true,
  },

  // ─── Whitebeard ─────────────────────────────────────────────
  whitebeard_s1: {
    id: 'whitebeard_s1', name: 'Marejada Sísmica', cooldown: 0,
    desc: 'Terremoto que sacude al enemigo.',
    target: 'enemy', multiplier: 3.5,
    effects: [{ type: 'def_down', chance: 50, duration: 2 }],
  },
  whitebeard_s2: {
    id: 'whitebeard_s2', name: 'Gura Gura Tsunami', cooldown: 3,
    desc: 'Ola sísmica que golpea a todos los enemigos y reduce ATK.',
    target: 'all_enemies', multiplier: 2.6,
    effects: [{ type: 'atk_down', chance: 60, duration: 2 }],
  },
  whitebeard_s3: {
    id: 'whitebeard_s3', name: 'Puño del Padre', cooldown: 5,
    desc: 'Otorga escudo a todos los aliados y cura HP propio masivamente.',
    target: 'all_allies', multiplier: 0,
    effects: [{ type: 'shield', chance: 100, duration: 2 }, { type: 'heal', chance: 100, value: 30, duration: 1 }],
    selfHeal: 0.3,
  },

  // ─── Roger ──────────────────────────────────────────────────
  roger_s1: {
    id: 'roger_s1', name: 'Corte del Rey', cooldown: 0,
    desc: 'Tajo con Haki del Rey. Alta tasa crítica.',
    target: 'enemy', multiplier: 4.0,
    effects: [], critBoost: 20,
  },
  roger_s2: {
    id: 'roger_s2', name: 'Haki Conqueror', cooldown: 3,
    desc: 'Onda de Haki que aturde a todos los enemigos.',
    target: 'all_enemies', multiplier: 2.0,
    effects: [{ type: 'stun', chance: 60, duration: 1 }],
  },
  roger_s3: {
    id: 'roger_s3', name: 'El Sueño del Rey Pirata', cooldown: 5,
    desc: 'Ataque definitivo. Daño colosal + buff ATK y crítico a aliados.',
    target: 'enemy', multiplier: 9.0,
    effects: [],
    allyBuffs: [{ type: 'atk_up', duration: 2 }],
  },

  // ─── Shanks ─────────────────────────────────────────────────
  shanks_s1: {
    id: 'shanks_s1', name: 'Tajo Rojo', cooldown: 0,
    desc: 'Corte largo alcance que ignora DEF parcialmente.',
    target: 'enemy', multiplier: 3.7, defPen: 0.3,
    effects: [],
  },
  shanks_s2: {
    id: 'shanks_s2', name: 'Mundo Que Tiembla', cooldown: 3,
    desc: 'Haki que aturde a un enemigo y sube DEF de todos los aliados.',
    target: 'enemy', multiplier: 2.8,
    effects: [{ type: 'stun', chance: 80, duration: 1 }],
    allyBuffs: [{ type: 'def_up', duration: 2 }],
  },
  shanks_s3: {
    id: 'shanks_s3', name: 'El Brazo que Protege', cooldown: 5,
    desc: 'Hace invencibles a todos los aliados por 1 turno y cura a todos.',
    target: 'all_allies', multiplier: 0,
    effects: [{ type: 'invincible', chance: 100, duration: 1 }, { type: 'heal', chance: 100, value: 25, duration: 1 }],
  },

  // ─── Kaido ──────────────────────────────────────────────────
  kaido_s1: {
    id: 'kaido_s1', name: 'Raimei Hakke', cooldown: 0,
    desc: 'Mazazo brutal con Haki. Puede romper escudos.',
    target: 'enemy', multiplier: 3.6,
    effects: [{ type: 'def_down', chance: 40, duration: 2 }], ignoreShield: true,
  },
  kaido_s2: {
    id: 'kaido_s2', name: 'Bolo Breath', cooldown: 3,
    desc: 'Aliento de dragón que quema a todos los enemigos.',
    target: 'all_enemies', multiplier: 2.5,
    effects: [{ type: 'burn', chance: 80, duration: 3 }],
  },
  kaido_s3: {
    id: 'kaido_s3', name: 'Tatsumaki Kaifuho', cooldown: 5,
    desc: 'Tornado de dragón. Daño masivo + se cura a sí mismo.',
    target: 'all_enemies', multiplier: 3.8,
    effects: [{ type: 'slow', chance: 70, duration: 2 }],
    selfHeal: 0.2,
  },

  // ─── Zoro ───────────────────────────────────────────────────
  zoro_s1: {
    id: 'zoro_s1', name: 'Oni Giri', cooldown: 0,
    desc: 'Triple corte transversal. Daño sólido.',
    target: 'enemy', multiplier: 3.9, effects: [],
  },
  zoro_s2: {
    id: 'zoro_s2', name: '108 Calibres Phoenix', cooldown: 3,
    desc: 'Ataque giratorio que golpea a todos los enemigos.',
    target: 'all_enemies', multiplier: 2.3,
    effects: [{ type: 'def_down', chance: 50, duration: 2 }],
  },
  zoro_s3: {
    id: 'zoro_s3', name: 'Ashura Ichibugin', cooldown: 5,
    desc: 'Forma demoníaca. Daño devastador a un objetivo.',
    target: 'enemy', multiplier: 8.0,
    effects: [{ type: 'atk_down', chance: 70, duration: 2 }],
    selfBuff: [{ type: 'atk_up', duration: 2 }],
  },

  // ─── Sanji ──────────────────────────────────────────────────
  sanji_s1: {
    id: 'sanji_s1', name: 'Shoot', cooldown: 0,
    desc: 'Patada flamígera.',
    target: 'enemy', multiplier: 3.6,
    effects: [{ type: 'burn', chance: 40, duration: 2 }],
  },
  sanji_s2: {
    id: 'sanji_s2', name: 'Diable Jambe Flambage', cooldown: 3,
    desc: 'Torbellino de fuego que quema a todos los enemigos.',
    target: 'all_enemies', multiplier: 2.4,
    effects: [{ type: 'burn', chance: 70, duration: 2 }],
  },
  sanji_s3: {
    id: 'sanji_s3', name: 'Ifrit Jambe', cooldown: 5,
    desc: 'Patada infernal con Haki y fuego. Ignora DEF.',
    target: 'enemy', multiplier: 8.5,
    effects: [{ type: 'burn', chance: 100, duration: 3 }], defPen: 0.5,
  },

  // ─── Ace ────────────────────────────────────────────────────
  ace_s1: {
    id: 'ace_s1', name: 'Fire Fist', cooldown: 0,
    desc: 'Puñetazo de fuego clásico.',
    target: 'enemy', multiplier: 3.7,
    effects: [{ type: 'burn', chance: 50, duration: 2 }],
  },
  ace_s2: {
    id: 'ace_s2', name: 'Higan', cooldown: 3,
    desc: 'Lluvia de balas de fuego sobre todos los enemigos.',
    target: 'all_enemies', multiplier: 2.2,
    effects: [{ type: 'burn', chance: 60, duration: 2 }],
  },
  ace_s3: {
    id: 'ace_s3', name: 'Entei', cooldown: 5,
    desc: 'El fuego más poderoso de Ace. Puede oneshot a enemigos débiles.',
    target: 'enemy', multiplier: 9.5,
    effects: [{ type: 'burn', chance: 100, duration: 3 }],
  },

  // ─── Law ────────────────────────────────────────────────────
  law_s1: {
    id: 'law_s1', name: 'Takt', cooldown: 0,
    desc: 'Lanza objetos del entorno al enemigo.',
    target: 'enemy', multiplier: 3.2,
    effects: [{ type: 'def_down', chance: 30, duration: 2 }],
  },
  law_s2: {
    id: 'law_s2', name: 'ROOM: Shambles', cooldown: 3,
    desc: 'Intercambia posiciones y confunde a todos los enemigos. Reduce SPD.',
    target: 'all_enemies', multiplier: 1.8,
    effects: [{ type: 'slow', chance: 80, duration: 2 }],
  },
  law_s3: {
    id: 'law_s3', name: 'Gamma Knife', cooldown: 5,
    desc: 'Daña órganos internos ignorando DEF por completo. Envenena.',
    target: 'enemy', multiplier: 7.0,
    effects: [{ type: 'poison', chance: 100, duration: 3 }], defPen: 1.0,
  },

  // ─── Hancock ────────────────────────────────────────────────
  hancock_s1: {
    id: 'hancock_s1', name: 'Slave Arrow', cooldown: 0,
    desc: 'Flecha de amor que petrifica. 50% aturdir.',
    target: 'enemy', multiplier: 3.3,
    effects: [{ type: 'stun', chance: 50, duration: 1 }],
  },
  hancock_s2: {
    id: 'hancock_s2', name: 'Perfume Femme', cooldown: 3,
    desc: 'Petrifica a todos los enemigos con su belleza.',
    target: 'all_enemies', multiplier: 2.0,
    effects: [{ type: 'stun', chance: 55, duration: 1 }],
  },
  hancock_s3: {
    id: 'hancock_s3', name: 'Pistol Kiss Dos Fleurs', cooldown: 5,
    desc: 'Barraje de patadas que petrifica y reduce ATK masivamente.',
    target: 'enemy', multiplier: 7.5,
    effects: [{ type: 'stun', chance: 100, duration: 2 }, { type: 'atk_down', chance: 100, duration: 3 }],
  },

  // ─── Doflamingo ─────────────────────────────────────────────
  doflamingo_s1: {
    id: 'doflamingo_s1', name: 'Flap Thread', cooldown: 0,
    desc: 'Hilos que cortan y ralentizan.',
    target: 'enemy', multiplier: 3.4,
    effects: [{ type: 'slow', chance: 45, duration: 2 }],
  },
  doflamingo_s2: {
    id: 'doflamingo_s2', name: 'Parasite', cooldown: 3,
    desc: 'Controla a un enemigo para atacar a sus aliados.',
    target: 'enemy', multiplier: 0,
    effects: [{ type: 'stun', chance: 100, duration: 1 }],
    special: 'parasite',
  },
  doflamingo_s3: {
    id: 'doflamingo_s3', name: 'God Thread', cooldown: 5,
    desc: 'Mil hilos de destrucción. AOE masivo + lentitud.',
    target: 'all_enemies', multiplier: 3.5,
    effects: [{ type: 'slow', chance: 80, duration: 2 }, { type: 'atk_down', chance: 70, duration: 2 }],
  },

  // ─── Marco ──────────────────────────────────────────────────
  marco_s1: {
    id: 'marco_s1', name: 'Garra de Fénix', cooldown: 0,
    desc: 'Zarpazo flamígero azul.',
    target: 'enemy', multiplier: 3.0,
    effects: [{ type: 'burn', chance: 30, duration: 2 }],
  },
  marco_s2: {
    id: 'marco_s2', name: 'Llama Curativa', cooldown: 3,
    desc: 'Cura a todos los aliados con fuego de fénix.',
    target: 'all_allies', multiplier: 0,
    effects: [{ type: 'heal', chance: 100, value: 30, duration: 1 }],
  },
  marco_s3: {
    id: 'marco_s3', name: 'Resurrección del Fénix', cooldown: 5,
    desc: 'Cura masiva a todo el equipo y le da escudo.',
    target: 'all_allies', multiplier: 0,
    effects: [{ type: 'heal', chance: 100, value: 50, duration: 1 }, { type: 'shield', chance: 100, duration: 2 }],
  },

  // ─── Katakuri ───────────────────────────────────────────────
  katakuri_s1: {
    id: 'katakuri_s1', name: 'Mochi Tsuki', cooldown: 0,
    desc: 'Puñetazo de mochi endurecido con Haki.',
    target: 'enemy', multiplier: 4.0, effects: [],
  },
  katakuri_s2: {
    id: 'katakuri_s2', name: 'Zan Giri Mochi', cooldown: 3,
    desc: 'Corte masivo de mochi que ralentiza a todos.',
    target: 'all_enemies', multiplier: 2.6,
    effects: [{ type: 'slow', chance: 65, duration: 2 }],
  },
  katakuri_s3: {
    id: 'katakuri_s3', name: 'Koro', cooldown: 5,
    desc: 'Bola de mochi venenosa gigante. Envenena y hace daño enorme.',
    target: 'enemy', multiplier: 8.2,
    effects: [{ type: 'poison', chance: 100, duration: 3 }, { type: 'slow', chance: 80, duration: 2 }],
  },

  // ─── Nami ───────────────────────────────────────────────────
  nami_s1: {
    id: 'nami_s1', name: 'Clima-Tact Thunder', cooldown: 0,
    desc: 'Rayo que paraliza al enemigo.',
    target: 'enemy', multiplier: 2.8,
    effects: [{ type: 'stun', chance: 35, duration: 1 }],
  },
  nami_s2: {
    id: 'nami_s2', name: 'Thunderbolt Tempo', cooldown: 3,
    desc: 'Tormenta eléctrica que daña y ralentiza a todos los enemigos.',
    target: 'all_enemies', multiplier: 1.9,
    effects: [{ type: 'slow', chance: 60, duration: 2 }],
  },
  nami_s3: {
    id: 'nami_s3', name: 'Mirage Tempo Fatamorgana', cooldown: 5,
    desc: 'Ilusión que sube velocidad de aliados y confunde a enemigos.',
    target: 'all_allies', multiplier: 0,
    effects: [{ type: 'atk_up', chance: 100, duration: 2 }],
    enemyDebuffs: [{ type: 'atk_down', chance: 70, duration: 2 }],
  },

  // ─── Usopp ──────────────────────────────────────────────────
  usopp_s1: {
    id: 'usopp_s1', name: 'Kabuto Shot', cooldown: 0,
    desc: 'Disparo de francotirador preciso.',
    target: 'enemy', multiplier: 3.5, effects: [], critBoost: 15,
  },
  usopp_s2: {
    id: 'usopp_s2', name: 'Impact Wolf', cooldown: 3,
    desc: 'Bala explosiva que aturde al objetivo.',
    target: 'enemy', multiplier: 4.2,
    effects: [{ type: 'stun', chance: 65, duration: 1 }],
  },
  usopp_s3: {
    id: 'usopp_s3', name: '10 Ton Hammer', cooldown: 5,
    desc: 'Golpe imaginario de martillo que aplasta al enemigo. Reduce DEF masivamente.',
    target: 'enemy', multiplier: 7.0,
    effects: [{ type: 'def_down', chance: 100, duration: 3 }],
  },

  // ─── Chopper ────────────────────────────────────────────────
  chopper_s1: {
    id: 'chopper_s1', name: 'Heavy Gong', cooldown: 0,
    desc: 'Cabezazo de reno potente.',
    target: 'enemy', multiplier: 3.0, effects: [],
  },
  chopper_s2: {
    id: 'chopper_s2', name: 'Rumble Ball Cura', cooldown: 3,
    desc: 'Cura a un aliado herido generosamente.',
    target: 'ally', multiplier: 0,
    effects: [{ type: 'heal', chance: 100, value: 40, duration: 1 }],
  },
  chopper_s3: {
    id: 'chopper_s3', name: 'Monster Point', cooldown: 5,
    desc: 'Forma monstruosa. Cura a todos los aliados y ATK masivo.',
    target: 'all_allies', multiplier: 0,
    effects: [{ type: 'heal', chance: 100, value: 35, duration: 1 }, { type: 'atk_up', chance: 100, duration: 3 }],
  },

  // ─── Robin ──────────────────────────────────────────────────
  robin_s1: {
    id: 'robin_s1', name: 'Seis Fleurs Clutch', cooldown: 0,
    desc: 'Brotan manos que estrangulas al enemigo.',
    target: 'enemy', multiplier: 3.2,
    effects: [{ type: 'def_down', chance: 40, duration: 2 }],
  },
  robin_s2: {
    id: 'robin_s2', name: 'Cien Fleurs Dos Fleurs', cooldown: 3,
    desc: 'Cien manos que atrapan a todos los enemigos.',
    target: 'all_enemies', multiplier: 1.8,
    effects: [{ type: 'slow', chance: 70, duration: 2 }],
  },
  robin_s3: {
    id: 'robin_s3', name: 'Mil Fleurs: Gigantesco', cooldown: 5,
    desc: 'Flor gigante de manos. Aturde y aplasta a todos los enemigos.',
    target: 'all_enemies', multiplier: 3.0,
    effects: [{ type: 'stun', chance: 60, duration: 1 }, { type: 'atk_down', chance: 80, duration: 2 }],
  },

  // ─── Enel ───────────────────────────────────────────────────
  enel_s1: {
    id: 'enel_s1', name: 'Sango', cooldown: 0,
    desc: 'Rayo en tres direcciones.',
    target: 'enemy', multiplier: 3.8,
    effects: [{ type: 'stun', chance: 35, duration: 1 }],
  },
  enel_s2: {
    id: 'enel_s2', name: 'Kiten', cooldown: 3,
    desc: 'Descarga eléctrica masiva sobre todos.',
    target: 'all_enemies', multiplier: 2.5,
    effects: [{ type: 'stun', chance: 45, duration: 1 }],
  },
  enel_s3: {
    id: 'enel_s3', name: 'Raigo', cooldown: 5,
    desc: 'La nube de tormenta definitiva. El poder de un dios.',
    target: 'all_enemies', multiplier: 4.0,
    effects: [{ type: 'stun', chance: 70, duration: 1 }, { type: 'burn', chance: 60, duration: 2 }],
  },

  // ─── Jinbe ──────────────────────────────────────────────────
  jinbe_s1: {
    id: 'jinbe_s1', name: 'Vagabundo del Mar', cooldown: 0,
    desc: 'Golpe de Karate Hombre Pez que usa el agua del entorno.',
    target: 'enemy', multiplier: 3.4, effects: [],
  },
  jinbe_s2: {
    id: 'jinbe_s2', name: 'Escudo de Agua', cooldown: 3,
    desc: 'Da escudo a todos los aliados y se cura.',
    target: 'all_allies', multiplier: 0,
    effects: [{ type: 'shield', chance: 100, duration: 2 }, { type: 'def_up', chance: 100, duration: 2 }],
  },
  jinbe_s3: {
    id: 'jinbe_s3', name: 'Vagabundo Tsunami', cooldown: 5,
    desc: 'Ola gigante que arrastra a todos los enemigos.',
    target: 'all_enemies', multiplier: 3.2,
    effects: [{ type: 'slow', chance: 80, duration: 2 }, { type: 'def_down', chance: 60, duration: 2 }],
  },

  // ─── Franky ─────────────────────────────────────────────────
  franky_s1: {
    id: 'franky_s1', name: 'Franky Radical Beam', cooldown: 0,
    desc: 'Rayo láser del pecho cyborg.',
    target: 'enemy', multiplier: 3.6, effects: [],
  },
  franky_s2: {
    id: 'franky_s2', name: 'General Cannon', cooldown: 3,
    desc: 'Cañonazo de General Franky que aplasta.',
    target: 'enemy', multiplier: 5.5,
    effects: [{ type: 'def_down', chance: 70, duration: 2 }],
  },
  franky_s3: {
    id: 'franky_s3', name: 'SUPAAAAH Barraje', cooldown: 5,
    desc: 'Bombardeo total sobre todos los enemigos.',
    target: 'all_enemies', multiplier: 3.3,
    effects: [{ type: 'burn', chance: 60, duration: 2 }, { type: 'slow', chance: 50, duration: 2 }],
  },

  // ─── Brook ──────────────────────────────────────────────────
  brook_s1: {
    id: 'brook_s1', name: 'Gavotte Bond En Avant', cooldown: 0,
    desc: 'Estocada de espadachín del alma.',
    target: 'enemy', multiplier: 3.7, effects: [],
  },
  brook_s2: {
    id: 'brook_s2', name: 'Aubade Coup Vent', cooldown: 3,
    desc: 'Corte de frío del alma que congela al enemigo.',
    target: 'enemy', multiplier: 4.5,
    effects: [{ type: 'slow', chance: 80, duration: 2 }, { type: 'atk_down', chance: 60, duration: 2 }],
  },
  brook_s3: {
    id: 'brook_s3', name: 'Soul King: Canto del Alma', cooldown: 5,
    desc: 'Música del alma que aturde a todos los enemigos.',
    target: 'all_enemies', multiplier: 2.5,
    effects: [{ type: 'stun', chance: 65, duration: 1 }, { type: 'atk_down', chance: 80, duration: 2 }],
  },

  // ─── Habilidades genéricas (1-2 estrellas) ──────────────────
  grunt_s1: {
    id: 'grunt_s1', name: 'Ataque Básico', cooldown: 0,
    desc: 'Ataque simple sin efectos.',
    target: 'enemy', multiplier: 2.5, effects: [],
  },
  grunt_s2: {
    id: 'grunt_s2', name: 'Golpe Fuerte', cooldown: 3,
    desc: 'Golpe más poderoso.',
    target: 'enemy', multiplier: 4.0, effects: [],
  },
  grunt_s3: {
    id: 'grunt_s3', name: 'Desesperación', cooldown: 5,
    desc: 'Ataque desesperado con todo.',
    target: 'enemy', multiplier: 6.0, effects: [],
  },

  // ─── Crocodile ──────────────────────────────────────────────
  crocodile_s1: {
    id: 'crocodile_s1', name: 'Desert Sword', cooldown: 0,
    desc: 'Brazo de arena que seca al enemigo.',
    target: 'enemy', multiplier: 3.4,
    effects: [{ type: 'def_down', chance: 40, duration: 2 }],
  },
  crocodile_s2: {
    id: 'crocodile_s2', name: 'Ground Secco', cooldown: 3,
    desc: 'Seca el terreno deshidratando a todos los enemigos.',
    target: 'all_enemies', multiplier: 2.0,
    effects: [{ type: 'poison', chance: 50, duration: 2 }],
  },
  crocodile_s3: {
    id: 'crocodile_s3', name: 'Desert Spada', cooldown: 5,
    desc: 'Cuchilla de arena que atraviesa todo. Venena y debilita.',
    target: 'enemy', multiplier: 7.5,
    effects: [{ type: 'poison', chance: 100, duration: 3 }, { type: 'def_down', chance: 100, duration: 2 }],
  },

  // ─── Buggy ──────────────────────────────────────────────────
  buggy_s1: {
    id: 'buggy_s1', name: 'Chop Chop Cannon', cooldown: 0,
    desc: 'Sus partes de cuerpo vuelan hacia el enemigo.',
    target: 'enemy', multiplier: 3.0, effects: [],
  },
  buggy_s2: {
    id: 'buggy_s2', name: 'Muggy Ball', cooldown: 3,
    desc: 'Proyectil explosivo que daña a todos los enemigos.',
    target: 'all_enemies', multiplier: 2.2,
    effects: [{ type: 'burn', chance: 50, duration: 2 }],
  },
  buggy_s3: {
    id: 'buggy_s3', name: 'Bara Bara Festival', cooldown: 5,
    desc: 'Sus partes llueven sobre todos los enemigos caóticamente.',
    target: 'all_enemies', multiplier: 2.8,
    effects: [{ type: 'stun', chance: 40, duration: 1 }, { type: 'burn', chance: 40, duration: 2 }],
  },

  // ─── Smoker ─────────────────────────────────────────────────
  smoker_s1: {
    id: 'smoker_s1', name: 'Smoke Launcher', cooldown: 0,
    desc: 'Proyectil de humo sólido.',
    target: 'enemy', multiplier: 3.2,
    effects: [{ type: 'slow', chance: 40, duration: 2 }],
  },
  smoker_s2: {
    id: 'smoker_s2', name: 'White Out', cooldown: 3,
    desc: 'Humo espeso que cubre a todos los enemigos y ralentiza.',
    target: 'all_enemies', multiplier: 1.8,
    effects: [{ type: 'slow', chance: 75, duration: 2 }],
  },
  smoker_s3: {
    id: 'smoker_s3', name: 'Seastone Jutte', cooldown: 5,
    desc: 'Golpe con Jitte de piedra marina que elimina poderes y aturde.',
    target: 'enemy', multiplier: 5.5,
    effects: [{ type: 'stun', chance: 100, duration: 2 }, { type: 'def_down', chance: 100, duration: 2 }],
  },

  // ─── Coby ───────────────────────────────────────────────────
  coby_s1: {
    id: 'coby_s1', name: 'Haki Shot', cooldown: 0,
    desc: 'Puño con Haki de armamento.',
    target: 'enemy', multiplier: 2.8, effects: [],
  },
  coby_s2: {
    id: 'coby_s2', name: 'Soru Rush', cooldown: 3,
    desc: 'Ráfaga de golpes a alta velocidad.',
    target: 'enemy', multiplier: 4.0, effects: [],
  },
  coby_s3: {
    id: 'coby_s3', name: 'Haki Conqueror Nasciente', cooldown: 5,
    desc: 'Onda de Haki emergente que aturde a todos.',
    target: 'all_enemies', multiplier: 2.5,
    effects: [{ type: 'stun', chance: 55, duration: 1 }],
  },

  // ─── Tashigi ────────────────────────────────────────────────
  tashigi_s1: {
    id: 'tashigi_s1', name: 'Tajo de Sable', cooldown: 0,
    desc: 'Corte rápido con sable.',
    target: 'enemy', multiplier: 3.0, effects: [],
  },
  tashigi_s2: {
    id: 'tashigi_s2', name: 'Haki Blade', cooldown: 3,
    desc: 'Corte con Haki de armamento negro.',
    target: 'enemy', multiplier: 4.5,
    effects: [{ type: 'def_down', chance: 50, duration: 2 }],
  },
  tashigi_s3: {
    id: 'tashigi_s3', name: 'Justicia del Filo', cooldown: 5,
    desc: 'Avalancha de tajos que derriban al enemigo.',
    target: 'enemy', multiplier: 6.5,
    effects: [{ type: 'stun', chance: 60, duration: 1 }, { type: 'atk_down', chance: 60, duration: 2 }],
  },

  // ─── Alvida ─────────────────────────────────────────────────
  alvida_s1: {
    id: 'alvida_s1', name: 'Slippery Fist', cooldown: 0,
    desc: 'Puñetazo resbaladizo que evade contra-ataques.',
    target: 'enemy', multiplier: 3.1, effects: [],
  },
  alvida_s2: {
    id: 'alvida_s2', name: 'Iron Mace Swing', cooldown: 3,
    desc: 'Golpe de maza que aplasta la DEF del enemigo.',
    target: 'enemy', multiplier: 4.8,
    effects: [{ type: 'def_down', chance: 65, duration: 2 }],
  },
  alvida_s3: {
    id: 'alvida_s3', name: 'Beautiful Cannon', cooldown: 5,
    desc: 'Cañonazo explosivo con su belleza como disparador.',
    target: 'all_enemies', multiplier: 2.5,
    effects: [{ type: 'burn', chance: 55, duration: 2 }],
  },
};

export const getSkillById = (id) => SKILLS[id] || null;
