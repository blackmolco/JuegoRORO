// ============================================================
//  Dragon Ball TCG — Game State & Logic
// ============================================================

const HAND_LIMIT   = 7;
const BENCH_LIMIT  = 3;
const INITIAL_HAND = 5;
const SPHERES_TOTAL = 6;
const DECK_SIZE     = 20;

// ──────────────────────────────────────────────────────────
//  Game State
// ──────────────────────────────────────────────────────────
let G = {};   // game state (reset each game)

function initGame() {
  G = {
    turn:         1,
    phase:        "player",   // "player" | "enemy" | "gameover"
    winner:       null,

    player: buildPlayerState("player"),
    enemy:  buildPlayerState("enemy"),

    log:          [],
    pendingEffect: null,   // powerBoost etc. that last a turn
    playerAttackedThisTurn: false,
    playerPlayedCardThisTurn: false,
  };

  // Deal initial hands
  for (let i = 0; i < INITIAL_HAND; i++) {
    drawCard(G.player);
    drawCard(G.enemy);
  }

  addLog("system", "¡Comienza la batalla!");
  addLog("system", `Turno ${G.turn} — Tu turno`);
}

function buildPlayerState(who) {
  return {
    who,
    deck:    buildDeck(DECK_SIZE),
    hand:    [],
    bench:   [],           // up to 3 fighters waiting
    active:  null,         // fighter card currently in play
    discard: [],
    ki:      1,
    maxKi:   1,
    spheres: SPHERES_TOTAL,
    powerBoostTemp: 0,     // temporary attack bonus
  };
}

// ──────────────────────────────────────────────────────────
//  Core Actions
// ──────────────────────────────────────────────────────────

/** Draw one card. Returns false if deck empty. */
function drawCard(player) {
  if (player.deck.length === 0) {
    addLog("system", `${label(player)} no tiene más cartas — pierde 1 Esfera`);
    loseSphere(player);
    return false;
  }
  if (player.hand.length >= HAND_LIMIT) return false;
  const card = player.deck.pop();
  player.hand.push(card);
  return card;
}

/** Play a card from hand (by index). Returns {ok, reason} */
function playCard(player, handIndex) {
  const card = player.hand[handIndex];
  if (!card) return { ok: false, reason: "Carta no encontrada" };
  if (player.ki < card.kiCost) return { ok: false, reason: `Necesitas ${card.kiCost} Ki` };

  player.ki -= card.kiCost;
  player.hand.splice(handIndex, 1);

  if (card.type === "fighter") {
    return playFighter(player, card);
  } else if (card.type === "support") {
    return playSupport(player, card);
  } else if (card.type === "transform") {
    return playTransform(player, card);
  }
  return { ok: false, reason: "Tipo de carta desconocido" };
}

function playFighter(player, card) {
  // Initialize runtime HP
  card.currentHp = card.hp;
  card.maxHp     = card.hp;

  if (!player.active) {
    player.active = card;
    addLog(player.who, `${label(player)} pone a ${card.name} como personaje activo`);
    return { ok: true };
  }
  if (player.bench.length < BENCH_LIMIT) {
    player.bench.push(card);
    addLog(player.who, `${label(player)} pone a ${card.name} en la banca`);
    return { ok: true };
  }
  // refund ki
  player.ki += card.kiCost;
  player.hand.push(card);
  return { ok: false, reason: "Banca llena (máx 3)" };
}

function playSupport(player, card) {
  const fx = card.effect;
  switch (fx.type) {
    case "heal":
      if (!player.active) return { ok: false, reason: "Sin personaje activo para curar" };
      player.active.currentHp = Math.min(player.active.maxHp, player.active.currentHp + fx.amount);
      addLog(player.who, `${card.name}: ${player.active.name} recupera ${fx.amount} HP`);
      break;
    case "draw":
      for (let i = 0; i < fx.amount; i++) drawCard(player);
      addLog(player.who, `${card.name}: roba ${fx.amount} carta(s)`);
      break;
    case "powerBoost":
      player.powerBoostTemp += fx.amount;
      addLog(player.who, `${card.name}: +${fx.amount} daño al próximo ataque`);
      break;
    case "recoverSphere":
      if (player.spheres < SPHERES_TOTAL) {
        player.spheres = Math.min(SPHERES_TOTAL, player.spheres + fx.amount);
        addLog(player.who, `${card.name}: recupera ${fx.amount} Esfera(s) del Dragón`);
      } else {
        addLog(player.who, `${card.name}: ya tienes todas las Esferas`);
      }
      break;
    case "kiBoost":
      player.ki += fx.amount;
      addLog(player.who, `${card.name}: +${fx.amount} Ki extra`);
      break;
    case "fusionBoost":
      if (!player.active) return { ok: false, reason: "Sin personaje activo" };
      player.active.currentHp  = Math.min(player.active.maxHp + fx.hpBonus, player.active.currentHp + fx.hpBonus);
      player.active.maxHp     += fx.hpBonus;
      player.powerBoostTemp   += fx.powerBonus;
      addLog(player.who, `${card.name}: ${player.active.name} gana +${fx.hpBonus} HP y +${fx.powerBonus} poder`);
      break;
  }
  player.discard.push(card);
  return { ok: true };
}

