/* =========================================================
   Interfaz: pantallas, modales y flujo del juego
   ========================================================= */

const $ = sel => document.querySelector(sel);
const fmt = n => Math.round(n).toLocaleString('es-CL');
let currentScreen = 'home';
let currentBattle = null;
let collectionFilter = 'all';
let campaignRegion = 0;

/* ---------- Utilidades de UI ---------- */
function starsHtml(n, awakened) {
  return `<span class="stars${awakened ? ' aw' : ''}">${'★'.repeat(n)}</span>`;
}

function unitCard(u, opts = {}) {
  const ch = CHARS[u.id];
  const inTeam = G.team.includes(u.uid);
  const cls = ['ucard', 'el-' + ch.el, opts.selected ? 'selected' : '', opts.disabled ? 'disabled' : ''].join(' ');
  return `<div class="${cls}" data-uid="${u.uid}">
    <div class="u-pic">${portraitSVG(u.id)}
      <span class="u-elem">${ELEMENTS[ch.el].icon}</span>
      ${inTeam && !opts.noTeamMark ? '<span class="u-team">EQ</span>' : ''}
      ${u.locked ? '<span class="u-lock">🔒</span>' : ''}
      ${opts.badge ? `<span class="u-badge">${opts.badge}</span>` : ''}
    </div>
    ${starsHtml(ch.stars, u.awakened)}
    <div class="u-name">${ch.name}</div>
    <div class="u-lv">Nv. ${u.level}${u.sl ? ` · H+${u.sl}` : ''}</div>
  </div>`;
}

function specCard(spec) {
  const ch = CHARS[spec.id];
  return `<div class="ucard mini el-${ch.el}">
    <div class="u-pic">${portraitSVG(spec.id)}<span class="u-elem">${ELEMENTS[ch.el].icon}</span></div>
    ${starsHtml(ch.stars, spec.awakened)}<div class="u-lv">Nv. ${spec.level}</div></div>`;
}

function toast(msg) {
  const t = $('#toast');
  t.innerHTML = msg;
  t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
}

function openModal(html, cls = '') {
  const m = $('#modal');
  m.className = 'modal ' + cls;
  m.querySelector('.modal-box').innerHTML = html;
  m.classList.remove('hidden');
  return m.querySelector('.modal-box');
}
function closeModal() { $('#modal').classList.add('hidden'); }

function sortedUnits() {
  return G.units.slice().sort((a, b) => CHARS[b.id].stars - CHARS[a.id].stars || b.level - a.level || unitPower(b) - unitPower(a));
}

function updateTopbar() {
  $('#resMana').textContent = fmt(G.mana);
  $('#resCrystals').textContent = fmt(G.crystals);
  $('#resScrolls').textContent = G.scrolls.unknown + G.scrolls.mystic + G.scrolls.ld;
}

/* ---------- Navegación ---------- */
const SCREENS = {
  home: renderHome, campaign: renderCampaign, arena: renderArena,
  summon: renderSummon, collection: renderCollection, battle: () => {}, starter: renderStarter,
};

function show(name) {
  currentScreen = name;
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === name));
  document.querySelectorAll('#bottomnav button').forEach(b => b.classList.toggle('active', b.dataset.go === name));
  document.body.classList.toggle('in-battle', name === 'battle');
  document.body.classList.toggle('no-game', name === 'starter');
  SCREENS[name]();
  if (G) updateTopbar();
  window.scrollTo(0, 0);
}

/* ---------- Pantalla inicial: elegir compañero ---------- */
function renderStarter() {
  const el = $('#starter');
  el.innerHTML = `
    <div class="starter-wrap">
      <h1 class="logo">Anime<br><span>Sky Arena</span></h1>
      <p class="lead">Invoca héroes de Dragon Ball Z, Bleach, Akira, One Piece y Naruto, forma tu equipo y conquista las islas del cielo.</p>
      <h2>Elige a tu primer héroe</h2>
      <div class="starter-choices">
        ${STARTERS.map(id => {
          const c = CHARS[id];
          return `<div class="starter-card el-${c.el}" data-id="${id}">
            <div class="u-pic">${portraitSVG(id)}</div>
            ${starsHtml(c.stars)}
            <h3>${c.name}</h3>
            <div class="tag">${ELEMENTS[c.el].icon} ${ELEMENTS[c.el].name} · ${ROLES[c.role].name}</div>
            <small>${c.series}</small>
          </div>`;
        }).join('')}
      </div>
      <p class="hint">También recibirás a Krilin, Yamcha y Usopp, 3 pergaminos místicos y 5 desconocidos.</p>
    </div>`;
  el.querySelectorAll('.starter-card').forEach(c => c.onclick = () => {
    newGame(c.dataset.id);
    toast(`¡${CHARS[c.dataset.id].name} se une a tu equipo!`);
    show('home');
  });
}

