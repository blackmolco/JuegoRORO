// ============================================================
//  Dragon Ball TCG — UI Layer
// ============================================================

const UI = {

  // ── Cached DOM refs ──────────────────────────────────────
  refs: {},

  init() {
    this.refs = {
      screenMenu:    document.getElementById("screen-menu"),
      screenRules:   document.getElementById("screen-rules"),
      screenGame:    document.getElementById("screen-game"),
      btnStart:      document.getElementById("btn-start"),
      btnRules:      document.getElementById("btn-rules"),
      btnRulesBack:  document.getElementById("btn-rules-back"),
      btnAttack:     document.getElementById("btn-attack"),
      btnEndTurn:    document.getElementById("btn-end-turn"),
      enemyActive:   document.getElementById("enemy-active"),
      playerActive:  document.getElementById("player-active"),
      enemyBench:    document.getElementById("enemy-bench"),
      playerBench:   document.getElementById("player-bench"),
      playerHand:    document.getElementById("player-hand"),
      battleLog:     document.getElementById("battle-log"),
      turnDisplay:   document.getElementById("turn-display"),
      playerKi:      document.getElementById("player-ki"),
      enemyKi:       document.getElementById("enemy-ki"),
      playerDeck:    document.getElementById("player-deck-count"),
      enemyDeck:     document.getElementById("enemy-deck-count"),
      modalCard:     document.getElementById("modal-card"),
      modalContent:  document.getElementById("modal-card-content"),
      modalActions:  document.getElementById("modal-actions"),
      modalClose:    document.getElementById("modal-close-btn"),
      modalGameover: document.getElementById("modal-gameover"),
      gameoverTitle: document.getElementById("gameover-title"),
      gameoverMsg:   document.getElementById("gameover-msg"),
      btnPlayAgain:  document.getElementById("btn-play-again"),
      btnGoMenu:     document.getElementById("btn-go-menu"),
      toast:         document.getElementById("toast"),
    };

    this.bindEvents();
  },

  // ── Screen Navigation ────────────────────────────────────
  showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(`screen-${id}`).classList.add("active");
  },

  // ── Event Bindings ───────────────────────────────────────
  bindEvents() {
    this.refs.btnStart.addEventListener("click", () => {
      initGame();
      this.showScreen("game");
      this.render();
    });

    this.refs.btnRules.addEventListener("click", () => this.showScreen("rules"));
    this.refs.btnRulesBack.addEventListener("click", () => this.showScreen("menu"));

    this.refs.btnAttack.addEventListener("click", () => this.openAttackModal());

    this.refs.btnEndTurn.addEventListener("click", () => {
      endPlayerTurn();
      this.render();
    });

    this.refs.modalClose.addEventListener("click", () => this.closeModal());

    this.refs.btnPlayAgain.addEventListener("click", () => {
      this.refs.modalGameover.classList.add("hidden");
      initGame();
      this.showScreen("game");
      this.render();
    });

    this.refs.btnGoMenu.addEventListener("click", () => {
      this.refs.modalGameover.classList.add("hidden");
      this.showScreen("menu");
    });
  },

  // ── Master Render ────────────────────────────────────────
  render() {
    if (!G || !G.player) return;
    this.renderActiveZone("player");
    this.renderActiveZone("enemy");
    this.renderBench("player");
    this.renderBench("enemy");
    this.renderHand();
    this.renderTopBar();
    this.renderButtons();
    this.renderSpheres("player");
    this.renderSpheres("enemy");

    if (G.phase === "gameover") this.showGameover();
  },

  // ── Active Zone ──────────────────────────────────────────
  renderActiveZone(who) {
    const el  = who === "player" ? this.refs.playerActive : this.refs.enemyActive;
    const pl  = G[who];

    if (!pl.active) {
      el.innerHTML = `<div class="active-placeholder">Sin personaje activo</div>`;
      return;
    }
    el.innerHTML = this.buildFighterHTML(pl.active, who, true);

    if (who === "player") {
      el.querySelector(".card-fighter").addEventListener("click", () => {
        this.openCardDetail(pl.active, "player-active", null);
      });
    }
  },

  buildFighterHTML(card, who, isActive) {
    const hpPct  = Math.max(0, Math.round((card.currentHp / card.maxHp) * 100));
    const hpBarColor = hpPct > 50 ? "#4CAF50" : hpPct > 25 ? "#FF9800" : "#F44336";
    const glow   = who === "player" ? "glow-player" : "glow-enemy";
    return `
      <div class="card-fighter ${glow}" style="border-color:${card.color}">
        <div class="card-image" style="background:${card.color}22; font-size:2.2rem">${card.image}</div>
        <div class="card-name">${card.name}</div>
        <div class="card-meta">
          <span class="rarity-badge" style="background:${RARITY_COLORS[card.rarity]}">${RARITY_LABELS[card.rarity]}</span>
          <span class="saga-badge">${card.saga}</span>
        </div>
        <div class="hp-bar-wrap">
          <div class="hp-bar" style="width:${hpPct}%; background:${hpBarColor}"></div>
        </div>
        <div class="hp-text">${Math.max(0, card.currentHp)} / ${card.maxHp} HP</div>
        <div class="power-text">Poder: ${card.power}</div>
      </div>`;
  },

  // ── Bench ────────────────────────────────────────────────
  renderBench(who) {
    const el = who === "player" ? this.refs.playerBench : this.refs.enemyBench;
    const pl = G[who];
    el.innerHTML = "";

    pl.bench.forEach((card, idx) => {
      const wrap = document.createElement("div");
      wrap.className = "bench-slot";
      wrap.innerHTML = this.buildFighterHTML(card, who, false);

      if (who === "player") {
        wrap.title = "Click para ver carta";
        wrap.querySelector(".card-fighter").addEventListener("click", () => {
          this.openCardDetail(card, "bench", idx);
        });
      }
      el.appendChild(wrap);
    });

    // empty slots
    const empty = BENCH_LIMIT - pl.bench.length;
    for (let i = 0; i < empty; i++) {
      const slot = document.createElement("div");
      slot.className = "bench-slot empty-slot";
      slot.textContent = "—";
      el.appendChild(slot);
    }
  },

  // ── Hand ─────────────────────────────────────────────────
  renderHand() {
    const el = this.refs.playerHand;
    el.innerHTML = "";

    G.player.hand.forEach((card, idx) => {
      const div = document.createElement("div");
      div.className = `hand-card hand-card-${card.type}`;
      div.style.borderColor = card.color;
      div.innerHTML = `
        <div class="hand-card-image" style="background:${card.color}33">${card.image}</div>
        <div class="hand-card-name">${card.name}</div>
        <div class="hand-card-cost">Ki: ${card.kiCost}</div>
        <div class="hand-card-type type-${card.type}">${typeLabel(card.type)}</div>
      `;
      div.addEventListener("click", () => this.openCardDetail(card, "hand", idx));
      el.appendChild(div);
    });
  },

  // ── Top Bar / Ki / Deck ──────────────────────────────────
  renderTopBar() {
    this.refs.playerKi.textContent  = `Ki: ${G.player.ki} / ${G.player.maxKi}`;
    this.refs.enemyKi.textContent   = `Ki: ${G.enemy.ki} / ${G.enemy.maxKi}`;
    this.refs.playerDeck.textContent = G.player.deck.length;
    this.refs.enemyDeck.textContent  = G.enemy.deck.length;
    this.refs.turnDisplay.textContent = `Turno ${G.turn} — ${G.phase === "player" ? "Tu turno" : G.phase === "enemy" ? "Turno CPU" : "FIN"}`;
  },

  // ── Spheres ──────────────────────────────────────────────
  renderSpheres(who) {
    const pl = G[who];
    document.querySelectorAll(`.sphere[data-owner="${who}"]`).forEach((el, idx) => {
      el.classList.toggle("active",   idx < pl.spheres);
      el.classList.toggle("lost",     idx >= pl.spheres);
    });
  },

  // ── Action Buttons ───────────────────────────────────────
  renderButtons() {
    const isPlayerTurn  = G.phase === "player";
    const canAttack     = isPlayerTurn && !!G.player.active && !!G.enemy.active && !G.playerAttackedThisTurn;
    this.refs.btnAttack.disabled  = !canAttack;
    this.refs.btnEndTurn.disabled = !isPlayerTurn;
  },

  // ── Card Detail Modal ────────────────────────────────────
  openCardDetail(card, source, idx) {
    const isHand   = source === "hand";
    const isBench  = source === "bench";
    const isActive = source === "player-active";
    const canPlay  = G.phase === "player" && isHand && G.player.ki >= card.kiCost;
    const canSend  = G.phase === "player" && isBench && !G.player.active;

    let attacksHTML = "";
    if (card.type === "fighter" && card.attacks) {
      attacksHTML = card.attacks.map((a, i) =>
        `<div class="modal-attack">
          <span class="atk-name">${a.name}</span>
          <span class="atk-dmg">${a.damage} dmg</span>
          <span class="atk-cost">Ki: ${a.kiCost}</span>
        </div>`
      ).join("");
    }

    let effectHTML = "";
    if (card.type === "support" || card.type === "transform") {
      effectHTML = `<p class="modal-effect-desc">${card.description}</p>`;
    }

    const hpHTML = (card.type === "fighter" && card.currentHp !== undefined)
      ? `<div class="modal-hp">HP: ${Math.max(0,card.currentHp)} / ${card.maxHp}</div>` : "";

    this.refs.modalContent.innerHTML = `
      <div class="modal-card-display" style="border-color:${card.color}">
        <div class="modal-card-image" style="background:${card.color}22; font-size:4rem">${card.image}</div>
        <div class="modal-card-header">
          <h3>${card.name}</h3>
          <span class="rarity-badge" style="background:${RARITY_COLORS[card.rarity]}">${RARITY_LABELS[card.rarity]}</span>
          <span class="saga-badge">${card.saga}</span>
          <span class="type-badge type-${card.type}">${typeLabel(card.type)}</span>
        </div>
        ${hpHTML}
        <p class="modal-desc">${card.description || ""}</p>
        <div class="modal-cost">Costo Ki: ${card.kiCost}</div>
        ${card.type === "fighter" ? `<div class="modal-power">Poder base: ${card.power}</div>` : ""}
        ${attacksHTML}
        ${effectHTML}
      </div>`;

    const actionsEl = this.refs.modalActions;
    actionsEl.innerHTML = "";

    if (canPlay) {
      const btnPlay = document.createElement("button");
      btnPlay.className = "btn btn-primary";
      btnPlay.textContent = "Jugar Carta";
      btnPlay.addEventListener("click", () => {
        const result = playCard(G.player, idx);
        if (result.ok) {
          this.closeModal();
          this.render();
        } else {
          this.showToast(result.reason, "error");
        }
      });
      actionsEl.appendChild(btnPlay);
    }

    if (canSend) {
      const btnSend = document.createElement("button");
      btnSend.className = "btn btn-primary";
      btnSend.textContent = "Enviar al Frente";
      btnSend.addEventListener("click", () => {
        const result = promoteBenchFighter(G.player, idx);
        if (result.ok) {
          this.closeModal();
          this.render();
        } else {
          this.showToast(result.reason, "error");
        }
      });
      actionsEl.appendChild(btnSend);
    }

    if (!canPlay && !canSend && isHand) {
      actionsEl.innerHTML = `<p class="modal-no-action">Ki insuficiente o no es tu turno</p>`;
    }

    this.refs.modalCard.classList.remove("hidden");
  },

  closeModal() {
    this.refs.modalCard.classList.add("hidden");
  },

  // ── Attack Selection Modal ───────────────────────────────
  openAttackModal() {
    const card = G.player.active;
    if (!card) return;

    let attacksHTML = card.attacks.map((a, i) => {
      const canAfford = G.player.ki >= a.kiCost;
      return `
        <button class="btn btn-attack-option ${canAfford ? "" : "disabled-btn"}"
                data-idx="${i}" ${canAfford ? "" : "disabled"}>
          <strong>${a.name}</strong>
          <span>${a.damage} daño</span>
          <span>Ki: ${a.kiCost}</span>
        </button>`;
    }).join("");

    this.refs.modalContent.innerHTML = `
      <div class="modal-attack-select">
        <h3>Elige un ataque — ${card.name}</h3>
        <div class="attack-options">${attacksHTML}</div>
      </div>`;

    this.refs.modalActions.innerHTML = "";
    this.refs.modalCard.classList.remove("hidden");

    this.refs.modalContent.querySelectorAll(".btn-attack-option:not([disabled])").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.idx, 10);
        const result = playerAttack(idx);
        this.closeModal();
        this.render();
        if (!result.ok) this.showToast(result.reason, "error");
      });
    });
  },

  // ── Game Over ────────────────────────────────────────────
  showGameover() {
    const win = G.winner === "player";
    this.refs.gameoverTitle.textContent = win ? "¡VICTORIA!" : "DERROTA";
    this.refs.gameoverTitle.style.color = win ? "#FFD700" : "#F44336";
    this.refs.gameoverMsg.textContent   = win
      ? "¡Has reunido todas las Esferas del Dragón y ganado la batalla!"
      : "El CPU ha derrotado a todos tus guerreros. ¡Inténtalo de nuevo!";
    this.refs.modalGameover.classList.remove("hidden");
  },

  // ── Toast ────────────────────────────────────────────────
  showToast(msg, type = "info") {
    const t = this.refs.toast;
    t.textContent = msg;
    t.className   = `toast toast-${type}`;
    t.classList.remove("hidden");
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.add("hidden"), 2500);
  },

  // ── Log ──────────────────────────────────────────────────
  appendLog(who, msg) {
    const el = this.refs.battleLog;
    if (!el) return;
    const p = document.createElement("p");
    p.className = `log-entry log-${who}`;
    p.textContent = msg;
    el.appendChild(p);
    el.scrollTop = el.scrollHeight;
    // Trim old entries
    while (el.children.length > 60) el.removeChild(el.firstChild);
  }
};

// ── Helpers ─────────────────────────────────────────────
function typeLabel(type) {
  return { fighter: "Luchador", support: "Soporte", transform: "Transformación" }[type] || type;
}

// ── Boot ─────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => UI.init());
