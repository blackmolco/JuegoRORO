/* =========================================================
   Motor de combate por turnos estilo Summoners War
   - Barra de ataque (ATB) que se llena según la velocidad
   - Ventaja elemental, críticos, golpes rozados
   - Efectos beneficiosos / dañinos, turnos extra, líder
   ========================================================= */

const rand = () => Math.random();

function makeFighter(spec, side, idx) {
  const ch = CHARS[spec.id];
  const st = unitStats({ id: spec.id, level: spec.level, awakened: !!spec.awakened });
  const f = {
    fid: side + idx + '_' + Math.random().toString(36).slice(2, 7),
    id: spec.id, side, name: (spec.awakened ? ch.name + ' ✦' : ch.name), el: ch.el, level: spec.level,
    boss: !!spec.boss, sl: spec.sl || 0, awakened: !!spec.awakened,
    maxHp: st.hp, atk: st.atk, def: st.def, spd: st.spd, cr: st.cr, cdmg: st.cdmg, res: st.res, acc: st.acc,
    skills: ch.skills.map(s => ({ ...s, cur: 0 })),
    effects: [], shield: 0, atb: 0, extraTurn: false,
  };
  // Súbditos de campaña: más débiles que los héroes del jugador
  if (spec.mob) {
    f.maxHp = Math.round(f.maxHp * 0.55);
    f.atk = Math.round(f.atk * 0.72);
    f.def = Math.round(f.def * 0.85);
  }
  if (f.boss) {
    f.maxHp = Math.round(f.maxHp * (ch.role === 'hp' ? 2.1 : 2.6));
    f.def = Math.round(f.def * 1.1);
    f.res += 20;
    f.name = '👑 ' + f.name;
  }
  f.hp = f.maxHp;
  return f;
}

function applyLeader(fighters, leaderId) {
  const ld = leaderId && CHARS[leaderId].leader;
  if (!ld) return;
  fighters.forEach(f => {
    if (ld.el && f.el !== ld.el) return;
    if (['hp', 'atk', 'def', 'spd'].includes(ld.stat)) {
      f[ld.stat === 'hp' ? 'maxHp' : ld.stat] = Math.round(f[ld.stat === 'hp' ? 'maxHp' : ld.stat] * (1 + ld.pct / 100));
    } else {
      f[ld.stat] += ld.pct;
    }
    f.hp = f.maxHp;
  });
}

const has = (f, id) => f.effects.some(e => e.id === id);

function skillMechanics(s) {
  const parts = [];
  if (s.mult > 0) parts.push(`Daño: ${Math.round(s.mult * 100)}% ATQ${s.hits > 1 ? ` × ${s.hits} golpes` : ''}${s.target === 'enemies' ? ' a todos' : ''}`);
  if (s.hpScale) parts.push(`+${Math.round(s.hpScale * 100)}% de sus PV máx.`);
  if (s.ignoreDef) parts.push(`Ignora ${Math.round(s.ignoreDef * 100)}% DEF`);
  if (s.lifesteal) parts.push(`Roba ${Math.round(s.lifesteal * 100)}% vida`);
  parts.push(s.cd ? `Enfriamiento: ${s.cd} turnos` : 'Sin enfriamiento');
  return parts.join(' · ');
}

class Battle {
  /**
   * opts: { allies:[spec], waves:[[spec]], enemyLeader, title, bg, onFinish(result) }
   * spec = { id, level, awakened, sl, boss, uid }
   */
  constructor(opts) {
    this.opts = opts;
    this.allies = opts.allies.map((s, i) => Object.assign(makeFighter(s, 'A', i), { uid: s.uid }));
    applyLeader(this.allies, opts.allies[0] && opts.allies[0].id);
    this.waves = opts.waves;
    this.waveIdx = 0;
    this.enemies = [];
    this.over = false;
    this.pending = null;
    this.selected = 0;
    this.deaths = 0;
    this.turns = 0;
    this.root = document.getElementById('battle');
  }

  get speed() { return G.settings.speed || 1; }
  sleep(ms) { return new Promise(r => setTimeout(r, ms / this.speed)); }