/* ---------- Inicio ---------- */
function renderHome() {
  const el = $('#home');
  const team = G.team.map(getUnit).filter(Boolean);
  const cleared = Object.keys(G.progress).length;
  const total = REGIONS.length * STAGES_PER_REGION;
  const rank = arenaRank(G.arena.points);
  el.innerHTML = `
    <div class="home-hero">
      <h1 class="logo small">Anime <span>Sky Arena</span></h1>
      <div class="island">
        ${team.map((u, i) => `<div class="island-unit" style="--d:${i * 0.4}s">${portraitSVG(u.id)}</div>`).join('')}
      </div>
      <div class="power">Poder del equipo: <b>${fmt(teamPower(G.team))}</b></div>
    </div>
    ${dailyAvailable() ? `<button class="btn gold wide" id="dailyBtn">🎁 Reclamar recompensa diaria</button>` : ''}
    <div class="home-grid">
      <button class="home-tile t-camp" data-go="campaign"><span>🗺️</span><b>Campaña</b><small>${cleared}/${total} fases</small></button>
      <button class="home-tile t-arena" data-go="arena"><span>⚔️</span><b>Arena</b><small>${rank.icon} ${rank.name} · ${G.arena.points}</small></button>
      <button class="home-tile t-summon" data-go="summon"><span>🔮</span><b>Invocar</b><small>${G.scrolls.mystic} místicos</small></button>
      <button class="home-tile t-coll" data-go="collection"><span>📖</span><b>Héroes</b><small>${G.units.length} unidades</small></button>
    </div>
    <div class="panel tips">
      <h3>📘 Cómo jugar</h3>
      <ul>
        <li><b>Elementos:</b> 🔥 Fuego vence a 🌪️ Viento, 🌪️ Viento a 💧 Agua, 💧 Agua a 🔥 Fuego. ✨ Luz y 🌑 Oscuridad se vencen entre sí.</li>
        <li>Con ventaja haces más daño y más críticos; con desventaja puedes dar <b>golpes rozados</b> que no aplican efectos.</li>
        <li>La <b>barra azul</b> es la barra de ataque: quien tenga más velocidad actúa más seguido.</li>
        <li>El primer héroe del equipo es el <b>líder</b> y su habilidad de líder potencia al equipo.</li>
        <li>Un duplicado sirve para <b>Despertar</b> a un héroe (+15% stats) y luego para mejorar sus habilidades.</li>
      </ul>
    </div>
    <div class="footer-actions">
      <button class="btn small ghost" id="resetBtn">🗑️ Reiniciar partida</button>
    </div>`;
  el.querySelectorAll('[data-go]').forEach(b => b.onclick = () => show(b.dataset.go));
  const d = $('#dailyBtn');
  if (d) d.onclick = () => {
    const r = claimDaily();
    if (r) toast(`🎁 +${r.crystals} 💎 · +${r.mystic} 🔮 · +${fmt(r.mana)} 🪙`);
    renderHome(); updateTopbar();
  };
  $('#resetBtn').onclick = () => {
    if (confirm('¿Seguro? Se borrará todo tu progreso.')) { resetGame(); show('starter'); }
  };
}

/* ---------- Campaña ---------- */
function regionStars(r) {
  let s = 0;
  for (let i = 0; i < STAGES_PER_REGION; i++) s += G.progress[stageKey(r, i)] || 0;
  return s;
}