function playTransform(player, card) {
  if (!player.active) return { ok: false, reason: "Sin personaje activo para transformar" };
  const fx = card.effect;
  player.active.currentHp  = Math.min(player.active.maxHp + fx.hpBonus, player.active.currentHp + fx.hpBonus);
  player.active.maxHp     += fx.hpBonus;
  player.active.power     += fx.powerBonus;
  // Visual indicator: append transform name to card name
  player.active.name += ` [${card.name.replace("Transformación: ", "")}]`;
  player.active.color = card.color || player.active.color;
  addLog(player.who, `${player.active.name}: transformación activada (+${fx.hpBonus} HP, +${fx.powerBonus} poder)`);
  player.discard.push(card);
  return { ok: true };
}

// ──────────────────────────────────────────────────────────
//  Combat
// ──────────────────────────────────────────────────────────

/** Player attacks enemy with chosen attack index */
function playerAttack(attackIndex = 0) {
  if (G.phase !== "player") return { ok: false, reason: "No es tu turno" };
  if (G.playerAttackedThisTurn) return { ok: false, reason: "Ya atacaste este turno" };
  const attacker = G.player.active;
  const defender = G.enemy.active;
  if (!attacker) return { ok: false, reason: "Sin personaje activo" };
  if (!defender) return { ok: false, reason: "El enemigo no tiene personaje activo" };

  const atk = attacker.attacks[attackIndex];
  if (!atk) return { ok: false, reason: "Ataque inválido" };
  if (G.player.ki < atk.kiCost) return { ok: false, reason: `Necesitas ${atk.kiCost} Ki para este ataque` };

  G.player.ki -= atk.kiCost;
  let dmg = atk.damage + G.player.powerBoostTemp;
  G.player.powerBoostTemp = 0;

  // Weakness/resistance
  if (defender.weakness === attacker.id) {
    dmg = Math.floor(dmg * 1.5);
    addLog("system", "¡Debilidad! x1.5 daño");
  }
  if (defender.resistance === attacker.id) {
    dmg = Math.max(0, dmg - 20);
    addLog("system", "Resistencia: -20 daño");
  }

  defender.currentHp -= dmg;
  G.playerAttackedThisTurn = true;
  addLog("player", `${attacker.name} usa ${atk.name} — ${dmg} daño a ${defender.name} (HP: ${Math.max(0, defender.currentHp)}/${defender.maxHp})`);

  if (defender.currentHp <= 0) {
    handleKO(G.enemy, G.player);
  }

  return { ok: true };
}

function handleKO(losingPlayer, winningPlayer) {
  const ko = losingPlayer.active;
  addLog("system", `¡${ko.name} fue derrotado!`);
  losingPlayer.discard.push(ko);
  losingPlayer.active = null;
  loseSphere(losingPlayer);

  if (losingPlayer.spheres <= 0) {
    endGame(winningPlayer.who);
    return;
  }

  // Auto-promote from bench
  if (losingPlayer.bench.length > 0) {
    losingPlayer.active = losingPlayer.bench.shift();
    addLog(losingPlayer.who, `${label(losingPlayer)} envía a ${losingPlayer.active.name} al frente`);
  } else if (losingPlayer.hand.some(c => c.type === "fighter")) {
    // enemy auto-plays a fighter from hand
    if (losingPlayer.who === "enemy") {
      enemyAutoPlayFighter();
    } else {
      addLog("system", "¡Debes jugar un nuevo personaje!");
    }
  }
}

function loseSphere(player) {
  if (player.spheres > 0) {
    player.spheres--;
    addLog("system", `${label(player)} pierde 1 Esfera del Dragón (${player.spheres} restantes)`);
  }
  if (player.spheres <= 0 && G.phase !== "gameover") {
    const winner = player.who === "player" ? "enemy" : "player";
    endGame(winner);
  }
}

function endGame(winner) {
  G.phase  = "gameover";
  G.winner = winner;
  addLog("system", `*** FIN DEL JUEGO — Ganador: ${winner === "player" ? "¡TÚ!" : "CPU"} ***`);
}

// ──────────────────────────────────────────────────────────
//  Turn Management
// ──────────────────────────────────────────────────────────

function endPlayerTurn() {
  if (G.phase !== "player") return;
  G.playerAttackedThisTurn   = false;
  G.playerPlayedCardThisTurn = false;
  G.phase = "enemy";
  addLog("system", "Fin de tu turno. Turno del CPU…");
  setTimeout(() => enemyTurn(), 800);
}

