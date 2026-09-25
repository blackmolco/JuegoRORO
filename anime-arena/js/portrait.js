/* =========================================================
   Retratos SVG generados por código, estilo anime.
   - Rostro, ojos de anime, pelo con sombra y brillo
   - Ropa característica de cada personaje ("wear")
   - Transformación al DESPERTAR (Super Saiyajin, Gear 5, Kurama...)
   - Imágenes propias opcionales (ver js/custom-images.js)
   ========================================================= */

const HAIR_BACK = {
  long: 'M27,44 Q27,22 50,22 Q73,22 73,44 L78,92 L62,92 L64,52 L36,52 L38,92 L22,92 Z',
  bob: 'M28,42 Q28,24 50,24 Q72,24 72,42 L73,72 L64,70 L66,50 L34,50 L36,70 L27,72 Z',
  sasuke: 'M34,32 L38,8 L46,22 L56,4 L60,22 L74,10 L70,32 Z',
  tied: 'M46,28 L60,4 L74,2 L66,12 L78,12 L64,22 L58,30 Z',
};

const HAIR_FRONT = {
  goku: 'M28,50 L14,44 L26,38 L10,28 L28,28 L20,12 L38,22 L44,4 L54,20 L66,6 L68,24 L86,16 L76,32 L90,38 L74,42 L72,50 L68,40 L66,48 L60,36 L56,46 L52,34 L46,46 L42,36 L36,48 L34,38 Z',
  gokuSSJ: 'M30,48 L22,36 L28,34 L20,18 L34,24 L32,4 L44,20 L50,-2 L56,20 L68,4 L66,24 L80,18 L72,34 L78,36 L70,48 L68,38 L62,42 L58,32 L53,42 L50,33 L47,46 L44,33 L38,42 L32,38 Z',
  vegeta: 'M31,46 L28,28 L22,20 L33,22 L32,6 L42,18 L50,-2 L58,18 L68,6 L67,22 L78,20 L72,28 L69,46 L66,34 Q58,38 55,30 L50,38 L45,30 Q42,38 34,34 Z',
  spiky: 'M29,50 L22,40 L28,38 L22,26 L34,28 L32,14 L44,22 L50,8 L56,22 L68,14 L66,28 L78,26 L72,38 L78,40 L71,50 L68,38 L62,44 L58,34 L52,42 L46,33 L40,43 L36,36 L32,44 Z',
  short: 'M30,48 Q28,26 50,25 Q72,26 70,48 L67,38 L60,36 L55,40 L50,35 L45,40 L40,36 L33,38 Z',
  messy: 'M30,48 L26,36 L30,34 L28,24 L38,26 L42,18 L50,23 L58,17 L62,26 L72,24 L70,34 L74,36 L70,48 L66,38 L60,40 L56,34 L50,40 L44,34 L40,40 L34,38 Z',
  luffyG5: 'M28,48 Q18,40 24,30 Q14,22 26,16 Q24,4 38,10 Q44,-2 52,8 Q62,-2 66,10 Q80,6 76,18 Q88,22 78,32 Q86,40 72,48 L68,38 L60,40 L55,34 L50,40 L45,34 L40,40 L32,38 Z',
  flat: 'M31,44 Q30,26 50,26 Q70,26 69,44 Q66,34 58,33 L50,35 L42,33 Q34,34 31,44 Z',
  slick: 'M30,46 Q28,24 50,24 Q72,24 70,46 Q68,32 50,30 Q34,31 30,46 Z',
  kenpachi: 'M28,54 L8,50 L22,42 L6,32 L24,30 L14,16 L32,22 L32,6 L44,18 L50,2 L56,18 L68,6 L68,22 L86,16 L76,30 L94,32 L78,42 L92,50 L72,54 L68,38 Q50,30 32,38 Z',
  bob: 'M30,46 Q28,25 50,24 Q72,25 70,46 L66,36 L58,38 L54,32 L50,38 L44,33 L38,39 L32,37 Z',
  long: 'M30,46 Q28,25 50,24 Q72,25 70,46 L66,36 L58,38 L54,32 L50,38 L44,33 L38,39 L32,37 Z',
  tied: 'M30,46 Q28,24 50,24 Q72,24 70,46 Q68,32 50,31 Q34,31 30,46 Z',
  bangs: 'M30,46 Q28,25 50,24 Q72,25 70,50 Q70,60 65,60 Q60,50 52,38 L46,34 L40,38 L34,38 Z',
  sasuke: 'M30,58 Q27,26 50,25 Q73,26 70,58 L66,40 L60,41 L56,34 L50,40 L44,34 L40,41 L34,40 Z',
  kakashi: 'M30,46 L28,32 L34,26 L30,14 L44,20 L50,6 L58,18 L74,6 L70,22 L90,20 L74,32 L80,40 L70,46 L68,36 L60,38 L56,32 L50,38 L44,32 L38,38 L33,36 Z',
};