function renderCampaign() {
  const el = $('#campaign');
  const reg = REGIONS[campaignRegion];
  el.innerHTML = `
    <h2 class="screen-title">🗺️ Campaña</h2>
    <div class="region-tabs">
      ${REGIONS.map((r, i) => {
        const unlocked = stageUnlocked(i, 0);
        return `<button class="region-tab ${i === campaignRegion ? 'active' : ''}" data-r="${i}" ${unlocked ? '' : 'disabled'}>
          <span>${unlocked ? r.emoji : '🔒'}</span><b>${r.name}</b><small>⭐ ${regionStars(i)}/15</small></button>`;
      }).join('')}
    </div>
    <div class="region-view" style="--bg1:${reg.bg[0]};--bg2:${reg.bg[1]}">
      <h3>${reg.emoji} ${reg.name} <small>Nv. ${stageLevel(campaignRegion, 0)}–${stageLevel(campaignRegion, 4) + 2}</small></h3>
      <div class="stage-path">
        ${Array.from({ length: STAGES_PER_REGION }, (_, s) => {
          const unlocked = stageUnlocked(campaignRegion, s);
          const stars = G.progress[stageKey(campaignRegion, s)] || 0;
          const boss = CHARS[reg.bosses[s]];
          return `<button class="stage ${unlocked ? '' : 'locked'} ${s === STAGES_PER_REGION - 1 ? 'final' : ''}" data-s="${s}" ${unlocked ? '' : 'disabled'}>
            <div class="st-num">${s + 1}</div>
            <div class="st-boss">${portraitSVG(boss.id)}</div>
            <div class="st-info"><b>Fase ${s + 1}${s === STAGES_PER_REGION - 1 ? ' — JEFE' : ''}</b>
              <small>Jefe: ${boss.name} ${ELEMENTS[boss.el].icon} · Nv. ${stageLevel(campaignRegion, s)}</small>
              <span class="st-stars">${'★'.repeat(stars)}${'☆'.repeat(3 - stars)}</span></div>
          </button>`;
        }).join('')}
      </div>
    </div>`;
  el.querySelectorAll('.region-tab').forEach(b => b.onclick = () => { campaignRegion = +b.dataset.r; renderCampaign(); });
  el.querySelectorAll('.stage:not(.locked)').forEach(b => b.onclick = () => stagePreview(campaignRegion, +b.dataset.s));
}

function stagePreview(r, s) {
  const st = buildStage(r, s);
  const reg = REGIONS[r];
  const box = openModal(`
    <h2>${reg.emoji} ${reg.name} — Fase ${s + 1}</h2>
    ${st.waves.map((w, i) => `<div class="wave-prev"><b>Oleada ${i + 1}</b><div class="mini-row">${w.map(specCard).join('')}</div></div>`).join('')}
    <div class="rewards-prev">Recompensas: 🪙 ${fmt(st.reward.mana)} · ✨ ${st.reward.xp} XP por héroe${G.progress[stageKey(r, s)] ? '' : ` · 💎 ${st.reward.firstCrystals} (primera vez)`}</div>
    <div class="modal-actions">
      <button class="btn ghost" id="mCancel">Cancelar</button>
      <button class="btn gold" id="mGo">Preparar equipo ▶</button>
    </div>`);
  box.querySelector('#mCancel').onclick = closeModal;
  box.querySelector('#mGo').onclick = () => teamSelect(`Fase ${s + 1} · ${reg.name}`, () => startCampaignBattle(r, s));
}

/* ---------- Selección de equipo ---------- */
function teamSelect(title, onGo) {
  let team = G.team.filter(uid => getUnit(uid)).slice(0, 4);
  const draw = () => {
    const leader = team[0] ? getUnit(team[0]) : null;
    const box = openModal(`
      <h2>Preparar equipo</h2>
      <p class="sub">${title}</p>
      <div class="team-slots">
        ${[0, 1, 2, 3].map(i => {
          const u = team[i] ? getUnit(team[i]) : null;
          return `<div class="slot ${i === 0 ? 'leader' : ''}" data-i="${i}">
            ${u ? unitCard(u, { noTeamMark: true }) : '<div class="slot-empty">+</div>'}
            ${i === 0 ? '<span class="slot-label">👑 Líder</span>' : ''}
          </div>`;
        }).join('')}
      </div>
      <div class="leader-info">👑 ${leader ? leaderText(CHARS[leader.id].leader) : 'Elige un líder'}</div>
      <div class="power">Poder: <b>${fmt(teamPower(team))}</b></div>
      <div class="unit-grid pick">${sortedUnits().map(u => unitCard(u, { selected: team.includes(u.uid), noTeamMark: true })).join('')}</div>
      <div class="modal-actions sticky">
        <button class="btn ghost" id="mCancel">Cancelar</button>
        <button class="btn gold" id="mFight" ${team.length ? '' : 'disabled'}>⚔️ ¡Luchar!</button>
      </div>`, 'wide');
    box.querySelectorAll('.unit-grid .ucard').forEach(c => c.onclick = () => {
      const uid = +c.dataset.uid;
      if (team.includes(uid)) team = team.filter(t => t !== uid);
      else if (team.length < 4) team.push(uid);
      else { toast('Máximo 4 héroes por equipo'); return; }
      draw();
    });
    box.querySelectorAll('.slot').forEach(sl => sl.onclick = () => {
      const i = +sl.dataset.i;
      if (!team[i]) return;
      // Tocar un héroe del equipo lo convierte en líder (o lo quita si ya lo es)
      if (i === 0) team.splice(0, 1);
      else { const [u] = team.splice(i, 1); team.unshift(u); }
      draw();
    });
    box.querySelector('#mCancel').onclick = closeModal;
    box.querySelector('#mFight').onclick = () => {
      if (!team.length) return;
      G.team = team.slice();
      save();
      closeModal();
      onGo();
    };
  };
  draw();
}

