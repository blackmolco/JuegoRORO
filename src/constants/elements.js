export const ELEMENTS = {
  fuego: { name: 'Fuego', icon: '🔥', color: '#FF4500' },
  agua: { name: 'Agua', icon: '💧', color: '#1E90FF' },
  viento: { name: 'Viento', icon: '🌪️', color: '#00CC66' },
  luz: { name: 'Luz', icon: '✨', color: '#FFD700' },
  oscuridad: { name: 'Oscuridad', icon: '🌑', color: '#9B59B6' },
};

// Ventaja elemental: atacante -> defensor = multiplicador
export const ELEMENT_CHART = {
  fuego: { viento: 1.5, agua: 0.75, fuego: 1.0, luz: 1.0, oscuridad: 1.0 },
  agua: { fuego: 1.5, viento: 0.75, agua: 1.0, luz: 1.0, oscuridad: 1.0 },
  viento: { agua: 1.5, fuego: 0.75, viento: 1.0, luz: 1.0, oscuridad: 1.0 },
  luz: { oscuridad: 1.5, luz: 1.0, fuego: 1.0, agua: 1.0, viento: 1.0 },
  oscuridad: { luz: 1.5, oscuridad: 1.0, fuego: 1.0, agua: 1.0, viento: 1.0 },
};

export const getElementMultiplier = (attackerElement, defenderElement) => {
  return ELEMENT_CHART[attackerElement]?.[defenderElement] ?? 1.0;
};

export const ROLES = {
  atk: { name: 'Atacante', icon: '⚔️', color: '#E74C3C' },
  hp: { name: 'Tanque', icon: '🛡️', color: '#2980B9' },
  sup: { name: 'Soporte', icon: '💚', color: '#27AE60' },
  ctrl: { name: 'Control', icon: '🔮', color: '#8E44AD' },
};

export const STATUS_EFFECTS = {
  stun: { name: 'Aturdido', icon: '💫', color: '#F1C40F', duration: 1 },
  burn: { name: 'Quemado', icon: '🔥', color: '#E74C3C', duration: 2 },
  poison: { name: 'Veneno', icon: '☠️', color: '#9B59B6', duration: 3 },
  slow: { name: 'Lento', icon: '🐢', color: '#95A5A6', duration: 2 },
  shield: { name: 'Escudo', icon: '🛡️', color: '#3498DB', duration: 2 },
  atk_up: { name: 'ATK+', icon: '⬆️', color: '#E67E22', duration: 2 },
  def_up: { name: 'DEF+', icon: '🔰', color: '#2ECC71', duration: 2 },
  atk_down: { name: 'ATK-', icon: '⬇️', color: '#E74C3C', duration: 2 },
  def_down: { name: 'DEF-', icon: '💔', color: '#C0392B', duration: 2 },
  heal: { name: 'Cura', icon: '💚', color: '#2ECC71', duration: 1 },
  invincible: { name: 'Invencible', icon: '⭐', color: '#FFD700', duration: 1 },
};