/* Estilo por personaje: forma de ojos, ropa, símbolo y transformación al despertar */
const PORTRAIT_STYLE = {
  goku:       { eye: 'round', wear: 'gi', sym: '亀', aw: { hair: '#ffd23a', style: 'gokuSSJ', eyes: '#1fa87a', brow: 'angry', mouth: 'smirk', aura: '#ffd23a' } },
  vegeta:     { eye: 'sharp', wear: 'armor', pad: '#e8c040', aw: { hair: '#ffd23a', eyes: '#1fa87a', aura: '#ffd23a' } },
  piccolo:    { eye: 'sharp', wear: 'piccolo', aw: { aura: '#9ae66e' } },
  gohan:      { eye: 'sharp', wear: 'gi', aw: { hair: '#ffd23a', style: 'gokuSSJ', eyes: '#1fa87a', aura: '#ffd23a', sparks: true } },
  frieza:     { eye: 'sharp', wear: 'frieza', aw: { skin: '#f2c230', outfit: '#f2c230', aura: '#ffd23a' } },
  cell:       { eye: 'sharp', wear: 'cell', extras: ['wings'], aw: { aura: '#9ae66e', sparks: true } },
  krilin:     { eye: 'round', wear: 'gi', sym: '亀', aw: { aura: '#ffffff' } },
  trunks:     { eye: 'sharp', wear: 'jacket', collar: '#1b1b1b', aw: { hair: '#ffd23a', eyes: '#1fa87a', aura: '#ffd23a' } },
  yamcha:     { eye: 'round', wear: 'gi', sym: '亀', aw: { aura: '#ffffff' } },
  tenshinhan: { eye: 'sharp', wear: 'gi', sym: '鶴', aw: { aura: '#ffffff' } },
  ichigo:     { eye: 'sharp', wear: 'shihakusho', strap: true, aw: { wear: 'bankai', eyes: '#8a1010', extras: ['hollowMask'], aura: '#d42020' } },
  rukia:      { eye: 'round', wear: 'shihakusho', aw: { aura: '#bfe6ff', hair: '#f4f8ff', outfit: '#f4f8ff' } },
  byakuya:    { eye: 'sharp', wear: 'haori', aw: { aura: '#ff9ec8', petals: true } },
  aizen:      { eye: 'narrow', wear: 'haori', aw: { wear: 'arrancar', eyes: '#8b3fb8', aura: '#b073ff' } },
  kenpachi:   { eye: 'sharp', wear: 'haori', aw: { aura: '#ffe066' } },
  toshiro:    { eye: 'sharp', wear: 'haori', aw: { aura: '#bfe6ff', extras: ['iceWings'] } },
  orihime:    { eye: 'round', wear: 'school', blush: true, aw: { aura: '#ffb070' } },
  renji:      { eye: 'sharp', wear: 'shihakusho', aw: { aura: '#ff5a36' } },
  uryu:       { eye: 'sharp', wear: 'quincy', aw: { aura: '#8ec8ff' } },
  ulquiorra:  { eye: 'narrow', wear: 'arrancar', aw: { extras: ['batWings'], hair: '#1b1b1b', aura: '#2fbf5f' } },
  kaneda:     { eye: 'round', wear: 'jacket', collar: '#f2f2f2', aw: { aura: '#ff5a36' } },
  tetsuo:     { eye: 'sharp', wear: 'jacket', collar: '#3a3a3a', aw: { aura: '#ffffff', sparks: true } },
  kei:        { eye: 'sharp', wear: 'jacket', collar: '#2a3a2a', aw: { aura: '#9ae66e' } },
  luffy:      { eye: 'round', wear: 'vest', aw: { hair: '#f4f4f4', style: 'luffyG5', outfit: '#f4f4f4', eyes: '#c0152f', aura: '#ffffff', mouth: 'grin' } },
  zoro:       { eye: 'sharp', wear: 'robe', aw: { aura: '#6a2a9a' } },
  sanji:      { eye: 'sharp', wear: 'suit', aw: { aura: '#ff7a1f' } },
  nami:       { eye: 'round', wear: 'stripes', blush: true, aw: { aura: '#6ab0ff', sparks: true } },
  ace:        { eye: 'round', wear: 'shirtless', aw: { aura: '#ff7a1f' } },
  law:        { eye: 'narrow', wear: 'hoodie', aw: { aura: '#6ab0ff' } },
  chopper:    { eye: 'dot', wear: 'fur', blush: true, aw: { aura: '#ff9ec8' } },
  shanks:     { eye: 'sharp', wear: 'openshirt', shirt: '#f4f4f4', aw: { aura: '#d42020', sparks: true } },
  blackbeard: { eye: 'round', wear: 'coat', aw: { aura: '#3a1470' } },
  usopp:      { eye: 'round', wear: 'overalls', aw: { aura: '#f2c230' } },
  naruto:     { eye: 'round', wear: 'naruto', aw: { wear: 'kurama', hair: '#ffb020', eyes: '#ff7a00', aura: '#ffb020' } },
  sasuke:     { eye: 'sharp', wear: 'openshirt', shirt: '#f4f4f4', sharingan: true, aw: { aura: '#8b3fb8', mangekyo: true } },
  kakashi:    { eye: 'narrow', wear: 'jonin', aw: { aura: '#6ab0ff', sparks: true } },
  itachi:     { eye: 'narrow', wear: 'akatsuki', sharingan: true, aw: { aura: '#c0152f', mangekyo: true } },
};

/* Tipo de efecto visual del ataque en combate */
const FX_KIND = {
  goku: 'ki', vegeta: 'ki', piccolo: 'ki', gohan: 'ki', frieza: 'dark', cell: 'ki', krilin: 'ki', trunks: 'slash',
  yamcha: 'punch', tenshinhan: 'ki', ichigo: 'slash', rukia: 'ice', byakuya: 'petals', aizen: 'dark', kenpachi: 'slash',
  toshiro: 'ice', orihime: 'light', renji: 'slash', uryu: 'arrow', ulquiorra: 'ki', kaneda: 'laser', tetsuo: 'psychic',
  kei: 'arrow', luffy: 'punch', zoro: 'slash', sanji: 'fire', nami: 'lightning', ace: 'fire', law: 'slash',
  chopper: 'punch', shanks: 'slash', blackbeard: 'dark', usopp: 'arrow', naruto: 'ki', sasuke: 'lightning',
  kakashi: 'lightning', itachi: 'fire',
};
const FX_COLOR = {
  ki: '#7ad8ff', dark: '#b073ff', slash: '#ffffff', punch: '#ffd23a', ice: '#bfe6ff', petals: '#ff9ec8',
  light: '#fff3b0', arrow: '#8ec8ff', laser: '#ff4a4a', psychic: '#ff7ad8', fire: '#ff7a1f', lightning: '#9ad8ff',
};

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) + amt, g = ((n >> 8) & 255) + amt, b = (n & 255) + amt;
  r = Math.max(0, Math.min(255, r)); g = Math.max(0, Math.min(255, g)); b = Math.max(0, Math.min(255, b));
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