function teamSpecs() {
  return G.team.map(getUnit).filter(Boolean).map(u => ({ id: u.id, level: u.level, awakened: u.awakened, sl: u.sl, uid: u.uid }));
}

/* ---------- Batallas ---------- */
function startCampaignBattle(r, s) {
  const st = buildStage(r, s);
  show('battle');
  currentBattle = new Battle({
    allies: teamSpecs(), waves: st.waves, title: `${REGIONS[r].name} ${s + 1}`, bg: REGIONS[r].bg,
    onFinish: res => campaignResult(r, s, st, res),
  });
  currentBattle.start();
}

function campaignResult(r, s, st, res) {
  G.stats.battles++;
  if (res.quit) { save(); show('campaign'); return; }
  if (!res.win) {
    save();
    const box = openModal(`
      <h2 class="defeat">DERROTA</h2>
      <p>Tu equipo ha caído. Consejos:</p>
      <ul class="tips-list">
        <li>Usa héroes con <b>ventaja elemental</b> contra el jefe.</li>
        <li><b>Potencia</b> a tus héroes en la sección Héroes.</li>
        <li>Invoca nuevos héroes con tus pergaminos.</li>
      </ul>
      <div class="modal-actions">
        <button class="btn ghost" id="mBack">Volver</button>
        <button class="btn gold" id="mRetry">Reintentar</button>
      </div>`);
    box.querySelector('#mBack').onclick = () => { closeModal(); show('campaign'); };
    box.querySelector('#mRetry').onclick = () => { closeModal(); startCampaignBattle(r, s); };
    return;
  }
  const key = stageKey(r, s);
  const first = !G.progress[key];
  const stars = res.deaths === 0 ? 3 : res.deaths === 1 ? 2 : 1;
  G.progress[key] = Math.max(G.progress[key] || 0, stars);
  const rw = { mana: st.reward.mana, crystals: first ? st.reward.firstCrystals : 0, drops: [] };
  G.mana += rw.mana;
  G.crystals += rw.crystals;
  if (rand() < 0.18) { G.scrolls.unknown++; rw.drops.push('📜 Pergamino Desconocido'); }
  if (rand() < 0.04) { G.scrolls.mystic++; rw.drops.push('🔮 Pergamino Místico'); }
  if (rand() < 0.10) {
    const pool = REGIONS[r].pool;
    const nu = addUnit(pool[Math.floor(rand() * pool.length)], 1);
    rw.drops.push(`🎴 ${CHARS[nu.id].name} ${'★'.repeat(CHARS[nu.id].stars)} se unió a ti`);
  }
  const xpLines = G.team.map(getUnit).filter(Boolean).map(u => {
    const before = u.level;
    const ups = giveXp(u, st.reward.xp);
    return { u, ups, before };
  });
  save(); updateTopbar();
  const hasNext = s < STAGES_PER_REGION - 1 || r < REGIONS.length - 1;
  const nr = s < STAGES_PER_REGION - 1 ? r : r + 1, ns = s < STAGES_PER_REGION - 1 ? s + 1 : 0;
  const box = openModal(`
    <h2 class="victory">¡VICTORIA!</h2>
    <div class="big-stars">${'★'.repeat(stars)}<span>${'★'.repeat(3 - stars)}</span></div>
    <div class="reward-list">
      <div>🪙 +${fmt(rw.mana)} maná</div>
      ${rw.crystals ? `<div>💎 +${rw.crystals} cristales</div>` : ''}
      ${rw.drops.map(d => `<div class="drop">${d}</div>`).join('')}
    </div>
    <div class="xp-list">${xpLines.map(x => `<div class="xp-row">${portraitSVG(x.u.id)}<span>${CHARS[x.u.id].name}</span>
      <b>${x.ups ? `Nv. ${x.before} → ${x.u.level} ⬆️` : x.u.level >= MAX_LEVEL ? 'MÁX' : `+${st.reward.xp} XP`}</b></div>`).join('')}</div>
    <div class="modal-actions">
      <button class="btn ghost" id="mBack">Mapa</button>
      <button class="btn" id="mRetry">Repetir</button>
      ${hasNext ? '<button class="btn gold" id="mNext">Siguiente ▶</button>' : ''}
    </div>`);
  box.querySelector('#mBack').onclick = () => { closeModal(); show('campaign'); };
  box.querySelector('#mRetry').onclick = () => { closeModal(); startCampaignBattle(r, s); };
  const nb = box.querySelector('#mNext');
  if (nb) nb.onclick = () => { closeModal(); campaignRegion = nr; startCampaignBattle(nr, ns); };
}