function startPlayerTurn() {
  G.turn++;
  G.phase = "player";
  G.player.maxKi = Math.min(G.player.maxKi + 1, 10);
  G.player.ki    = G.player.maxKi;
  G.playerAttackedThisTurn = false;
  drawCard(G.player);
  addLog("system", `Turno ${G.turn} — Tu turno (Ki: ${G.player.ki})`);
}

// ──────────────────────────────────────────────────────────
//  Enemy AI
// ──────────────────────────────────────────────────────────

function enemyTurn() {
  if (G.phase === "gameover") return;

  G.enemy.maxKi = Math.min(G.enemy.maxKi + 1, 10);
  G.enemy.ki    = G.enemy.maxKi;
  drawCard(G.enemy);

  // 1. Play a fighter if bench/active is empty
  enemyAutoPlayFighter();

  // 2. Play support / transform cards opportunistically
  enemyPlaySupportCards();

  // 3. Attack
  if (G.enemy.active && G.player.active) {
    setTimeout(() => {
      if (G.phase === "gameover") return;
      enemyDoAttack();
      setTimeout(() => {
        if (G.phase !== "gameover") startPlayerTurn();
      }, 600);
    }, 600);
  } else {
    setTimeout(() => {
      if (G.phase !== "gameover") startPlayerTurn();
    }, 600);
  }
}

function enemyAutoPlayFighter() {
  if (G.enemy.active && G.enemy.bench.length >= BENCH_LIMIT) return;
  const fighters = G.enemy.hand
    .map((c, i) => ({ card: c, i }))
    .filter(({ card }) => card.type === "fighter" && G.enemy.ki >= card.kiCost)
    .sort((a, b) => b.card.power - a.card.power);

  for (const { i } of fighters) {
    const result = playCard(G.enemy, i);
    if (result.ok) break; // play one fighter per trigger
  }
}

function enemyPlaySupportCards() {
  // Play support/transform if beneficial
  const supportable = G.enemy.hand
    .map((c, i) => ({ card: c, i }))
    .filter(({ card }) => (card.type === "support" || card.type === "transform") && G.enemy.ki >= card.kiCost);

  for (const { card, i } of supportable) {
    if (card.type === "transform" && !G.enemy.active) continue;
    if (card.type === "support" && card.effect?.type === "heal") {
      // Only heal if HP < 50%
      if (!G.enemy.active || G.enemy.active.currentHp > G.enemy.active.maxHp * 0.5) continue;
    }
    playCard(G.enemy, supportable.find(x => x.card === card).i);
    // re-index after splice — break and let next turn handle more
    break;
  }
}

function enemyDoAttack() {
  const attacker = G.enemy.active;
  const defender = G.player.active;
  if (!attacker || !defender) return;

  // Choose best attack enemy can afford
  const affordable = attacker.attacks
    .filter(a => G.enemy.ki >= a.kiCost)
    .sort((a, b) => b.damage - a.damage);

  if (affordable.length === 0) {
    addLog("enemy", `${attacker.name} no tiene Ki suficiente para atacar`);
    return;
  }

  const atk = affordable[0];
  G.enemy.ki -= atk.kiCost;
  let dmg = atk.damage + G.enemy.powerBoostTemp;
  G.enemy.powerBoostTemp = 0;

  if (defender.weakness === attacker.id) {
    dmg = Math.floor(dmg * 1.5);
    addLog("system", "¡Debilidad del jugador! x1.5 daño");
  }
  if (defender.resistance === attacker.id) {
    dmg = Math.max(0, dmg - 20);
    addLog("system", "Resistencia del jugador: -20 daño");
  }

  defender.currentHp -= dmg;
  addLog("enemy", `${attacker.name} usa ${atk.name} — ${dmg} daño a ${defender.name} (HP: ${Math.max(0, defender.currentHp)}/${defender.maxHp})`);

  if (defender.currentHp <= 0) {
    handleKO(G.player, G.enemy);
  }
}

// ──────────────────────────────────────────────────────────
//  Helpers
// ──────────────────────────────────────────────────────────

function addLog(who, msg) {
  G.log.push({ who, msg, ts: Date.now() });
  if (typeof UI !== "undefined" && UI.appendLog) UI.appendLog(who, msg);
}

function label(player) {
  return player.who === "player" ? "Tú" : "CPU";
}

/** Promote first bench fighter to active (player action) */
function promoteBenchFighter(player, benchIndex) {
  if (player.active) return { ok: false, reason: "Ya tienes un personaje activo" };
  if (!player.bench[benchIndex]) return { ok: false, reason: "Índice de banca inválido" };
  player.active = player.bench.splice(benchIndex, 1)[0];
  addLog(player.who, `${label(player)} envía a ${player.active.name} al frente`);
  return { ok: true };
}