function parseExtras(list) {
  const out = {};
  (list || []).forEach(e => { const [k, v] = e.split(':'); out[k] = v || true; });
  return out;
}

/** Combina el look base, el estilo y (si corresponde) la transformación de despertar. */
function getLook(id, aw) {
  const base = CHARS[id].look;
  const st = PORTRAIT_STYLE[id] || {};
  const L = { ...base, ...st, extras: [...(base.extras || []), ...(st.extras || [])] };
  if (st.collar) L.collar = st.collar;
  if (aw && st.aw) {
    Object.assign(L, st.aw, { extras: [...L.extras, ...(st.aw.extras || [])] });
  }
  if (aw && !L.aura) L.aura = ELEMENTS[CHARS[id].el].color;
  return L;
}

const BODY = 'M10,100 Q12,80 32,76 L68,76 Q88,80 90,100 Z';
const FACE = 'M30.5,46 Q30.5,63 40,72 Q45,77 50,77.5 Q55,77 60,72 Q69.5,63 69.5,46 Q69.5,27 50,27 Q30.5,27 30.5,46 Z';
const mirror = inner => `${inner}<g transform="translate(100 0) scale(-1 1)">${inner}</g>`;

/* ---------- Ropa ---------- */
function wearSVG(L, skin, skinD) {
  const o = L.outfit, c = L.collar, oD = shade(o, -45);
  const base = fill => `<path d="${BODY}" fill="${fill}" stroke="${shade(fill, -55)}" stroke-width="1"/>`;
  const neck = `<path d="M43,62 L57,62 L58,80 L42,80 Z" fill="${skinD}"/>`;
  const vneck = (fill, depth = 92) => `<path d="M40,76 L50,${depth} L60,76 Z" fill="${fill}"/>`;
  const panels = (fill, inner = 42, bottom = 46) => mirror(`<path d="M10,100 Q12,80 32,76 L${inner},76 L${bottom},100 Z" fill="${fill}" stroke="${shade(fill, -50)}" stroke-width="0.8"/>`);
  const sym = L.sym ? `<circle cx="66" cy="87" r="5.4" fill="#fff" stroke="#1b1b1b" stroke-width="0.6"/><text x="66" y="89.4" font-size="6.6" text-anchor="middle" font-weight="900" fill="#1b1b1b" font-family="sans-serif">${L.sym}</text>` : '';
  switch (L.wear) {
    case 'gi':
      return neck + base(o) + `<path d="M38,76 L50,95 L62,76 Z" fill="${c}"/>` +
        `<path d="M36,76 L50,97 M64,76 L50,97" stroke="${oD}" stroke-width="1.6"/>` + sym;
    case 'armor':
      return `<path d="M41,60 L59,60 L60,80 L40,80 Z" fill="${o}"/>` + base(o) +
        `<path d="M24,100 Q25,84 36,79 L64,79 Q75,84 76,100 Z" fill="#f4f4f4" stroke="#b0b0b0" stroke-width="0.8"/>` +
        `<path d="M50,80 L50,100 M30,90 Q50,95 70,90" stroke="#c8c8c8" stroke-width="1" fill="none"/>` +
        mirror(`<path d="M6,94 Q6,78 26,75 L34,79 Q20,83 16,98 Z" fill="${L.pad}" stroke="${shade(L.pad, -60)}" stroke-width="0.8"/>`);
    case 'frieza':
      return neck + base(o) + mirror(`<ellipse cx="20" cy="86" rx="10" ry="7.5" fill="#8b3fb8"/><ellipse cx="18" cy="84" rx="4" ry="2" fill="#fff" opacity=".35"/>`) +
        `<ellipse cx="50" cy="94" rx="11" ry="6" fill="#8b3fb8"/>`;
    case 'cell':
      return neck + base(o) + `<path d="M36,78 L50,90 L64,78 L64,100 L36,100 Z" fill="#2b2b2b"/>` +
        `<g fill="#1b1b1b">${[[18, 88], [24, 96], [78, 90], [84, 97], [72, 84], [28, 82]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2"/>`).join('')}</g>`;
    case 'piccolo':
      return neck + base(o) + vneck(shade(o, -30)) +
        mirror(`<path d="M2,100 Q0,76 20,71 Q34,70 37,79 L30,100 Z" fill="#f4f4f4" stroke="#b8b8b8" stroke-width="0.8"/>`);
    case 'shihakusho':
    case 'haori':
    case 'bankai': {
      let s = neck + base(L.wear === 'bankai' ? '#141414' : '#1b1b1b');
      if (L.wear === 'bankai') {
        s += `<path d="M34,62 L35,84 L65,84 L66,62 Q50,72 34,62 Z" fill="#141414" stroke="#333" stroke-width="0.8"/>` +
          `<path d="M39,68 Q50,75 61,68 L60,82 L40,82 Z" fill="#8a1010"/>`;
        return s;
      }
      s += `<path d="M37,76 L50,97 L63,76 L58,76 L50,89 L42,76 Z" fill="#f2f2f2"/>`;
      if (L.strap) s += `<path d="M20,80 L72,100" stroke="#b01a1a" stroke-width="4"/>`;
      if (L.wear === 'haori') s += mirror(`<path d="M10,100 Q12,80 32,76 L37,76 L34,100 Z" fill="#f4f4f4" stroke="#b8b8b8" stroke-width="0.8"/>`);
      return s;
    }
    case 'arrancar':
    case 'quincy': {
      const trim = L.wear === 'quincy' ? '#3a6fd8' : '#1b1b1b';
      return base('#f4f4f4') + `<path d="M37,60 L39,82 L61,82 L63,60 L57,70 L43,70 Z" fill="#f4f4f4" stroke="#a8a8a8" stroke-width="0.8"/>` +
        `<path d="M43,70 L57,70 L56,80 L44,80 Z" fill="${skinD}"/>` +
        `<path d="M50,82 L50,100" stroke="${trim}" stroke-width="2"/>` +
        (L.wear === 'quincy' ? `<path d="M64,88 h7 M67.5,84.5 v7" stroke="${trim}" stroke-width="1.6"/>` : '');
    }
    case 'school':
      return neck + base('#f4f4f4') + vneck(skinD, 86) + `<path d="M45,81 L50,84 L55,81 L55,87 L50,84 L45,87 Z" fill="#d4202a"/>`;
    case 'vest':
      return neck + base(skin) + `<path d="M44,85 L56,98 M56,85 L44,98" stroke="#b05050" stroke-width="1.5"/>` + panels(o, 40, 42);
    case 'robe':
      return neck + base(skin) + `<path d="M40,82 L60,100" stroke="#a05050" stroke-width="1.4"/>` + panels(o, 41, 45) +
        `<path d="M34,99 L66,99" stroke="#1f5a2a" stroke-width="3"/>`;
    case 'suit':
      return neck + base('#1b1b1b') + vneck(c, 99) +
        `<path d="M48.6,79 L51.4,79 L52.4,94 L50,98 L47.6,94 Z" fill="#101010"/>` +
        `<path d="M40,76 L46,92 M60,76 L54,92" stroke="#3a3a3a" stroke-width="1.2"/>`;
    case 'stripes':
      return neck + base(o) + `<g stroke="#f4f4f4" stroke-width="2.4">
        <line x1="19" y1="84" x2="81" y2="84"/><line x1="14" y1="90" x2="86" y2="90"/><line x1="12" y1="96" x2="88" y2="96"/></g>` + vneck(skinD, 86);
    case 'shirtless': {
      let beads = '';
      for (let i = 0; i <= 8; i++) { const t = i / 8; beads += `<circle cx="${36 + 28 * t}" cy="${78 + 9 * Math.sin(Math.PI * t)}" r="1.7" fill="#d42020" stroke="#7a1010" stroke-width="0.4"/>`; }
      return neck + base(skin) + `<path d="M36,90 Q43,93 49,90 M51,90 Q57,93 64,90" stroke="${skinD}" stroke-width="1" fill="none"/>` + beads;
    }
    case 'hoodie':
      return neck + base(o) + mirror(`<path d="M10,100 Q12,80 26,77 L28,100 Z" fill="#1b1b1b"/>`) +
        `<path d="M33,76 Q50,85 67,76 L65,81 Q50,90 35,81 Z" fill="#1b1b1b"/>` +
        `<circle cx="62" cy="92" r="5" fill="#1b1b1b"/><path d="M59.5,93 Q62,95.5 64.5,93" stroke="${o}" stroke-width="1" fill="none"/><circle cx="60.5" cy="90.5" r=".8" fill="${o}"/><circle cx="63.5" cy="90.5" r=".8" fill="${o}"/>`;
    case 'openshirt':
      return neck + base(skin) + panels(L.shirt || o, 40, 43);
    case 'coat':
      return neck + base(skin) + `<path d="M40,86 q3,-2 6,0 M54,86 q3,-2 6,0 M46,92 q3,-2 6,0" stroke="#3a2a1a" stroke-width="0.8" fill="none"/>` +
        panels('#f4f4f4', 40, 42) + panels('#1b1b1b', 30, 30);
    case 'overalls':
      return neck + base(o) + vneck(skinD, 86) + `<rect x="36" y="86" width="28" height="14" fill="${shade(o, -25)}"/>` +
        `<path d="M37,76 L38,88 M63,76 L62,88" stroke="#5a3a1a" stroke-width="3"/>`;
    case 'fur':
      return base(o);
    case 'naruto':
      return neck + base(o) + `<path d="M10,100 Q12,80 32,76 L68,76 Q88,80 90,100 L88,93 Q84,84 66,81 L34,81 Q16,84 12,93 Z" fill="#1b1b1b"/>` +
        `<path d="M35,69 L35,83 Q50,87 65,83 L65,69 Q50,76 35,69 Z" fill="${o}" stroke="${oD}" stroke-width="0.8"/>` +
        `<path d="M50,76 L50,100" stroke="#e8e8e8" stroke-width="1.4"/>`;
    case 'kurama':
      return neck + base('#ffc21a') + `<path d="M35,76 Q50,84 65,76" stroke="#1b1b1b" stroke-width="3" fill="none"/>` +
        `<g fill="#1b1b1b">${[[30, 82], [40, 86], [60, 86], [70, 82]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="1.8"/>`).join('')}</g>` +
        `<path d="M50,84 m-6,0 a6,6 0 1,0 12,0 a6,6 0 1,0 -12,0" stroke="#1b1b1b" stroke-width="1.2" fill="none"/><path d="M50,84 m-2,0 q2,-3 4,0 q-2,3 -4,0" fill="#1b1b1b"/>`;
    case 'jonin':
      return `<path d="M42,60 L58,60 L59,80 L41,80 Z" fill="${c}"/>` + base(c) +
        mirror(`<path d="M18,100 Q20,84 34,79 L46,79 L46,100 Z" fill="${o}" stroke="${shade(o, -40)}" stroke-width="0.8"/><rect x="36" y="86" width="7" height="8" rx="1" fill="${shade(o, -20)}" stroke="${shade(o, -45)}" stroke-width="0.5"/>`) +
        `<path d="M36,70 L36,82 L64,82 L64,70 Q50,78 36,70 Z" fill="${o}" stroke="${shade(o, -40)}" stroke-width="0.8"/>`;
    case 'akatsuki': {
      const cloud = (x, y) => `<path transform="translate(${x} ${y})" d="M-6,2 Q-7,-3 -2,-3 Q0,-7 4,-4 Q8,-4 7,1 Q6,4 0,3 Q-5,5 -6,2 Z" fill="#c0101c" stroke="#fff" stroke-width="0.8"/>`;
      return neck + base('#161616') + `<path d="M33,62 L35,84 L65,84 L67,62 L58,72 L42,72 Z" fill="#161616" stroke="#333" stroke-width="0.8"/>` +
        `<path d="M42,72 L58,72 L56,82 L44,82 Z" fill="#9a0c16"/>` + cloud(22, 92) + cloud(79, 90);
    }
    case 'jacket':
      return neck + base(o) + vneck(c, 96) + mirror(`<path d="M33,76 L42,76 L47,94 L38,86 Z" fill="${oD}"/>`) +
        (L.extras && L.extras.includes('pill') ? '' : '');
    default:
      return neck + base(o) + vneck(c);
  }
}