/* ---------- Arena ---------- */
function renderArena() {
  if (!G.arena.opponents) generateArenaOpponents();
  const el = $('#arena');
  const rank = arenaRank(G.arena.points);
  el.innerHTML = `
    <h2 class="screen-title">⚔️ Arena</h2>
    <div class="panel arena-head">
      <div class="rank-icon">${rank.icon}</div>
      <div><b>${rank.name}</b><br>${G.arena.points} puntos · ${G.arena.wins}V / ${G.arena.losses}D</div>
      <button class="btn small" id="refreshOpp">🔄 Nuevos rivales</button>
    </div>
    <div class="opp-list">
      ${G.arena.opponents.map((o, i) => `
        <div class="panel opp">
          <div class="opp-head"><b>${o.name}</b><span class="diff d${i}">${o.difficulty}</span><small>${o.points} pts</small></div>
          <div class="mini-row">${o.team.map(specCard).join('')}</div>
          <div class="opp-foot"><small>👑 ${leaderText(CHARS[o.team[0].id].leader)}</small>
            <button class="btn gold small" data-i="${i}">Luchar</button></div>
        </div>`).join('')}
    </div>
    <p class="hint">Ganar: +20 puntos, 💎 15 y 🪙 3.000. Perder: −10 puntos.</p>`;
  $('#refreshOpp').onclick = () => { generateArenaOpponents(); renderArena(); };
  el.querySelectorAll('.opp .btn').forEach(b => b.onclick = () => {
    const o = G.arena.opponents[+b.dataset.i];
    teamSelect(`Arena contra ${o.name}`, () => startArenaBattle(o));
  });
}

function startArenaBattle(o) {
  show('battle');
  currentBattle = new Battle({
    allies: teamSpecs(), waves: [o.team], enemyLeader: o.team[0].id, title: `Arena vs ${o.name}`, bg: ['#5a2a1a', '#1a0d08'],
    onFinish: res => arenaResult(o, res),
  });
  currentBattle.start();
}

function arenaResult(o, res) {
  G.stats.battles++;
  if (res.quit) { G.arena.points = Math.max(0, G.arena.points - 10); G.arena.losses++; save(); show('arena'); return; }
  let html;
  if (res.win) {
    G.arena.points += 20; G.arena.wins++; G.crystals += 15; G.mana += 3000;
    G.team.map(getUnit).filter(Boolean).forEach(u => giveXp(u, 150 + G.arena.wins * 5));
    html = `<h2 class="victory">¡VICTORIA!</h2><div class="reward-list"><div>🏆 +20 puntos</div><div>💎 +15</div><div>🪙 +3.000</div></div>`;
  } else {
    G.arena.points = Math.max(0, G.arena.points - 10); G.arena.losses++;
    html = `<h2 class="defeat">DERROTA</h2><div class="reward-list"><div>🏆 −10 puntos</div></div>`;
  }
  generateArenaOpponents();
  save(); updateTopbar();
  const box = openModal(html + `<div class="modal-actions"><button class="btn gold" id="mBack">Volver a la Arena</button></div>`);
  box.querySelector('#mBack').onclick = () => { closeModal(); show('arena'); };
}

