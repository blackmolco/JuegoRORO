/* =========================================================
   Retratos SVG generados por código (arte original estilizado).
   Cada personaje define su "look" en data.js.
   ========================================================= */

const HAIR_BACK = {
  long: 'M27,44 Q27,22 50,22 Q73,22 73,44 L78,92 L62,92 L64,52 L36,52 L38,92 L22,92 Z',
  bob: 'M28,42 Q28,24 50,24 Q72,24 72,42 L73,72 L64,70 L66,50 L34,50 L36,70 L27,72 Z',
  sasuke: 'M34,32 L38,8 L46,22 L56,4 L60,22 L74,10 L70,32 Z',
  tied: 'M46,28 L60,4 L74,2 L66,12 L78,12 L64,22 L58,30 Z',
};

const HAIR_FRONT = {
  goku: 'M30,48 L16,42 L27,35 L12,26 L30,27 L24,10 L40,21 L48,4 L56,20 L70,8 L68,25 L88,22 L74,34 L86,44 L70,46 L67,36 L61,42 L57,33 L51,41 L45,33 L39,42 L34,36 Z',
  vegeta: 'M31,46 L28,28 L22,20 L33,22 L32,6 L42,18 L50,-2 L58,18 L68,6 L67,22 L78,20 L72,28 L69,46 L66,34 Q58,38 55,30 L50,38 L45,30 Q42,38 34,34 Z',
  spiky: 'M29,50 L22,40 L28,38 L22,26 L34,28 L32,14 L44,22 L50,8 L56,22 L68,14 L66,28 L78,26 L72,38 L78,40 L71,50 L68,38 L62,44 L58,34 L52,42 L46,33 L40,43 L36,36 L32,44 Z',
  short: 'M30,48 Q28,26 50,25 Q72,26 70,48 L67,38 L60,36 L55,40 L50,35 L45,40 L40,36 L33,38 Z',
  messy: 'M30,48 L26,36 L30,34 L28,24 L38,26 L42,18 L50,23 L58,17 L62,26 L72,24 L70,34 L74,36 L70,48 L66,38 L60,40 L56,34 L50,40 L44,34 L40,40 L34,38 Z',
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

const _portraitCache = {};

function portraitSVG(id) {
  if (_portraitCache[id]) return _portraitCache[id];
  const ch = CHARS[id];
  const L = ch.look;
  const el = ELEMENTS[ch.el];
  const x = parseExtras(L.extras);
  const skin = L.skin, skinD = shade(L.skin, -40), hair = L.hair, hairD = shade(L.hair, -35);
  let s = '';

  // Fondo
  s += `<rect width="100" height="100" fill="${el.dark}"/>`;
  s += `<circle cx="50" cy="42" r="62" fill="${el.color}" opacity="0.45"/><circle cx="50" cy="42" r="36" fill="${el.color}" opacity="0.45"/>`;
  // rayos decorativos
  s += `<g opacity="0.18" fill="#fff">${[0, 45, 90, 135].map(a =>
    `<polygon points="50,50 46,-20 54,-20" transform="rotate(${a} 50 50)"/><polygon points="50,50 46,-20 54,-20" transform="rotate(${a + 180} 50 50)"/>`).join('')}</g>`;

  // Capa
  if (x.cape) s += `<path d="M4,100 Q8,72 30,70 L70,70 Q92,72 96,100 Z" fill="${x.cape === true ? '#1b1b1b' : x.cape}"/>`;
  // Espada a la espalda
  if (x.sword) s += `<g><line x1="66" y1="100" x2="88" y2="62" stroke="#9aa4b0" stroke-width="5" stroke-linecap="round"/>
    <line x1="84" y1="66" x2="94" y2="72" stroke="#c8a030" stroke-width="3"/>
    <line x1="89" y1="61" x2="94" y2="52" stroke="#3a1a10" stroke-width="4" stroke-linecap="round"/></g>`;
  // Pelo trasero
  if (HAIR_BACK[L.style]) s += `<path d="${HAIR_BACK[L.style]}" fill="${hairD}"/>`;

  // Cuerpo
  s += `<path d="M12,100 Q14,80 34,77 L66,77 Q86,80 88,100 Z" fill="${L.outfit}" stroke="${shade(L.outfit, -50)}" stroke-width="1"/>`;
  s += `<path d="M40,77 L50,92 L60,77 Z" fill="${L.collar}"/>`;
  s += `<rect x="44" y="64" width="12" height="15" fill="${skinD}"/>`;
  if (x.pill) s += `<g transform="translate(66 88) rotate(-30)"><rect x="-6" y="-3" width="12" height="6" rx="3" fill="#fff"/><rect x="0" y="-3" width="6" height="6" rx="3" fill="#1b1b1b"/></g>`;
  if (x.scarf) s += `<path d="M33,74 Q50,82 67,74 L69,81 Q50,90 31,81 Z" fill="#cfe8e0" stroke="#8ab0a4" stroke-width="0.8"/>`;

  // Orejas y cara
  s += `<ellipse cx="31" cy="53" rx="4" ry="6" fill="${skinD}"/><ellipse cx="69" cy="53" rx="4" ry="6" fill="${skinD}"/>`;
  s += `<ellipse cx="50" cy="50" rx="19.5" ry="22.5" fill="${skin}"/>`;
  s += `<ellipse cx="50" cy="66" rx="14" ry="6" fill="${skinD}" opacity="0.18"/>`;
  if (x.earrings) s += `<g fill="#f2c230"><circle cx="30" cy="57" r="1.4"/><circle cx="30" cy="60.5" r="1.4"/><circle cx="30" cy="64" r="1.4"/></g>`;

  // Ojos
  const eye = cx => `<ellipse cx="${cx}" cy="52" rx="4.4" ry="3.4" fill="#fff"/>
    <circle cx="${cx}" cy="52.3" r="2.6" fill="${L.eyes}"/><circle cx="${cx}" cy="52.3" r="1.1" fill="#111"/>
    <circle cx="${cx + 1}" cy="51.2" r="0.8" fill="#fff"/>`;
  s += eye(42) + eye(58);
  // Cejas
  const bc = x.dome || L.style === 'bald' ? skinD : hairD;
  if (L.brow === 'angry') s += `<path d="M36,44 L46,47.5 M64,44 L54,47.5" stroke="${bc}" stroke-width="2.4" stroke-linecap="round"/>`;
  else if (!x.curlyBrow) s += `<path d="M37,46 Q42,43.5 46,46 M54,46 Q58,43.5 63,46" stroke="${bc}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  // Nariz
  if (x.longnose) s += `<path d="M50,54 L78,58 L50,61 Z" fill="${skin}" stroke="${skinD}" stroke-width="0.8"/>`;
  else if (x.bluenose) s += `<circle cx="50" cy="58.5" r="2.6" fill="#3a6fd8"/>`;
  else s += `<path d="M50,55 L48.5,59 L51,59" stroke="${skinD}" stroke-width="1.1" fill="none"/>`;
  // Boca
  const lip = x.lipstick ? '#6a2a8a' : '#7a2020';
  if (L.mouth === 'grin') s += `<path d="M43,63 Q50,70 57,63 Z" fill="${lip}"/><path d="M44,63.3 L56,63.3 L55,64.6 L45,64.6 Z" fill="#fff"/>`;
  else if (L.mouth === 'smile') s += `<path d="M45,63.5 Q50,67 55,63.5" stroke="${lip}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  else if (L.mouth === 'smirk') s += `<path d="M45,64.5 Q51,65.5 56,62" stroke="${lip}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  else s += `<path d="M45.5,64.5 L54.5,64.5" stroke="${lip}" stroke-width="1.6" stroke-linecap="round"/>`;

  // Marcas de cara
  if (x.whiskers) s += `<g stroke="#7a4a2a" stroke-width="0.9">${[56, 59, 62].map(y => `<line x1="33" y1="${y}" x2="39" y2="${y - 0.5}"/><line x1="61" y1="${y - 0.5}" x2="67" y2="${y}"/>`).join('')}</g>`;
  if (x.freckles) s += `<g fill="#a0603a">${[[37, 58], [39, 60], [41, 58], [59, 58], [61, 60], [63, 58]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="0.7"/>`).join('')}</g>`;
  if (x.lines) s += `<path d="M39,56 L38,61 M61,56 L62,61" stroke="#8a6060" stroke-width="1"/>`;
  if (x.tears) s += `<path d="M42,55.5 L42,68 M58,55.5 L58,68" stroke="#2fae6a" stroke-width="1.6"/>`;
  if (x.cheeks) s += `<path d="M34,56 L40,60 M66,56 L60,60" stroke="#8b3fb8" stroke-width="1.4"/>`;
  if (x.scarX) s += `<path d="M37,56 L35,62 M60,56 L64,60 M64,56 L60,60" stroke="#a04040" stroke-width="1.1"/>`;
  if (x.scarEye) s += `<path d="M54,58 Q58,60.5 62,58 M56,57.5 L56,60 M58,58 L58,60.6 M60,57.5 L60,60" stroke="#7a3030" stroke-width="0.8" fill="none"/>`;
  if (x.scarZoro) s += `<ellipse cx="58" cy="52" rx="5" ry="4" fill="${skin}"/><path d="M54,52.5 Q58,54 62,52.5" stroke="#333" stroke-width="1" fill="none"/><line x1="58" y1="42" x2="58" y2="62" stroke="#8a3030" stroke-width="1.3"/>`;
  if (x.scarShanks) s += `<path d="M54,43 L59,59 M57.5,42 L62.5,58 M61,43 L66,56" stroke="#a03030" stroke-width="1.1"/>`;
  if (x.scarV) s += `<path d="M58,38 L55,70" stroke="#a04848" stroke-width="1.2"/>`;
  if (x.eyepatch) s += `<path d="M30,44 L70,40" stroke="#111" stroke-width="1.2"/><ellipse cx="42" cy="52" rx="6" ry="5" fill="#111"/>`;
  if (x.thirdEye) s += `<ellipse cx="50" cy="38" rx="3.4" ry="2.4" fill="#fff"/><circle cx="50" cy="38" r="1.6" fill="#111"/>`;
  if (x.dots) s += `<g fill="#6a4a3a">${[[45, 33], [50, 32], [55, 33], [45, 37], [50, 36], [55, 37]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="0.9"/>`).join('')}</g>`;
  if (x.tattoo) s += `<path d="M36,40 L39,36 L42,40 M58,40 L61,36 L64,40" stroke="#111" stroke-width="1.2" fill="none"/>`;
  if (x.glasses) s += `<g fill="none" stroke="#2a2a3a" stroke-width="1.1"><rect x="36" y="48.5" width="12" height="7" rx="1.5"/><rect x="52" y="48.5" width="12" height="7" rx="1.5"/><line x1="48" y1="51" x2="52" y2="51"/></g>`;
  if (x.curlyBrow) s += `<path d="M36,46.5 Q40,42.5 46,44.5 Q48.5,46.5 45.5,47.5 Q43.5,46 44.8,44.8" stroke="${hairD}" stroke-width="1.6" fill="none"/>`;
  if (x.goatee) s += `<path d="M47.5,70 L50,76 L52.5,70 Z" fill="${hairD}"/>`;
  if (x.beard) s += `<path d="M31,56 Q31,80 50,82 Q69,80 69,56 Q66,72 58,70 Q50,66 42,70 Q34,72 31,56 Z" fill="#111"/>`;
  if (x.mask) s += `<path d="M30.5,55 Q50,59 69.5,55 Q69,71 50,73 Q31,71 30.5,55 Z" fill="#1c2440"/><path d="M50,57 L50,62" stroke="#2c3660" stroke-width="1"/>`;

  // Pelo delantero
  if (HAIR_FRONT[L.style]) s += `<path d="${HAIR_FRONT[L.style]}" fill="${hair}" stroke="${hairD}" stroke-width="1" stroke-linejoin="round"/>`;
  if (L.style === 'slick') s += `<path d="M50,30 Q45,40 47,49" stroke="${hair}" stroke-width="2.2" fill="none"/>`;
  if (L.style === 'kenpachi') s += `<g fill="#f2c230">${[[8, 50], [6, 32], [14, 16], [32, 6], [68, 6], [86, 16], [94, 32], [92, 50]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2"/>`).join('')}</g>`;
  if (x.kenseikan) s += `<g fill="#f2f2f2" stroke="#bbb" stroke-width="0.5"><rect x="36" y="27" width="4" height="8" rx="1"/><rect x="42" y="25" width="4" height="8" rx="1"/><rect x="60" y="27" width="4" height="8" rx="1"/></g>`;
  if (x.hairclip) s += `<g fill="#7ab8ff" stroke="#2a5aa8" stroke-width="0.6">${[34, 66].map(cx => `<polygon points="${cx},31 ${cx + 2.6},32.5 ${cx + 2.6},35.5 ${cx},37 ${cx - 2.6},35.5 ${cx - 2.6},32.5"/>`).join('')}</g>`;
  if (x.horn) s += `<path d="M30,38 Q29,24 40,21 L35,10 L45,21 Q47,28 42,33 Q36,31 30,38 Z" fill="#f2f2f2" stroke="#bbb" stroke-width="0.6"/>`;

  // Tocados
  if (x.dome) s += `<path d="M30.5,42 Q30,23 50,22 Q70,23 69.5,42 Q50,35 30.5,42 Z" fill="${hair}"/><ellipse cx="44" cy="29" rx="6" ry="3" fill="#fff" opacity="0.35"/>`;
  if (x.crest) s += `<path d="M32,40 L27,16 L40,30 L50,12 L60,30 L73,16 L68,40 Q50,33 32,40 Z" fill="${hair}" stroke="#000" stroke-width="0.8"/>`;
  if (x.turban) s += `<path d="M30,41 Q29,17 50,17 Q71,17 70,41 Q50,34 30,41 Z" fill="#f2f2f2" stroke="#ccc" stroke-width="0.8"/><path d="M30,41 Q50,34 70,41 L70,44.5 Q50,37.5 30,44.5 Z" fill="#5b2a86"/>`;
  if (x.antenna) s += `<path d="M44,34 Q40,20 35,15 M56,34 Q60,20 65,15" stroke="${skin}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  if (x.bandana) s += `<path d="M30,34 Q50,28 70,34 L70,40 Q50,34 30,40 Z" fill="${x.bandana === true ? '#c0171f' : x.bandana}"/>`;
  if (x.goggles) s += `<g><path d="M30,36 L70,36" stroke="#5a3a1a" stroke-width="2.5"/><circle cx="42" cy="35" r="5" fill="#9fd9f0" stroke="#333" stroke-width="1.4"/><circle cx="58" cy="35" r="5" fill="#9fd9f0" stroke="#333" stroke-width="1.4"/></g>`;
  if (x.headband) s += `<path d="M30,34 Q50,30 70,34 L70,40 Q50,36 30,40 Z" fill="#1c2440"/><rect x="42" y="31.5" width="16" height="7" rx="1.5" fill="#c0c8d0" stroke="#7a8490" stroke-width="0.6"/><path d="M47,35 Q50,32.5 53,35 Q50,37 48.5,35" stroke="#555" stroke-width="0.8" fill="none"/>`;
  if (x.headbandTilt) s += `<path d="M29,33 L71,30 L71,40 Q67,42 67,59 L52,59 L52,40 L29,40 Z" fill="#1c2440"/><rect x="36" y="31.5" width="15" height="7" rx="1.5" fill="#c0c8d0" stroke="#7a8490" stroke-width="0.6"/>`;
  if (x.strawhat) s += `<ellipse cx="50" cy="33" rx="33" ry="7" fill="#f2d060" stroke="#c8a030" stroke-width="1"/><path d="M34,33 Q34,12 50,12 Q66,12 66,33 Z" fill="#f2d060" stroke="#c8a030" stroke-width="1"/><path d="M34.3,27 L65.7,27 L66,33 L34,33 Z" fill="#d4202a"/>`;
  if (x.cowboy) s += `<ellipse cx="50" cy="31" rx="32" ry="6.5" fill="#e8742a" stroke="#a04a10" stroke-width="1"/><path d="M36,31 Q35,12 50,12 Q65,12 64,31 Z" fill="#e8742a" stroke="#a04a10" stroke-width="1"/><path d="M36,26 L64,26" stroke="#8a2a10" stroke-width="2.5"/><circle cx="44" cy="26" r="2" fill="#ffd23a"/><circle cx="56" cy="26" r="2" fill="#4fb3e8"/>`;
  if (x.furhat) s += `<path d="M29,40 Q27,15 50,15 Q73,15 71,40 Q50,33 29,40 Z" fill="#f4f4f4" stroke="#c8c8c8" stroke-width="0.8"/><path d="M27,40 Q50,31 73,40 L73,45 Q50,36 27,45 Z" fill="#f4f4f4" stroke="#bbb" stroke-width="0.8"/><g fill="#8a6a4a">${[[40, 22], [52, 20], [62, 26], [45, 30]].map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2"/>`).join('')}</g>`;
  if (x.chopperhat) s += `<path d="M35,27 L22,13 M27,18 L21,22 M65,27 L78,13 M73,18 L79,22" stroke="#8a5a2b" stroke-width="3" stroke-linecap="round"/><path d="M33,37 Q32,12 50,12 Q68,12 67,37 Z" fill="#e85a8a"/><ellipse cx="50" cy="37" rx="24" ry="4" fill="#d04a78"/><path d="M46,20 L54,28 M54,20 L46,28" stroke="#fff" stroke-width="2.2"/>`;

  _portraitCache[id] = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="portrait">${s}</svg>`;
  return _portraitCache[id];
}