/* ---------- Ojos (se dibuja el izquierdo y se refleja) ---------- */
function eyeSVG(L) {
  const cx = 41.5, col = L.eyes, style = L.eye || 'round';
  let e = '';
  if (style === 'dot') {
    e = `<circle cx="${cx}" cy="53" r="3.2" fill="#111"/><circle cx="${cx + 1}" cy="51.8" r="1.1" fill="#fff"/>`;
  } else if (style === 'round') {
    e = `<ellipse cx="${cx}" cy="52.5" rx="4.6" ry="5" fill="#fff"/>
      <ellipse cx="${cx + 0.6}" cy="53" rx="3.2" ry="4.1" fill="${col}"/>
      <ellipse cx="${cx + 0.6}" cy="53.6" rx="1.5" ry="2.2" fill="#111"/>
      <circle cx="${cx + 1.8}" cy="51.2" r="1.2" fill="#fff"/><circle cx="${cx - 0.6}" cy="55.6" r="0.6" fill="#fff" opacity=".8"/>
      <path d="M${cx - 5.4},51 Q${cx - 1},46 ${cx + 5},49" stroke="#111" stroke-width="1.9" fill="none" stroke-linecap="round"/>`;
  } else {
    e = `<path d="M${cx - 6},50.5 Q${cx - 1},47.2 ${cx + 5},51 Q${cx + 1},55.8 ${cx - 6},50.5 Z" fill="#fff"/>
      <ellipse cx="${cx + 0.5}" cy="51.6" rx="2.5" ry="2.8" fill="${col}"/>
      <circle cx="${cx + 0.5}" cy="51.7" r="1.1" fill="#111"/><circle cx="${cx + 1.4}" cy="50.6" r="0.7" fill="#fff"/>
      <path d="M${cx - 6.5},50 Q${cx - 1},46.4 ${cx + 5.2},50.8" stroke="#111" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    if (style === 'narrow') {
      e += `<path d="M${cx - 6.6},49.6 Q${cx - 1},46 ${cx + 5.6},50.6 Q${cx - 1},49.4 ${cx - 6.6},51 Z" fill="${L.skin}"/>
        <path d="M${cx - 6.6},50.7 Q${cx - 1},49 ${cx + 5.6},50.9" stroke="#111" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    }
  }
  if ((L.sharingan || L.mangekyo) && style !== 'dot') {
    const cy = style === 'round' ? 53 : 51.7, r = style === 'round' ? 2.2 : 1.7;
    if (L.mangekyo) {
      e += `<path d="M${cx + 0.5},${cy - r} L${cx + 0.5 + r * 0.5},${cy} L${cx + 0.5},${cy + r} L${cx + 0.5 - r * 0.5},${cy} Z M${cx + 0.5 - r},${cy} L${cx + 0.5},${cy - r * 0.5} L${cx + 0.5 + r},${cy} L${cx + 0.5},${cy + r * 0.5} Z" fill="#111"/>`;
    } else {
      e += [0, 120, 240].map(a => {
        const rad = (a - 90) * Math.PI / 180;
        return `<circle cx="${(cx + 0.5 + Math.cos(rad) * r).toFixed(2)}" cy="${(cy + Math.sin(rad) * r).toFixed(2)}" r="0.55" fill="#111"/>`;
      }).join('');
    }
  }
  // Cejas
  const bc = L.extras.includes('dome') || L.style === 'bald' ? shade(L.skin, -45) : shade(L.hair, -35);
  if (!L.extras.includes('curlyBrow')) {
    if (L.brow === 'angry') e += `<path d="M${cx - 6.5},44.2 L${cx + 5},47.6 L${cx + 4.6},49 L${cx - 6.5},45.8 Z" fill="${bc}"/>`;
    else e += `<path d="M${cx - 5},46 Q${cx},43.6 ${cx + 5},45.4" stroke="${bc}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  }
  return mirror(e);
}

function auraSVG(color) {
  const flame = 'M50,2 L58,18 L70,4 L72,22 L88,12 L82,32 L98,32 L86,48 L98,62 L84,66 L94,82 L76,80 L82,100 L18,100 L24,80 L6,82 L16,66 L2,62 L14,48 L2,32 L18,32 L12,12 L28,22 L30,4 L42,18 Z';
  return `<g><path d="${flame}" fill="${color}" opacity=".55"><animate attributeName="opacity" values=".35;.7;.35" dur="1.1s" repeatCount="indefinite"/></path>
    <path d="${flame}" transform="translate(50 56) scale(.78) translate(-50 -56)" fill="#fff" opacity=".25"><animate attributeName="opacity" values=".1;.35;.1" dur=".8s" repeatCount="indefinite"/></path></g>`;
}

const _portraitCache = {};

/** Devuelve el HTML del retrato (SVG generado o imagen propia). */
function portraitSVG(id, aw = false) {
  const key = id + (aw ? '_aw' : '');
  if (_portraitCache[key]) return _portraitCache[key];
  const imgs = typeof CUSTOM_IMAGES !== 'undefined' ? CUSTOM_IMAGES : {};
  const file = (aw && imgs[id + '_despertado']) || imgs[id];
  if (file) {
    _portraitCache[key] = `<img class="portrait" src="img/${file}" alt="" draggable="false" onerror="this.outerHTML=drawPortrait('${id}',${aw})">`;
    return _portraitCache[key];
  }
  _portraitCache[key] = drawPortrait(id, aw);
  return _portraitCache[key];
}

function drawPortrait(id, aw = false) {
  const ch = CHARS[id];
  const L = getLook(id, aw);
  const el = ELEMENTS[ch.el];
  const x = parseExtras(L.extras);
  const skin = L.skin, skinD = shade(L.skin, -40), hair = L.hair, hairD = shade(L.hair, -35);
  let s = '';

  // Fondo
  s += `<rect width="100" height="100" fill="${el.dark}"/>`;
  s += `<circle cx="50" cy="42" r="62" fill="${el.color}" opacity="0.45"/><circle cx="50" cy="42" r="36" fill="${el.color}" opacity="0.45"/>`;
  s += `<g opacity="0.18" fill="#fff">${[0, 45, 90, 135].map(a =>
    `<polygon points="50,50 46,-20 54,-20" transform="rotate(${a} 50 50)"/><polygon points="50,50 46,-20 54,-20" transform="rotate(${a + 180} 50 50)"/>`).join('')}</g>`;
  if (L.aura) s += auraSVG(L.aura);
  if (L.petals) s += `<g fill="#ff9ec8" opacity=".85">${[[12, 20], [84, 16], [8, 60], [90, 54], [20, 88], [80, 84]].map(p => `<ellipse cx="${p[0]}" cy="${p[1]}" rx="3" ry="1.6" transform="rotate(35 ${p[0]} ${p[1]})"/>`).join('')}</g>`;

  // Alas / capas detrás
  if (x.wings) s += mirror(`<path d="M30,80 L4,50 L10,72 L0,70 L18,94 Z" fill="#1b1b1b" opacity=".92"/>`);
  if (x.batWings) s += mirror(`<path d="M32,74 Q8,36 0,58 Q10,60 4,78 Q14,76 12,94 Q22,84 32,92 Z" fill="#141414"/>`);
  if (x.iceWings) s += mirror(`<path d="M32,76 L2,40 L14,62 L0,62 L16,78 L4,86 L28,90 Z" fill="#dff3ff" stroke="#8ec8ff" stroke-width="1" opacity=".9"/>`);
  if (x.cape) s += `<path d="M4,100 Q8,72 30,70 L70,70 Q92,72 96,100 Z" fill="${x.cape === true ? '#1b1b1b' : x.cape}"/>`;
  if (x.sword) s += `<g><line x1="66" y1="100" x2="88" y2="62" stroke="#9aa4b0" stroke-width="5" stroke-linecap="round"/>
    <line x1="84" y1="66" x2="94" y2="72" stroke="#c8a030" stroke-width="3"/>
    <line x1="89" y1="61" x2="94" y2="52" stroke="#3a1a10" stroke-width="4" stroke-linecap="round"/></g>`;
  if (HAIR_BACK[L.style]) s += `<path d="${HAIR_BACK[L.style]}" fill="${hairD}"/>`;

  // Cuerpo y ropa
  s += wearSVG(L, skin, skinD);
  if (x.pill) s += `<g transform="translate(66 88) rotate(-30)"><rect x="-6" y="-3" width="12" height="6" rx="3" fill="#fff"/><rect x="0" y="-3" width="6" height="6" rx="3" fill="#1b1b1b"/></g>`;
  if (x.scarf) s += `<path d="M33,74 Q50,82 67,74 L69,81 Q50,90 31,81 Z" fill="#cfe8e0" stroke="#8ab0a4" stroke-width="0.8"/>`;

  // Orejas y cara
  s += `<ellipse cx="31" cy="53" rx="4" ry="6" fill="${skinD}"/><ellipse cx="69" cy="53" rx="4" ry="6" fill="${skinD}"/>`;
  s += `<path d="${FACE}" fill="${skin}"/>`;
  s += `<path d="M36,68 Q50,80 64,68 Q58,76 50,77 Q42,76 36,68 Z" fill="${skinD}" opacity="0.25"/>`;
  if (L.blush) s += `<ellipse cx="37" cy="60" rx="3.5" ry="1.6" fill="#ff7a8a" opacity=".4"/><ellipse cx="63" cy="60" rx="3.5" ry="1.6" fill="#ff7a8a" opacity=".4"/>`;
  if (x.earrings) s += `<g fill="#f2c230"><circle cx="30" cy="57" r="1.4"/><circle cx="30" cy="60.5" r="1.4"/><circle cx="30" cy="64" r="1.4"/></g>`;

  // Ojos, nariz y boca
  s += eyeSVG(L);
  if (x.longnose) s += `<path d="M50,56 L78,59 L50,62 Z" fill="${skin}" stroke="${skinD}" stroke-width="0.8"/>`;
  else if (x.bluenose) s += `<circle cx="50" cy="59.5" r="2.6" fill="#3a6fd8"/>`;
  else s += `<path d="M50.8,57.5 L49.2,61 L51.2,61" stroke="${skinD}" stroke-width="1.1" fill="none" stroke-linecap="round"/>`;
  const lip = x.lipstick ? '#6a2a8a' : '#7a2020';
  if (L.mouth === 'grin') s += `<path d="M43,65 Q50,72.5 57,65 Z" fill="${lip}"/><path d="M44,65.3 L56,65.3 L55,66.7 L45,66.7 Z" fill="#fff"/>`;
  else if (L.mouth === 'smile') s += `<path d="M45,65.5 Q50,69 55,65.5" stroke="${lip}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  else if (L.mouth === 'smirk') s += `<path d="M45,66.5 Q51,67.5 56,64" stroke="${lip}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  else s += `<path d="M46,66.5 L54,66.5" stroke="${lip}" stroke-width="1.6" stroke-linecap="round"/>`;

  // Marcas de cara
  if (x.whiskers) s += `<g stroke="#5a3a1a" stroke-width="${aw && id === 'naruto' ? 1.6 : 0.9}">${[57, 60, 63].map(y => `<line x1="33" y1="${y}" x2="39" y2="${y - 0.5}"/><line x1="61" y1="${y - 0.5}" x2="67" y2="${y}"/>`).join('')}</g>`;
  if (x.freckles) s += `<g fill="#a0603a">${[[37, 59], [39, 61], [41, 59], [59, 59], [61, 61], [63, 59]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="0.7"/>`).join('')}</g>`;
  if (x.lines) s += `<path d="M38.5,57 L37.5,62 M61.5,57 L62.5,62" stroke="#8a6060" stroke-width="1"/>`;
  if (x.tears) s += `<path d="M41.5,57.5 L41.5,70 M58.5,57.5 L58.5,70" stroke="#2fae6a" stroke-width="1.6"/>`;
  if (x.cheeks) s += `<path d="M34,57 L40,61 M66,57 L60,61" stroke="#8b3fb8" stroke-width="1.4"/>`;
  if (x.scarX) s += `<path d="M36.5,57 L34.5,63 M60,58 L64,62 M64,58 L60,62" stroke="#a04040" stroke-width="1.1"/>`;
  if (x.scarEye) s += `<path d="M54,59.5 Q58.5,62 63,59.5 M56,59 L56,61.5 M58.5,59.6 L58.5,62.2 M61,59 L61,61.5" stroke="#7a3030" stroke-width="0.8" fill="none"/>`;
  if (x.scarZoro) s += `<path d="M52,49 Q58,47 64,50 Q58,55 52,51 Z" fill="${skin}"/><path d="M52.5,51.5 Q58.5,53.5 64.5,51.5" stroke="#111" stroke-width="1.3" fill="none"/><line x1="58.5" y1="42" x2="58.5" y2="62" stroke="#8a3030" stroke-width="1.3"/>`;
  if (x.scarShanks) s += `<path d="M54,43 L59,59 M57.5,42 L62.5,58 M61,43 L66,56" stroke="#a03030" stroke-width="1.1"/>`;
  if (x.scarV) s += `<path d="M59,38 L56,72" stroke="#a04848" stroke-width="1.2"/>`;
  if (x.eyepatch) s += `<path d="M30,44 L70,40" stroke="#111" stroke-width="1.2"/><ellipse cx="41.5" cy="52" rx="6.4" ry="5.4" fill="#111"/>`;
  if (x.thirdEye) s += `<ellipse cx="50" cy="38" rx="3.4" ry="2.4" fill="#fff"/><circle cx="50" cy="38" r="1.6" fill="#111"/>`;
  if (x.dots) s += `<g fill="#6a4a3a">${[[45, 33], [50, 32], [55, 33], [45, 37], [50, 36], [55, 37]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="0.9"/>`).join('')}</g>`;
  if (x.tattoo) s += `<path d="M36,40 L39,36 L42,40 M58,40 L61,36 L64,40" stroke="#111" stroke-width="1.2" fill="none"/>`;
  if (x.glasses) s += `<g fill="none" stroke="#2a2a3a" stroke-width="1.1"><rect x="35" y="48" width="13" height="8" rx="1.5"/><rect x="52" y="48" width="13" height="8" rx="1.5"/><line x1="48" y1="51" x2="52" y2="51"/></g>`;
  if (x.curlyBrow) s += `<path d="M35.5,46.5 Q40,42.5 46,44.5 Q48.5,46.5 45.5,47.5 Q43.5,46 44.8,44.8" stroke="${hairD}" stroke-width="1.6" fill="none"/>`;
  if (x.goatee) s += `<path d="M47.5,72 L50,78 L52.5,72 Z" fill="${hairD}"/>`;
  if (x.beard) s += `<path d="M31,56 Q31,82 50,84 Q69,82 69,56 Q66,73 58,71 Q50,67 42,71 Q34,73 31,56 Z" fill="#111"/>`;
  if (x.mask) s += `<path d="M30.5,56 Q50,60 69.5,56 Q68,72 50,77.5 Q32,72 30.5,56 Z" fill="#1c2440"/><path d="M50,58 L50,63" stroke="#2c3660" stroke-width="1"/>`;
  if (x.hollowMask) s += `<path d="M30.5,46 Q30.5,28 50,27 L50,77.5 Q45,77 40,72 Q30.5,63 30.5,46 Z" fill="#f4f4f4" opacity=".96"/>
    <path d="M35,33 L39,48 M41,29 L44,44" stroke="#c0152f" stroke-width="2.2"/>
    <path d="M35.5,50.5 Q41,47 47,51 Q41,56 35.5,50.5 Z" fill="#111"/><circle cx="42" cy="51.5" r="1.8" fill="#ffd23a"/>
    <path d="M40,66 L50,66 M42,64 L42,68 M45,64 L45,68 M48,64 L48,68" stroke="#555" stroke-width="0.8"/>`;

  // Pelo delantero con sombra y brillo
  if (HAIR_FRONT[L.style]) {
    s += `<path d="${HAIR_FRONT[L.style]}" transform="translate(0 1.8)" fill="#000" opacity=".22"/>`;
    s += `<path d="${HAIR_FRONT[L.style]}" fill="${hair}" stroke="${hairD}" stroke-width="1" stroke-linejoin="round"/>`;
    s += `<path d="M38,32 Q44,28.5 50,30 M55,29.5 Q60,29 64,32" stroke="#fff" stroke-opacity=".38" stroke-width="1.7" fill="none" stroke-linecap="round"/>`;
  }
  if (L.style === 'slick') s += `<path d="M50,30 Q45,40 47,49" stroke="${hair}" stroke-width="2.2" fill="none"/>`;
  if (L.style === 'kenpachi') s += `<g fill="#f2c230">${[[8, 50], [6, 32], [14, 16], [32, 6], [68, 6], [86, 16], [94, 32], [92, 50]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2"/>`).join('')}</g>`;
  if (x.kenseikan) s += `<g fill="#f2f2f2" stroke="#bbb" stroke-width="0.5"><rect x="36" y="27" width="4" height="8" rx="1"/><rect x="42" y="25" width="4" height="8" rx="1"/><rect x="60" y="27" width="4" height="8" rx="1"/></g>`;
  if (x.hairclip) s += `<g fill="#7ab8ff" stroke="#2a5aa8" stroke-width="0.6">${[34, 66].map(cx => `<polygon points="${cx},31 ${cx + 2.6},32.5 ${cx + 2.6},35.5 ${cx},37 ${cx - 2.6},35.5 ${cx - 2.6},32.5"/>`).join('')}</g>`;
  if (x.horn) s += `<path d="M30,38 Q29,24 40,21 L35,10 L45,21 Q47,28 42,33 Q36,31 30,38 Z" fill="#f2f2f2" stroke="#bbb" stroke-width="0.6"/>`;

  // Tocados
  if (x.dome) s += `<path d="M30.5,43 Q30,23 50,22 Q70,23 69.5,43 Q50,36 30.5,43 Z" fill="${hair}"/><ellipse cx="44" cy="29" rx="6" ry="3" fill="#fff" opacity="0.35"/>`;
  if (x.crest) s += `<path d="M32,41 L27,16 L40,30 L50,12 L60,30 L73,16 L68,41 Q50,34 32,41 Z" fill="${hair}" stroke="#000" stroke-width="0.8"/>`;
  if (x.turban) s += `<path d="M30,42 Q29,17 50,17 Q71,17 70,42 Q50,35 30,42 Z" fill="#f2f2f2" stroke="#ccc" stroke-width="0.8"/><path d="M30,42 Q50,35 70,42 L70,45.5 Q50,38.5 30,45.5 Z" fill="#5b2a86"/>`;
  if (x.antenna) s += `<path d="M44,35 Q40,20 35,15 M56,35 Q60,20 65,15" stroke="${skin}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  if (x.bandana) s += `<path d="M30,35 Q50,29 70,35 L70,41 Q50,35 30,41 Z" fill="${x.bandana === true ? '#c0171f' : x.bandana}"/>`;
  if (x.goggles) s += `<g><path d="M30,37 L70,37" stroke="#5a3a1a" stroke-width="2.5"/><circle cx="42" cy="36" r="5" fill="#9fd9f0" stroke="#333" stroke-width="1.4"/><circle cx="58" cy="36" r="5" fill="#9fd9f0" stroke="#333" stroke-width="1.4"/></g>`;
  if (x.headband) s += `<path d="M30,35 Q50,31 70,35 L70,41 Q50,37 30,41 Z" fill="#1c2440"/><rect x="42" y="32.5" width="16" height="7" rx="1.5" fill="#c0c8d0" stroke="#7a8490" stroke-width="0.6"/><path d="M47,36 Q50,33.5 53,36 Q50,38 48.5,36" stroke="#555" stroke-width="0.8" fill="none"/>`;
  if (x.headbandTilt) s += `<path d="M29,34 L71,31 L71,41 Q67,43 67,60 L52,60 L52,41 L29,41 Z" fill="#1c2440"/><rect x="36" y="32.5" width="15" height="7" rx="1.5" fill="#c0c8d0" stroke="#7a8490" stroke-width="0.6"/>`;
  if (x.strawhat) s += `<ellipse cx="50" cy="33" rx="33" ry="7" fill="#f2d060" stroke="#c8a030" stroke-width="1"/><path d="M34,33 Q34,12 50,12 Q66,12 66,33 Z" fill="#f2d060" stroke="#c8a030" stroke-width="1"/><path d="M34.3,27 L65.7,27 L66,33 L34,33 Z" fill="#d4202a"/><path d="M38,20 Q44,15 50,15" stroke="#fff" stroke-opacity=".4" stroke-width="1.5" fill="none"/>`;
  if (x.cowboy) s += `<ellipse cx="50" cy="31" rx="32" ry="6.5" fill="#e8742a" stroke="#a04a10" stroke-width="1"/><path d="M36,31 Q35,12 50,12 Q65,12 64,31 Z" fill="#e8742a" stroke="#a04a10" stroke-width="1"/><path d="M36,26 L64,26" stroke="#8a2a10" stroke-width="2.5"/><circle cx="44" cy="26" r="2" fill="#ffd23a"/><circle cx="56" cy="26" r="2" fill="#4fb3e8"/>`;
  if (x.furhat) s += `<path d="M29,41 Q27,15 50,15 Q73,15 71,41 Q50,34 29,41 Z" fill="#f4f4f4" stroke="#c8c8c8" stroke-width="0.8"/><path d="M27,41 Q50,32 73,41 L73,46 Q50,37 27,46 Z" fill="#f4f4f4" stroke="#bbb" stroke-width="0.8"/><g fill="#8a6a4a">${[[40, 22], [52, 20], [62, 26], [45, 30]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2"/>`).join('')}</g>`;
  if (x.chopperhat) s += `<path d="M35,27 L22,13 M27,18 L21,22 M65,27 L78,13 M73,18 L79,22" stroke="#8a5a2b" stroke-width="3" stroke-linecap="round"/><path d="M33,38 Q32,12 50,12 Q68,12 67,38 Z" fill="#e85a8a"/><ellipse cx="50" cy="38" rx="24" ry="4" fill="#d04a78"/><path d="M46,20 L54,28 M54,20 L46,28" stroke="#fff" stroke-width="2.2"/>`;

  // Chispas eléctricas (Super Saiyajin 2, etc.)
  if (L.sparks) s += `<g stroke="#e8f6ff" stroke-width="1.3" fill="none" opacity=".9"><path d="M14,30 L20,36 L16,40 L24,46"><animate attributeName="opacity" values="1;0;1" dur=".45s" repeatCount="indefinite"/></path><path d="M86,58 L80,64 L85,68 L77,76"><animate attributeName="opacity" values="0;1;0" dur=".5s" repeatCount="indefinite"/></path></g>`;

  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="portrait">${s}</svg>`;
}