/* ---------- Invocación ---------- */
function renderSummon() {
  const el = $('#summon');
  el.innerHTML = `
    <h2 class="screen-title">🔮 Círculo de Invocación</h2>
    <div class="summon-circle"><div class="ring"></div><div class="ring r2"></div><div class="core">✦</div></div>
    <div class="scroll-list">
      ${Object.entries(SCROLLS).map(([k, sc]) => `
        <div class="panel scroll" style="--c:${sc.color}">
          <div class="sc-icon">${sc.icon}</div>
          <div class="sc-info"><b>${sc.name}</b><small>${Object.entries(sc.rates).map(([st, p]) => `${st}★ ${p}%`).join(' · ')}${k === 'mystic' ? ' · Luz/Osc. raro' : ''}</small>
            <span class="sc-count">Tienes: <b>${G.scrolls[k]}</b></span></div>
          <div class="sc-btns">
            <button class="btn small gold" data-k="${k}" data-n="1" ${G.scrolls[k] >= 1 ? '' : 'disabled'}>Invocar</button>
            ${G.scrolls[k] >= 10 ? `<button class="btn small" data-k="${k}" data-n="10">x10</button>` : ''}
          </div>
        </div>`).join('')}
    </div>
    <h3 class="sub-title">🛒 Tienda</h3>
    <div class="shop">
      ${SHOP.map((it, i) => `<button class="panel shop-item" data-i="${i}" ${canAfford(it.cost) ? '' : 'disabled'}>
        <span>${SCROLLS[it.item].icon} ×${it.qty}</span><small>${SCROLLS[it.item].name}</small>
        <b>${it.cost.crystals ? '💎 ' + fmt(it.cost.crystals) : '🪙 ' + fmt(it.cost.mana)}</b></button>`).join('')}
    </div>`;
  el.querySelectorAll('.sc-btns .btn').forEach(b => b.onclick = () => doSummon(b.dataset.k, +b.dataset.n));
  el.querySelectorAll('.shop-item').forEach(b => b.onclick = () => {
    const it = SHOP[+b.dataset.i];
    if (!pay(it.cost)) return;
    G.scrolls[it.item] += it.qty;
    save(); toast(`Compraste ${it.qty} × ${SCROLLS[it.item].name}`);
    renderSummon(); updateTopbar();
  });
}

function doSummon(type, n) {
  if (G.scrolls[type] < n) return;
  G.scrolls[type] -= n;
  const known = new Set(G.units.map(u => u.id));
  const results = [];
  for (let i = 0; i < n; i++) results.push(summonOne(type));
  save(); updateTopbar();
  const best = Math.max(...results.map(u => CHARS[u.id].stars));
  const box = openModal(`
    <div class="summon-anim s${best}"><div class="orb"></div></div>
    <div class="summon-results hidden">
      <h2>${n > 1 ? 'Invocación múltiple' : '¡Invocación!'}</h2>
      <div class="unit-grid res">${results.map(u => unitCard(u, { badge: known.has(u.id) ? '' : 'NUEVO' })).join('')}</div>
      ${n === 1 ? summonDetail(results[0]) : ''}
      <div class="modal-actions">
        <button class="btn ghost" id="mClose">Cerrar</button>
        ${G.scrolls[type] >= n ? `<button class="btn gold" id="mAgain">Invocar de nuevo</button>` : ''}
      </div>
    </div>`, 'summon-modal');
  setTimeout(() => {
    box.querySelector('.summon-anim').classList.add('hidden');
    box.querySelector('.summon-results').classList.remove('hidden');
  }, best >= 5 ? 2000 : best >= 4 ? 1500 : 1000);
  box.querySelector('#mClose').onclick = () => { closeModal(); renderSummon(); };
  const again = box.querySelector('#mAgain');
  if (again) again.onclick = () => doSummon(type, n);
  box.querySelectorAll('.unit-grid .ucard').forEach(c => c.onclick = () => unitDetail(+c.dataset.uid));
}

function summonDetail(u) {
  const ch = CHARS[u.id];
  return `<div class="summon-detail el-${ch.el}"><b>${ch.name}</b> · ${ch.series}<br>
    ${ELEMENTS[ch.el].icon} ${ELEMENTS[ch.el].name} · ${ROLES[ch.role].name}</div>`;
}

/* ---------- Colección ---------- */
function renderCollection() {
  const el = $('#collection');
  const list = sortedUnits().filter(u => collectionFilter === 'all' || CHARS[u.id].el === collectionFilter);
  const owned = new Set(G.units.map(u => u.id));
  el.innerHTML = `
    <h2 class="screen-title">📖 Héroes <small>${G.units.length} · Colección ${owned.size}/${CHAR_LIST.length}</small></h2>
    <div class="filter-tabs">
      <button data-f="all" class="${collectionFilter === 'all' ? 'active' : ''}">Todos</button>
      ${Object.entries(ELEMENTS).map(([k, e]) => `<button data-f="${k}" class="${collectionFilter === k ? 'active' : ''}">${e.icon}</button>`).join('')}
    </div>
    <div class="unit-grid">${list.map(u => unitCard(u)).join('') || '<p class="hint">No tienes héroes de este elemento.</p>'}</div>
    <h3 class="sub-title">📚 Bestiario</h3>
    <div class="unit-grid dex">${CHAR_LIST.slice().sort((a, b) => b.stars - a.stars).map(c => `
      <div class="ucard mini el-${c.el} ${owned.has(c.id) ? '' : 'unknown'}" data-id="${c.id}">
        <div class="u-pic">${portraitSVG(c.id)}</div>${starsHtml(c.stars)}<div class="u-name">${owned.has(c.id) ? c.name : '???'}</div></div>`).join('')}
    </div>`;
  el.querySelectorAll('.filter-tabs button').forEach(b => b.onclick = () => { collectionFilter = b.dataset.f; renderCollection(); });
  el.querySelectorAll('.unit-grid:not(.dex) .ucard').forEach(c => c.onclick = () => unitDetail(+c.dataset.uid));
  el.querySelectorAll('.dex .ucard').forEach(c => c.onclick = () => dexDetail(c.dataset.id));
}

