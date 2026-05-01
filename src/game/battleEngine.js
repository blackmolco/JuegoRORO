import { SKILLS } from '../data/skills';
import { CHARACTERS } from '../data/characters';
import { getElementMultiplier } from '../constants/elements';

// Build a battle-ready unit from a player's owned character
export const buildUnit = (ownedChar, isEnemy = false, enemyLevelOverride = null) => {
  const base = CHARACTERS[ownedChar.characterId || ownedChar.id];
  if (!base) return null;

  const level = enemyLevelOverride ?? ownedChar.level ?? 1;
  const levelScale = 1 + (level - 1) * 0.06;
  const runeBonus = ownedChar.runeBonus ?? 0;

  const stats = {
    hp: Math.floor(base.baseStats.hp * levelScale * (1 + runeBonus)),
    atk: Math.floor(base.baseStats.atk * levelScale * (1 + runeBonus * 0.5)),
    def: Math.floor(base.baseStats.def * levelScale * (1 + runeBonus * 0.3)),
    spd: Math.floor(base.baseStats.spd * (1 + runeBonus * 0.1)),
    crit: base.baseStats.crit,
    critDmg: base.baseStats.critDmg,
  };

  return {
    uid: `${base.id}_${Date.now()}_${Math.random()}`,
    characterId: base.id,
    name: base.name,
    element: base.element,
    role: base.role,
    emoji: base.emoji,
    stars: base.stars,
    level,
    isEnemy,
    maxHp: stats.hp,
    currentHp: stats.hp,
    atk: stats.atk,
    def: stats.def,
    spd: stats.spd,
    crit: stats.crit,
    critDmg: stats.critDmg,
    skills: base.skills,
    skillCooldowns: { 0: 0, 1: 0, 2: 0 },
    statusEffects: [],
    agiGauge: 0,
    isDead: false,
  };
};

// Advance ATB gauges and return the unit whose turn it is
export const getNextUnit = (units) => {
  const alive = units.filter((u) => !u.isDead);
  if (alive.length === 0) return null;

  let iterations = 0;
  while (iterations < 1000) {
    for (const unit of alive) {
      unit.agiGauge += unit.spd;
      if (unit.agiGauge >= 1000) {
        unit.agiGauge = 0;
        return unit;
      }
    }
    iterations++;
  }
  return alive[0];
};

const rollCrit = (crit) => Math.random() * 100 < crit;

const calcDamage = (attacker, defender, skill) => {
  const defPen = skill.defPen ?? 0;
  const effectiveDef = defender.def * (1 - defPen);
  const defReduction = effectiveDef / (effectiveDef + 1000);
  const elementMult = getElementMultiplier(attacker.element, defender.element);
  const isCrit = rollCrit(attacker.crit + (skill.critBoost ?? 0));
  const critMult = isCrit ? attacker.critDmg / 100 : 1.0;

  // ATK up/down buffs
  const atkMod = attacker.statusEffects.some((e) => e.type === 'atk_up') ? 1.5 : 1.0;
  const atkMod2 = attacker.statusEffects.some((e) => e.type === 'atk_down') ? 0.7 : 1.0;

  let dmg = attacker.atk * skill.multiplier * (1 - defReduction) * elementMult * critMult * atkMod * atkMod2;

  // Shield absorbs 30% of damage
  if (defender.statusEffects.some((e) => e.type === 'shield') && !skill.ignoreShield) {
    dmg *= 0.7;
  }
  // Invincible blocks all damage
  if (defender.statusEffects.some((e) => e.type === 'invincible')) {
    dmg = 0;
  }

  return { damage: Math.max(1, Math.floor(dmg)), isCrit, elementMult };
};

const applyEffects = (effects, target) => {
  const applied = [];
  for (const eff of effects) {
    if (Math.random() * 100 < eff.chance) {
      // Remove existing same-type effect first
      target.statusEffects = target.statusEffects.filter((e) => e.type !== eff.type);
      target.statusEffects.push({ type: eff.type, duration: eff.duration, value: eff.value ?? 0 });
      applied.push(eff.type);
    }
  }
  return applied;
};