  foesOf(f) { return (f.side === 'A' ? this.enemies : this.allies).filter(x => x.hp > 0); }
  friendsOf(f) { return (f.side === 'A' ? this.allies : this.enemies).filter(x => x.hp > 0); }
  living() { return [...this.allies, ...this.enemies].filter(x => x.hp > 0); }

  effSpd(f) {
    let m = 1;
    if (has(f, 'spdUp')) m += 0.3;
    if (has(f, 'slow')) m -= 0.3;
    return f.spd * m;
  }

  /* ---------------- Bucle principal ---------------- */
  async start() {
    this.buildDom();
    this.loadWave(0);
    await this.sleep(500);
    while (!this.over) {
      const st = this.state();
      if (st === 'lose') return this.finish(false);
      if (st === 'win') {
        if (this.waveIdx < this.waves.length - 1) {
          await this.sleep(500);
          this.loadWave(this.waveIdx + 1);
          await this.sleep(700);
          continue;
        }
        return this.finish(true);
      }
      const u = this.nextActor();
      await this.takeTurn(u);
    }
  }

  state() {
    if (!this.allies.some(f => f.hp > 0)) return 'lose';
    if (!this.enemies.some(f => f.hp > 0)) return 'win';
    return 'run';
  }

  loadWave(i) {
    this.waveIdx = i;
    this.enemies = this.waves[i].map((s, k) => makeFighter(s, 'B', k));
    if (this.opts.enemyLeader && i === 0) applyLeader(this.enemies, this.opts.enemyLeader);
    [...this.allies, ...this.enemies].forEach(f => { f.atb = rand() * 15; });
    this.renderRow('enemyRow', this.enemies);
    this.root.querySelector('#waveInfo').textContent = this.waves.length > 1 ? `Oleada ${i + 1}/${this.waves.length}` : this.opts.title;
    if (this.waves.length > 1) this.banner(`OLEADA ${i + 1}`, i === this.waves.length - 1 && this.enemies.some(e => e.boss) ? '¡Jefe!' : '');
    this.log(i === 0 ? '¡Comienza la batalla!' : `Oleada ${i + 1}`);
  }

  nextActor() {
    const all = this.living();
    for (let guard = 0; guard < 10000; guard++) {
      const ready = all.filter(f => f.atb >= 100);
      if (ready.length) {
        ready.sort((a, b) => b.atb - a.atb || b.spd - a.spd);
        return ready[0];
      }
      all.forEach(f => { f.atb += this.effSpd(f) * 0.07; });
    }
    return all[0];
  }

  async takeTurn(u) {
    this.turns++;
    this.active = u;
    u.extraTurn = false;
    this.updateAll();

    // Efectos de inicio de turno
    const dots = u.effects.filter(e => e.id === 'dot').length;
    if (dots) {
      const d = Math.round(u.maxHp * 0.05 * dots);
      u.hp = Math.max(0, u.hp - d);
      this.float(u, d, 'dot');
      this.updateFighter(u);
      await this.sleep(350);
      if (u.hp <= 0) { this.onDeath(u); this.active = null; return; }
    }
    if (has(u, 'regen')) {
      const h = Math.round(u.maxHp * 0.15);
      u.hp = Math.min(u.maxHp, u.hp + h);
      this.float(u, h, 'heal');
    }
    u.skills.forEach(s => { if (s.cur > 0) s.cur--; });

    if (has(u, 'stun')) {
      this.float(u, 'Aturdido', 'status');
      this.log(`${u.name} está aturdido y pierde su turno.`);
      u.atb = 0;
      await this.sleep(600);
      this.endTurn(u);
      return;
    }

    let action;
    if (u.side === 'A' && !G.settings.auto) action = await this.awaitPlayer(u);
    else { await this.sleep(350); action = this.aiChoose(u); }
    if (this.over) return;

    u.atb = 0;
    await this.execute(u, action.skill, action.target);
    this.endTurn(u);
  }

  endTurn(u) {
    u.effects.forEach(e => { if (e.fresh) e.fresh = false; else e.turns--; });
    u.effects = u.effects.filter(e => e.turns > 0);
    if (!has(u, 'shield')) u.shield = 0;
    if (u.extraTurn && u.hp > 0) {
      u.atb = 100.5;
      this.float(u, '¡Turno extra!', 'status');
    }
    this.active = null;
    this.updateAll();
  }