function skillListHtml(ch) {
  return ch.skills.map((s, i) => `
    <div class="skill-row">
      <div class="sk-head"><span class="sk-num">S${i + 1}</span><b>${s.name}</b>${s.cd ? `<span class="cd">⏳ ${s.cd}</span>` : ''}</div>
      <div class="sk-desc">${s.desc || ''}</div>
      <small>${skillMechanics(s)}</small>
    </div>`).join('');
}

function dexDetail(id) {
  const ch = CHARS[id];
  const owned = G.units.some(u => u.id === id);
  const box = openModal(`
    <div class="detail-head el-${ch.el}">
      <div class="big-pic ${owned ? '' : 'unknown'}">${portraitSVG(id)}</div>
      <div><h2>${owned ? ch.name : '???'}</h2>${starsHtml(ch.stars)}<div class="tag">${ELEMENTS[ch.el].icon} ${ELEMENTS[ch.el].name} · ${ROLES[ch.role].name}</div><small>${ch.series}</small></div>
    </div>
    ${owned ? `<div class="leader-info">👑 ${leaderText(ch.leader)}</div>${skillListHtml(ch)}` : '<p class="hint">Invoca a este héroe para ver sus habilidades.</p>'}
    <div class="modal-actions"><button class="btn" id="mClose">Cerrar</button></div>`);
  box.querySelector('#mClose').onclick = closeModal;
}

function unitDetail(uid) {
  const u = getUnit(uid);
  if (!u) return;
  const ch = CHARS[u.id];
  const st = unitStats(u);
  const dups = G.units.filter(x => x.id === u.id && x.uid !== u.uid && !G.team.includes(x.uid) && !x.locked);
  const canAwaken = !u.awakened && dups.length > 0;
  const canSkill = u.awakened && u.sl < 4 && dups.length > 0;
  const box = openModal(`
    <div class="detail-head el-${ch.el}">
      <div class="big-pic">${portraitSVG(u.id)}</div>
      <div>
        <h2>${unitName(u)}</h2>${starsHtml(ch.stars, u.awakened)}
        <div class="tag">${ELEMENTS[ch.el].icon} ${ELEMENTS[ch.el].name} · ${ROLES[ch.role].name}</div>
        <small>${ch.series}</small>
        <div class="lvl">Nivel <b>${u.level}</b>/${MAX_LEVEL} ${u.sl ? `· Habilidades +${u.sl}` : ''}</div>
        ${u.level < MAX_LEVEL ? `<div class="xpbar"><i style="width:${100 * u.xp / xpNeeded(u.level)}%"></i></div>` : '<div class="xpbar max"><i style="width:100%"></i></div>'}
      </div>
    </div>
    <div class="stats-grid">
      ${Object.entries(st).map(([k, v]) => `<div><span>${STAT_NAMES[k]}</span><b>${fmt(v)}${['cr', 'cdmg', 'res', 'acc'].includes(k) ? '%' : ''}</b></div>`).join('')}
    </div>
    <div class="leader-info">👑 ${leaderText(ch.leader)}</div>
    ${skillListHtml(ch)}
    <div class="modal-actions wrap">
      <button class="btn" id="mFeed" ${u.level >= MAX_LEVEL ? 'disabled' : ''}>⬆️ Potenciar</button>
      ${canAwaken ? `<button class="btn gold" id="mAwaken">✦ Despertar (🪙 ${fmt(AWAKEN_COST)})</button>` : ''}
      ${canSkill ? `<button class="btn gold" id="mSkill">📘 Mejorar habilidades</button>` : ''}
      <button class="btn ghost" id="mLock">${u.locked ? '🔓 Desbloquear' : '🔒 Bloquear'}</button>
      <button class="btn ghost danger" id="mSell">Vender (🪙 ${fmt(sellValue(u))})</button>
      <button class="btn ghost" id="mClose">Cerrar</button>
    </div>
    ${!u.awakened ? `<p class="hint">✦ Para despertar necesitas un duplicado de ${ch.name} (que no esté en el equipo ni bloqueado).</p>` : ''}`);
  box.querySelector('#mClose').onclick = () => { closeModal(); if (currentScreen === 'collection') renderCollection(); };
  box.querySelector('#mLock').onclick = () => { u.locked = !u.locked; save(); unitDetail(uid); };
  box.querySelector('#mFeed').onclick = () => feedScreen(uid);
  box.querySelector('#mSell').onclick = () => {
    if (u.locked) return toast('Desbloquéalo primero');
    if (G.team.includes(uid)) return toast('No puedes vender un héroe de tu equipo');
    if (G.units.length <= 1) return toast('No puedes quedarte sin héroes');
    if (!confirm(`¿Vender a ${ch.name} por ${fmt(sellValue(u))} maná?`)) return;
    G.mana += sellValue(u); removeUnit(uid); save(); updateTopbar(); closeModal(); renderCollection();
  };
  const aw = box.querySelector('#mAwaken');
  if (aw) aw.onclick = () => {
    if (!pay({ mana: AWAKEN_COST })) return toast('No tienes suficiente maná');
    removeUnit(dups[0].uid);
    u.awakened = true;
    save(); updateTopbar();
    toast(`✦ ¡${ch.name} ha despertado!`);
    unitDetail(uid);
  };
  const sk = box.querySelector('#mSkill');
  if (sk) sk.onclick = () => {
    removeUnit(dups[0].uid);
    u.sl++;
    save();
    toast(`📘 Habilidades de ${ch.name} mejoradas (+${u.sl * 5}% daño)`);
    unitDetail(uid);
  };
}