const processDoTs = (unit) => {
  let totalDmg = 0;
  for (const eff of unit.statusEffects) {
    if (eff.type === 'burn') totalDmg += Math.floor(unit.maxHp * 0.05);
    if (eff.type === 'poison') totalDmg += Math.floor(unit.maxHp * 0.07);
  }
  unit.currentHp = Math.max(0, unit.currentHp - totalDmg);
  if (unit.currentHp === 0) unit.isDead = true;
  return totalDmg;
};

const tickEffects = (unit) => {
  unit.statusEffects = unit.statusEffects
    .map((e) => ({ ...e, duration: e.duration - 1 }))
    .filter((e) => e.duration > 0);
};

const dealDamage = (target, dmg) => {
  target.currentHp = Math.max(0, target.currentHp - dmg);
  if (target.currentHp === 0) target.isDead = true;
};

const healUnit = (target, percent) => {
  const amount = Math.floor(target.maxHp * (percent / 100));
  target.currentHp = Math.min(target.maxHp, target.currentHp + amount);
  return amount;
};

export const executeSkill = (attacker, skillIndex, allies, enemies) => {
  const skillId = attacker.skills[skillIndex];
  const skill = SKILLS[skillId];
  if (!skill) return { logs: ['Habilidad no encontrada'], events: [] };

  const events = [];
  const logs = [];

  // Start of turn: process DoTs, check stun
  const dotDmg = processDoTs(attacker);
  if (dotDmg > 0) {
    logs.push(`${attacker.name} recibe ${dotDmg} daño por estado.`);
    events.push({ type: 'dot', targetUid: attacker.uid, damage: dotDmg });
  }

  tickEffects(attacker);

  if (attacker.isDead) {
    logs.push(`${attacker.name} fue derrotado por estados.`);
    events.push({ type: 'death', targetUid: attacker.uid });
    return { logs, events };
  }

  // Stun check
  if (attacker.statusEffects.some((e) => e.type === 'stun')) {
    logs.push(`${attacker.name} está aturdido y pierde su turno.`);
    events.push({ type: 'stunned', targetUid: attacker.uid });
    return { logs, events };
  }

  // Reduce cooldown on other skills
  for (let i = 0; i < 3; i++) {
    if (i !== skillIndex && attacker.skillCooldowns[i] > 0) {
      attacker.skillCooldowns[i]--;
    }
  }
  attacker.skillCooldowns[skillIndex] = skill.cooldown;

  const aliveEnemies = enemies.filter((u) => !u.isDead);
  const aliveAllies = allies.filter((u) => !u.isDead);

  if (aliveEnemies.length === 0) return { logs, events };

  const targets = [];

  if (skill.target === 'all_enemies') {
    targets.push(...aliveEnemies);
  } else if (skill.target === 'enemy') {
    // Target lowest HP enemy
    const t = aliveEnemies.reduce((a, b) => (a.currentHp < b.currentHp ? a : b));
    targets.push(t);
  } else if (skill.target === 'all_allies') {
    targets.push(...aliveAllies);
  } else if (skill.target === 'ally') {
    // Target most wounded ally
    const t = aliveAllies.reduce((a, b) =>
      a.currentHp / a.maxHp < b.currentHp / b.maxHp ? a : b
    );
    targets.push(t);
  } else if (skill.target === 'self') {
    targets.push(attacker);
  }

  for (const target of targets) {
    if (target.isDead) continue;

    if (skill.multiplier > 0 && (skill.target === 'enemy' || skill.target === 'all_enemies')) {
      const { damage, isCrit, elementMult } = calcDamage(attacker, target, skill);
      dealDamage(target, damage);
      logs.push(
        `${attacker.name} usa ${skill.name} → ${target.name}: ${damage} dmg${isCrit ? ' ¡CRÍTICO!' : ''}${elementMult > 1 ? ' ¡VENTAJA!' : elementMult < 1 ? ' Resistido.' : ''}`
      );
      events.push({
        type: 'damage',
        attackerUid: attacker.uid,
        targetUid: target.uid,
        damage,
        isCrit,
        elementMult,
        skillName: skill.name,
      });
      if (target.isDead) {
        logs.push(`${target.name} fue derrotado.`);
        events.push({ type: 'death', targetUid: target.uid });
      }
    }

    // Apply skill effects to target
    if (skill.effects && skill.effects.length > 0) {
      const applied = applyEffects(skill.effects, target);
      if (applied.length > 0) {
        logs.push(`${target.name} recibe: ${applied.join(', ')}`);
        events.push({ type: 'effect', targetUid: target.uid, effects: applied });
      }
    }

    // Heal effects on allies
    if (skill.effects) {
      for (const eff of skill.effects) {
        if (eff.type === 'heal') {
          const amount = healUnit(target, eff.value ?? 25);
          logs.push(`${target.name} se cura ${amount} HP.`);
          events.push({ type: 'heal', targetUid: target.uid, amount });
        }
      }
    }
  }

  // Self heal
  if (skill.selfHeal) {
    const amount = healUnit(attacker, skill.selfHeal * 100);
    logs.push(`${attacker.name} se cura ${amount} HP.`);
    events.push({ type: 'heal', targetUid: attacker.uid, amount });
  }

  // Ally buffs from certain skills
  if (skill.allyBuffs) {
    for (const buff of skill.allyBuffs) {
      for (const ally of aliveAllies) {
        applyEffects([{ type: buff.type, chance: 100, duration: buff.duration }], ally);
      }
      events.push({ type: 'allyBuff', buffType: buff.type });
    }
  }

  // Enemy debuffs from support skills
  if (skill.enemyDebuffs) {
    for (const debuff of skill.enemyDebuffs) {
      for (const enemy of aliveEnemies) {
        applyEffects([{ type: debuff.type, chance: debuff.chance ?? 100, duration: debuff.duration }], enemy);
      }
    }
  }

  return { logs, events };
};