  /* ---------------- Entrada del jugador ---------------- */
  awaitPlayer(u) {
    return new Promise(resolve => {
      this.pending = { u, resolve };
      this.selected = 0;
      this.renderSkillBar();
    });
  }

  resolvePlayer(action) {
    if (!this.pending) return;
    const p = this.pending;
    this.pending = null;
    this.renderSkillBar();
    p.resolve(action);
  }

  selectSkill(i) {
    if (!this.pending) return;
    const u = this.pending.u;
    const s = u.skills[i];
    if (s.cur > 0 || (has(u, 'silence') && i > 0)) return;
    this.selected = i;
    this.renderSkillBar();
    // Habilidades sin objetivo concreto se lanzan al volver a pulsar
  }

  validTargets(u, s) {
    if (s.target === 'enemy' || s.target === 'enemies') return this.foesOf(u);
    if (s.target === 'self') return [u];
    return this.friendsOf(u);
  }

  clickFighter(f) {
    if (!this.pending) return;
    const u = this.pending.u;
    const s = u.skills[this.selected];
    if (!this.validTargets(u, s).includes(f)) return;
    this.resolvePlayer({ skill: s, target: f });
  }

  setAuto(on) {
    G.settings.auto = on;
    save();
    if (on && this.pending) this.resolvePlayer(this.aiChoose(this.pending.u));
    this.updateControls();
  }

  /* ---------------- IA ---------------- */
  aiChoose(u) {
    const foes = this.foesOf(u), friends = this.friendsOf(u);
    const silenced = has(u, 'silence');
    for (let i = u.skills.length - 1; i >= 0; i--) {
      const s = u.skills[i];
      if (s.cur > 0 || (silenced && i > 0)) continue;
      if (s.mult === 0) {
        const heals = s.fx.some(f => f.t === 'heal');
        if (heals) {
          const low = (s.target === 'self' ? [u] : friends).filter(f => f.hp / f.maxHp < 0.65);
          if (!low.length) continue;
        }
        // No gastar un escudo/inmunidad si ya existe
        if (s.fx.some(f => f.t === 'shield') && friends.every(f => has(f, 'shield'))) continue;
      }
      return { skill: s, target: this.aiTarget(u, s, foes, friends) };
    }
    return { skill: u.skills[0], target: this.aiTarget(u, u.skills[0], foes, friends) };
  }

  aiTarget(u, s, foes, friends) {
    if (s.target === 'self') return u;
    if (s.target === 'ally' || s.target === 'allies') {
      return friends.slice().sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
    }
    let best = null, bestScore = -Infinity;
    foes.forEach(f => {
      const score = elemRel(u.el, f.el) * 0.35 + (1 - f.hp / f.maxHp) * 0.6 + (f.boss ? -0.1 : 0) + rand() * 0.3;
      if (score > bestScore) { bestScore = score; best = f; }
    });
    return best;
  }

  /* ---------------- Ejecución de habilidades ---------------- */
  async execute(u, s, target) {
    const foes = this.foesOf(u), friends = this.friendsOf(u);
    let targets;
    switch (s.target) {
      case 'enemy': targets = [target && target.hp > 0 ? target : foes[0]]; break;
      case 'enemies': targets = foes; break;
      case 'ally': targets = [target && target.hp > 0 ? target : u]; break;
      case 'allies': targets = friends; break;
      default: targets = [u];
    }
    targets = targets.filter(Boolean);
    if (s.cd) s.cur = s.cd;

    const kind = FX_KIND[u.id] || 'ki';
    const idx = u.skills.indexOf(s);
    const ultimate = s.cd >= 5 || (u.skills.length >= 3 && idx === u.skills.length - 1);
    if (ultimate) await this.cutIn(u, s);
    this.showSkill(u, s);
    const melee = kind === 'slash' || kind === 'punch';
    this.lunge(u, s.target === 'enemy' ? targets[0] : null, melee && s.mult > 0);
    await this.sleep(melee ? 260 : 200);

    const glanced = new Set();
    if (s.mult > 0) {
      for (let h = 0; h < s.hits; h++) {
        const alive = targets.filter(t => t.hp > 0);
        if (!alive.length) break;
        await this.attackFx(u, alive, s, kind);
        for (const t of alive) {
          const r = this.damage(u, t, s, kind);
          if (r.glance) glanced.add(t);
        }
        this.updateAll();
        await this.sleep(s.hits > 1 ? 130 : 280);
      }
    } else {
      this.supportFx(u, targets, s);
      await this.sleep(420);
    }
    for (const fx of s.fx) this.applyFx(u, fx, targets, glanced);
    this.updateAll();
    await this.sleep(420);
    // muertes
    [...this.allies, ...this.enemies].forEach(f => { if (f.hp <= 0 && !f.deadHandled) this.onDeath(f); });
  }