function feedScreen(uid) {
  const u = getUnit(uid);
  let chosen = [];
  const candidates = sortedUnits().reverse().filter(x => x.uid !== uid && !G.team.includes(x.uid) && !x.locked);
  const draw = () => {
    const xp = chosen.reduce((a, c) => a + feedXp(getUnit(c)), 0);
    const cost = feedCost(u, chosen.length);
    // simular niveles
    const sim = { ...u };
    giveXp(sim, xp);
    const box = openModal(`
      <h2>⬆️ Potenciar a ${CHARS[u.id].name}</h2>
      <p class="sub">Elige héroes para sacrificar como material. (No aparecen los del equipo ni los bloqueados.)</p>
      <div class="feed-sum">XP: <b>+${fmt(xp)}</b> · Nivel ${u.level} → <b>${sim.level}</b> · Coste: 🪙 <b>${fmt(cost)}</b></div>
      <div class="unit-grid pick">${candidates.map(x => unitCard(x, { selected: chosen.includes(x.uid) })).join('') || '<p class="hint">No tienes material disponible. ¡Consigue más en la campaña o con pergaminos desconocidos!</p>'}</div>
      <div class="modal-actions sticky">
        <button class="btn ghost" id="mBack">Volver</button>
        <button class="btn gold" id="mOk" ${chosen.length && G.mana >= cost ? '' : 'disabled'}>Potenciar</button>
      </div>`, 'wide');
    box.querySelectorAll('.unit-grid .ucard').forEach(c => c.onclick = () => {
      const id = +c.dataset.uid;
      chosen = chosen.includes(id) ? chosen.filter(x => x !== id) : [...chosen, id];
      draw();
    });
    box.querySelector('#mBack').onclick = () => unitDetail(uid);
    box.querySelector('#mOk').onclick = () => {
      const fodder = chosen.map(getUnit);
      if (fodder.some(f => CHARS[f.id].stars >= 4) && !confirm('Vas a sacrificar héroes de 4★ o más. ¿Continuar?')) return;
      if (!pay({ mana: cost })) return;
      chosen.forEach(removeUnit);
      const before = u.level;
      giveXp(u, xp);
      save(); updateTopbar();
      toast(`⬆️ ${CHARS[u.id].name}: Nv. ${before} → ${u.level}`);
      unitDetail(uid);
    };
  };
  draw();
}

/* ---------- Arranque ---------- */
function boot() {
  document.querySelectorAll('#bottomnav button').forEach(b => b.onclick = () => {
    if (currentScreen === 'battle') return;
    show(b.dataset.go);
  });
  $('#modal').addEventListener('click', e => { if (e.target.id === 'modal' && currentScreen !== 'battle' && !$('#modal').classList.contains('summon-modal')) closeModal(); });
  if (load()) show('home');
  else show('starter');
}

document.addEventListener('DOMContentLoaded', boot);