// Simple AI: use skill with highest priority available
export const aiChooseSkill = (unit) => {
  // Prefer skill 2, then 3, then 1 (basic)
  const priority = [2, 1, 0];
  for (const idx of priority) {
    if (unit.skillCooldowns[idx] === 0) return idx;
  }
  return 0;
};

export const checkBattleEnd = (playerTeam, enemyTeam) => {
  const playerAlive = playerTeam.some((u) => !u.isDead);
  const enemyAlive = enemyTeam.some((u) => !u.isDead);
  if (!playerAlive) return 'defeat';
  if (!enemyAlive) return 'victory';
  return null;
};

// Simulate an entire battle and return the result with logs
export const simulateBattle = (playerUnits, enemyUnits) => {
  const allUnits = [...playerUnits, ...enemyUnits];
  const logs = [];
  const roundEvents = [];
  let turn = 0;
  const maxTurns = 200;

  while (turn < maxTurns) {
    const current = getNextUnit(allUnits);
    if (!current || current.isDead) { turn++; continue; }

    const isPlayer = playerUnits.includes(current);
    const myTeam = isPlayer ? playerUnits : enemyUnits;
    const oppTeam = isPlayer ? enemyUnits : playerUnits;

    const skillIdx = isPlayer ? aiChooseSkill(current) : aiChooseSkill(current);
    const result = executeSkill(current, skillIdx, myTeam, oppTeam);

    logs.push(...result.logs);
    roundEvents.push({ turn, unitId: current.characterId, events: result.events });

    const outcome = checkBattleEnd(playerUnits, enemyUnits);
    if (outcome) {
      return { outcome, logs, roundEvents, turns: turn };
    }
    turn++;
  }

  return { outcome: 'defeat', logs, roundEvents, turns: maxTurns };
};