  damage(u, t, s, kind = 'ki') {
    let atk = u.atk * (1 + (has(u, 'atkUp') ? 0.5 : 0) - (has(u, 'atkDown') ? 0.5 : 0));
    let base = atk * s.mult + (s.hpScale ? u.maxHp * s.hpScale : 0);
    let def = t.def * (1 + (has(t, 'defUp') ? 0.7 : 0) - (has(t, 'defDown') ? 0.7 : 0));
    def *= 1 - (s.ignoreDef || 0);
    let dmg = base * 1000 / (1000 + 1.5 * def);

    const rel = elemRel(u.el, t.el);
    let critChance = u.cr + (has(u, 'critUp') ? 30 : 0) + (rel > 0 ? 15 : 0) + (s.critBonus || 0) * 100;
    let crit = false, glance = false;
    if (rel < 0 && rand() < 0.3) { glance = true; dmg *= 0.7; }
    else if (rand() * 100 < critChance) { crit = true; dmg *= 1 + u.cdmg / 100; }
    if (rel > 0) dmg *= 1.15; else if (rel < 0) dmg *= 0.9;
    if (s.missingHp) dmg *= 1 + (1 - u.hp / u.maxHp) * s.missingHp;
    if (s.bonusDebuff) dmg *= 1 + t.effects.filter(e => !EFFECTS[e.id].good).length * s.bonusDebuff;
    dmg *= 1 + u.sl * 0.05;
    dmg *= 0.95 + rand() * 0.1;
    dmg = Math.max(1, Math.round(dmg));

    let absorbed = 0;
    if (t.shield > 0) {
      absorbed = Math.min(t.shield, dmg);
      t.shield -= absorbed;
      if (t.shield <= 0) t.effects = t.effects.filter(e => e.id !== 'shield');
    }
    const real = dmg - absorbed;
    t.hp = Math.max(0, t.hp - real);
    this.float(t, dmg, crit ? 'crit' : glance ? 'glance' : rel > 0 ? 'adv' : 'dmg');
    this.anim(t, 'hit');
    this.burst(t, kind, crit);
    if (crit) this.shake();
    if (s.lifesteal) {
      const h = Math.round(real * s.lifesteal);
      u.hp = Math.min(u.maxHp, u.hp + h);
      if (h > 0) this.float(u, h, 'heal');
    }
    return { dmg, crit, glance };
  }

  resolveTo(u, to, targets) {
    const friends = this.friendsOf(u);
    switch (to) {
      case 'target': return targets.filter(t => t.hp > 0);
      case 'enemies': return this.foesOf(u);
      case 'allies': return friends;
      case 'lowest': return friends.length ? [friends.slice().sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0]] : [];
      default: return u.hp > 0 ? [u] : [];
    }
  }

  tryHarm(u, t) {
    if (has(t, 'immunity')) { this.float(t, 'Inmune', 'status'); return false; }
    const resist = Math.max(15, t.res - u.acc);
    if (rand() * 100 < resist) { this.float(t, 'Resistido', 'status'); return false; }
    return true;
  }

  addEffect(t, id, turns, fresh) {
    if (id === 'dot') {
      if (t.effects.filter(e => e.id === 'dot').length >= 5) return;
      t.effects.push({ id, turns, fresh });
      return;
    }
    const ex = t.effects.find(e => e.id === id);
    if (ex) { ex.turns = Math.max(ex.turns, turns); ex.fresh = ex.fresh || fresh; }
    else t.effects.push({ id, turns, fresh });
  }

  applyFx(u, fx, targets, glanced) {
    const list = this.resolveTo(u, fx.to, targets);
    switch (fx.t) {
      case 'debuff':
        list.forEach(t => {
          if (t.side === u.side || glanced.has(t)) return;
          if (rand() * 100 >= fx.chance) return;
          if (!this.tryHarm(u, t)) return;
          this.addEffect(t, fx.id, fx.turns, false);
          this.float(t, EFFECTS[fx.id].icon + ' ' + EFFECTS[fx.id].name, 'debuff');
        });
        break;
      case 'buff':
        list.forEach(t => { this.addEffect(t, fx.id, fx.turns, t === u); });
        break;
      case 'heal':
        list.forEach(t => {
          const h = Math.round(t.maxHp * fx.pct);
          t.hp = Math.min(t.maxHp, t.hp + h);
          this.float(t, h, 'heal');
        });
        break;
      case 'atb':
        list.forEach(t => {
          if (fx.amt < 0 && t.side !== u.side && !this.tryHarm(u, t)) return;
          t.atb = Math.max(0, t.atb + fx.amt * 100);
        });
        break;
      case 'extra':
        if (rand() * 100 < fx.chance) u.extraTurn = true;
        break;
      case 'cleanse':
        list.forEach(t => {
          for (let n = 0; n < fx.n; n++) {
            const i = t.effects.findIndex(e => !EFFECTS[e.id].good);
            if (i >= 0) t.effects.splice(i, 1);
          }
        });
        break;
      case 'strip':
        list.forEach(t => {
          if (t.side === u.side) return;
          let removed = 0;
          for (let n = 0; n < fx.n; n++) {
            const i = t.effects.findIndex(e => EFFECTS[e.id].good);
            if (i >= 0) { if (t.effects[i].id === 'shield') t.shield = 0; t.effects.splice(i, 1); removed++; }
          }
          if (removed) this.float(t, 'Beneficio eliminado', 'status');
        });
        break;
      case 'shield':
        list.forEach(t => {
          t.shield = Math.max(t.shield, Math.round(t.maxHp * fx.pct));
          this.addEffect(t, 'shield', fx.turns, t === u);
        });
        break;
    }
  }

  onDeath(f) {
    f.deadHandled = true;
    f.effects = [];
    f.shield = 0;
    if (f.side === 'A') this.deaths++;
    this.burst(f, 'ko', true);
    this.log(`${f.name} ha caído.`);
    this.updateFighter(f);
  }

  finish(win) {
    this.over = true;
    this.pending = null;
    this.renderSkillBar();
    setTimeout(() => this.opts.onFinish({ win, deaths: this.deaths, turns: this.turns }), 600);
  }

  quit() {
    if (this.over) return;
    this.over = true;
    if (this.pending) { const p = this.pending; this.pending = null; p.resolve({ skill: p.u.skills[0], target: null }); }
    this.opts.onFinish({ win: false, quit: true, deaths: this.deaths, turns: this.turns });
  }

  /* ---------------- Render ---------------- */
  buildDom() {
    const r = this.root;
    r.style.setProperty('--bg1', (this.opts.bg || ['#203a5a', '#0d1726'])[0]);
    r.style.setProperty('--bg2', (this.opts.bg || ['#203a5a', '#0d1726'])[1]);
    r.innerHTML = `
      <div class="battle-top">
        <button class="btn small ghost" id="bQuit">✖ Salir</button>
        <div class="wave-info" id="waveInfo"></div>
        <div class="battle-ctrl">
          <button class="btn small" id="bSpeed"></button>
          <button class="btn small" id="bAuto"></button>
        </div>
      </div>
      <div class="field">
        <div class="row enemies" id="enemyRow"></div>
        <div class="skill-banner" id="skillBanner"></div>
        <div class="row allies" id="allyRow"></div>
      </div>
      <div class="skillbar" id="skillBar"></div>
      <div class="battle-log" id="battleLog"></div>
      <div class="fx-layer" id="fxLayer"></div>`;
    this.layer = r.querySelector('#fxLayer');
    r.querySelector('#bQuit').onclick = () => { if (confirm('¿Abandonar la batalla? No obtendrás recompensas.')) this.quit(); };
    r.querySelector('#bSpeed').onclick = () => {
      G.settings.speed = G.settings.speed >= 3 ? 1 : G.settings.speed + 1; save(); this.updateControls();
    };
    r.querySelector('#bAuto').onclick = () => this.setAuto(!G.settings.auto);
    this.renderRow('allyRow', this.allies);
    this.updateControls();
    this.renderSkillBar();
  }

  updateControls() {
    this.root.querySelector('#bSpeed').textContent = `⏩ x${G.settings.speed}`;
    this.root.style.setProperty('--spd', G.settings.speed);
    const a = this.root.querySelector('#bAuto');
    a.textContent = G.settings.auto ? '🤖 AUTO: ON' : '🤖 AUTO: OFF';
    a.classList.toggle('on', !!G.settings.auto);
  }

  renderRow(rowId, list) {
    const row = this.root.querySelector('#' + rowId);
    row.innerHTML = '';
    list.forEach(f => {
      const d = document.createElement('div');
      d.className = `fighter el-${f.el}${f.boss ? ' boss' : ''}${f.awakened ? ' awakened' : ''}`;
      d.style.setProperty('--idle', (Math.random() * 2).toFixed(2) + 's');
      d.innerHTML = `
        <div class="f-atb"><i></i></div>
        <div class="f-pic">${portraitSVG(f.id, f.awakened)}<span class="f-elem">${ELEMENTS[f.el].icon}</span><span class="f-lv">${f.level}</span></div>
        <div class="f-name">${f.name}</div>
        <div class="f-hp"><i class="hp"></i><i class="sh"></i></div>
        <div class="f-fx"></div>
        <div class="f-floats"></div>`;
      d.onclick = () => this.clickFighter(f);
      d.onmouseenter = () => this.hoverInfo(f);
      f.dom = d;
      row.appendChild(d);
      this.updateFighter(f);
    });
  }

  updateFighter(f) {
    const d = f.dom;
    if (!d) return;
    d.querySelector('.hp').style.width = (100 * f.hp / f.maxHp) + '%';
    d.querySelector('.sh').style.width = Math.min(100, 100 * f.shield / f.maxHp) + '%';
    d.querySelector('.f-atb i').style.width = Math.min(100, f.atb) + '%';
    const counts = {};
    f.effects.forEach(e => { counts[e.id] = (counts[e.id] || 0) + 1; });
    d.querySelector('.f-fx').innerHTML = Object.keys(counts).map(id => {
      const e = f.effects.find(x => x.id === id);
      return `<span class="fx ${EFFECTS[id].good ? 'good' : 'bad'}" title="${EFFECTS[id].name}: ${EFFECTS[id].desc}">${EFFECTS[id].icon}${counts[id] > 1 ? counts[id] : ''}<sub>${e.turns}</sub></span>`;
    }).join('');
    d.classList.toggle('dead', f.hp <= 0);
    d.classList.toggle('active', this.active === f);
    let targetable = false;
    if (this.pending && f.hp > 0) {
      const s = this.pending.u.skills[this.selected];
      targetable = this.validTargets(this.pending.u, s).includes(f);
    }
    d.classList.toggle('targetable', targetable);
  }

  updateAll() { [...this.allies, ...this.enemies].forEach(f => this.updateFighter(f)); }

  renderSkillBar() {
    const bar = this.root.querySelector('#skillBar');
    if (!bar) return;
    if (!this.pending) {
      bar.innerHTML = `<div class="skill-hint">${this.over ? '' : G.settings.auto ? 'Combate automático…' : 'Esperando turno…'}</div>`;
      this.updateAll();
      return;
    }
    const u = this.pending.u;
    const silenced = has(u, 'silence');
    const s = u.skills[this.selected];
    const tgtTxt = { enemy: 'Toca un enemigo', enemies: 'Toca cualquier enemigo (ataque en área)', ally: 'Toca un aliado', allies: 'Toca cualquier aliado', self: 'Tócate a ti mismo' }[s.target];
    bar.innerHTML = `
      <div class="skill-owner">${portraitSVG(u.id, u.awakened)}<b>${u.name}</b></div>
      <div class="skill-btns">${u.skills.map((sk, i) => {
        const locked = sk.cur > 0 || (silenced && i > 0);
        return `<button class="skill-btn ${i === this.selected ? 'sel' : ''} ${locked ? 'locked' : ''}" data-i="${i}">
          <span class="sk-num">S${i + 1}</span><span class="sk-name">${sk.name}</span>
          ${sk.cur > 0 ? `<span class="sk-cd">${sk.cur}</span>` : ''}${silenced && i > 0 ? '<span class="sk-cd">🔇</span>' : ''}</button>`;
      }).join('')}</div>
      <div class="skill-desc"><b>${s.name}</b> — ${s.desc || ''}<br><small>${skillMechanics(s)}</small><br><em>👉 ${tgtTxt}</em></div>`;
    bar.querySelectorAll('.skill-btn').forEach(b => { b.onclick = () => this.selectSkill(+b.dataset.i); });
    this.updateAll();
  }

  hoverInfo(f) {
    if (this.pending) return;
    const log = this.root.querySelector('#battleLog');
    const eff = f.effects.map(e => EFFECTS[e.id].name + ` (${e.turns})`).join(', ') || 'ninguno';
    log.innerHTML = `<b>${f.name}</b> ${ELEMENTS[f.el].icon} Nv.${f.level} — PV ${f.hp}/${f.maxHp} · ATQ ${f.atk} · DEF ${f.def} · VEL ${f.spd} · Efectos: ${eff}`;
  }

  log(msg) {
    const l = this.root.querySelector('#battleLog');
    if (l) l.textContent = msg;
  }

  showSkill(u, s) {
    const b = this.root.querySelector('#skillBanner');
    b.innerHTML = `<span class="el-${u.el}">${u.name}</span> usa <b>${s.name}</b>`;
    b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
    this.log(`${u.name} usa ${s.name}.`);
  }

  banner(text, sub) {
    const b = this.root.querySelector('#skillBanner');
    b.innerHTML = `<b class="big">${text}</b>${sub ? `<br><span class="sub">${sub}</span>` : ''}`;
    b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
  }

  /* ---------------- Efectos visuales ---------------- */
  center(f) {
    const el = f.dom && f.dom.querySelector('.f-pic');
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect(), R = this.root.getBoundingClientRect();
    return { x: r.left - R.left + r.width / 2, y: r.top - R.top + r.height / 2, w: r.width };
  }

  fx(cls, x, y, vars = {}, life = 1200) {
    const d = document.createElement('div');
    d.className = 'vfx ' + cls;
    d.style.left = x + 'px';
    d.style.top = y + 'px';
    Object.entries(vars).forEach(([k, v]) => d.style.setProperty(k, v));
    this.layer.appendChild(d);
    setTimeout(() => d.remove(), life / Math.min(this.speed, 2));
    return d;
  }

  lunge(u, target, melee) {
    if (!u.dom) return;
    let dx = 0, dy = u.side === 'A' ? -18 : 18;
    if (target && target !== u) {
      const a = this.center(u), b = this.center(target);
      const k = melee ? 0.55 : 0.12;
      dx = (b.x - a.x) * k; dy = (b.y - a.y) * k;
    }
    u.dom.style.setProperty('--lx', dx + 'px');
    u.dom.style.setProperty('--ly', dy + 'px');
    this.anim(u, 'lunge');
  }

  async attackFx(u, targets, s, kind) {
    const c = FX_COLOR[kind] || '#fff';
    const a = this.center(u);
    const fast = s.hits > 1;
    if (s.target === 'enemies') {
      const row = this.root.querySelector(u.side === 'A' ? '#enemyRow' : '#allyRow').getBoundingClientRect();
      const R = this.root.getBoundingClientRect();
      this.fx('fx-wave' + (u.side === 'A' ? '' : ' down'), row.left - R.left + row.width / 2, row.top - R.top + row.height / 2,
        { '--c': c, '--w': row.width + 40 + 'px', '--h': row.height + 20 + 'px' }, 900);
      targets.forEach(t => { const b = this.center(t); this.fx('fx-proj', a.x, a.y, { '--c': c, '--tx': b.x - a.x + 'px', '--ty': b.y - a.y + 'px' }, 500); });
      await this.sleep(fast ? 160 : 300);
      return;
    }
    const t = targets[0];
    const b = this.center(t);
    if (kind === 'slash' || kind === 'punch') {
      this.fx(kind === 'slash' ? 'fx-slash' : 'fx-impact', b.x, b.y, { '--c': c, '--r': (Math.random() * 90 - 45) + 'deg' }, 600);
      await this.sleep(fast ? 70 : 120);
    } else if (s.mult >= 5 && !fast) {
      const dx = b.x - a.x, dy = b.y - a.y;
      this.fx('fx-beam', a.x, a.y, { '--c': c, '--len': Math.hypot(dx, dy) + 'px', '--ang': Math.atan2(dy, dx) + 'rad' }, 800);
      await this.sleep(300);
    } else {
      this.fx('fx-proj' + (kind === 'arrow' ? ' arrow' : ''), a.x, a.y,
        { '--c': c, '--tx': b.x - a.x + 'px', '--ty': b.y - a.y + 'px', '--ang': Math.atan2(b.y - a.y, b.x - a.x) + 'rad' }, 500);
      await this.sleep(fast ? 110 : 230);
    }
  }

  burst(t, kind, big) {
    const b = this.center(t);
    const c = kind === 'ko' ? '#ffffff' : (FX_COLOR[kind] || '#fff');
    this.fx('fx-burst' + (big ? ' big' : ''), b.x, b.y, { '--c': c }, 700);
    if (big) for (let i = 0; i < 6; i++) {
      const ang = Math.random() * Math.PI * 2, d = 30 + Math.random() * 30;
      this.fx('fx-spark', b.x, b.y, { '--c': c, '--tx': Math.cos(ang) * d + 'px', '--ty': Math.sin(ang) * d + 'px' }, 700);
    }
  }

  supportFx(u, targets, s) {
    const harmful = s.target === 'enemies' || s.target === 'enemy';
    const heals = s.fx.some(f => f.t === 'heal' || f.t === 'shield');
    const list = harmful ? this.foesOf(u) : targets;
    if (harmful) {
      const row = this.root.querySelector(u.side === 'A' ? '#enemyRow' : '#allyRow').getBoundingClientRect();
      const R = this.root.getBoundingClientRect();
      this.fx('fx-flash', row.left - R.left + row.width / 2, row.top - R.top + row.height / 2,
        { '--c': ELEMENTS[u.el].color, '--w': row.width + 40 + 'px', '--h': row.height + 20 + 'px' }, 900);
    }
    list.forEach(t => {
      const b = this.center(t);
      const c = harmful ? '#b073ff' : heals ? '#4ade80' : '#ffd23a';
      for (let i = 0; i < 5; i++) {
        this.fx('fx-rise', b.x + (Math.random() * 50 - 25), b.y + 10 + Math.random() * 20, { '--c': c, '--d': (i * 90) + 'ms' }, 1200);
      }
      this.fx('fx-ring', b.x, b.y, { '--c': c }, 800);
    });
  }

  shake() {
    this.root.classList.remove('shake'); void this.root.offsetWidth; this.root.classList.add('shake');
  }

  async cutIn(u, s) {
    const d = document.createElement('div');
    d.className = `cutin el-${u.el} ${u.side === 'A' ? 'from-left' : 'from-right'}`;
    d.innerHTML = `<div class="ci-lines"></div><div class="ci-pic">${portraitSVG(u.id, u.awakened)}</div>
      <div class="ci-text"><small>${u.name}</small><b>${s.name}</b></div>`;
    this.root.appendChild(d);
    await this.sleep(1000);
    d.remove();
  }

  anim(f, cls) {
    if (!f.dom) return;
    const pic = f.dom;
    pic.classList.remove(cls); void pic.offsetWidth; pic.classList.add(cls);
    setTimeout(() => pic.classList.remove(cls), 450);
  }

  float(f, val, kind) {
    if (!f.dom) return;
    const box = f.dom.querySelector('.f-floats');
    const s = document.createElement('span');
    s.className = 'float ' + kind;
    const n = box.childElementCount;
    s.style.left = (30 + ((n * 23) % 40)) + '%';
    s.textContent = typeof val === 'number' ? (kind === 'heal' ? '+' + val : kind === 'crit' ? val + '!' : val) : val;
    box.appendChild(s);
    setTimeout(() => s.remove(), 1100 / Math.min(this.speed, 2));
  }
}
