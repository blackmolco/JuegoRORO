# ⚔️ Anime Sky Arena

RPG de colección y combate por turnos inspirado en **Summoners War: Sky Arena**, con héroes de
**Dragon Ball Z, Bleach, Akira, One Piece y Naruto**.

Proyecto de fans, sin fines comerciales. Los retratos son ilustraciones originales generadas en SVG
por código (no se usan imágenes oficiales). Los personajes pertenecen a sus respectivos autores.

## Cómo jugar

No necesita instalación ni servidor: abre `anime-arena/index.html` en el navegador (PC o móvil).
La partida se guarda automáticamente en el navegador (`localStorage`).

Para publicarlo en internet: activa **GitHub Pages** en el repositorio y entra a
`https://<usuario>.github.io/<repo>/anime-arena/`.

## Qué incluye

- **37 héroes** (2★ a 5★), cada uno con elemento, rol, 2–3 habilidades y habilidad de líder.
- **Combate estilo SW**: barra de ataque según velocidad, enfriamientos, críticos, golpes rozados,
  ventaja elemental (🔥 > 🌪️ > 💧 > 🔥, ✨ ⇄ 🌙), efectos (aturdir, lentitud, daño continuo,
  bajar defensa/ataque, sellado, escudos, inmunidad, turnos extra…), modo automático y velocidad x1–x3.
- **Campaña**: 6 regiones × 5 fases, 3 oleadas por fase y un jefe, calificación de 1–3 estrellas.
- **Arena**: rivales generados por IA, puntos y rangos.
- **Invocación**: pergaminos Desconocido, Místico y de Luz y Oscuridad, invocación x10 y tienda.
- **Progresión**: XP por combate, potenciar sacrificando héroes, despertar con duplicados (+15 %
  estadísticas) y mejoras de habilidad, vender, bloquear, bestiario.
- Recompensa diaria.

## Estructura

```
anime-arena/
├── index.html
├── css/style.css
└── js/
    ├── data.js      # elementos, efectos, personajes y habilidades, regiones, pergaminos
    ├── portrait.js  # generador de retratos SVG
    ├── state.js     # guardado, estadísticas, invocación, campaña, arena
    ├── battle.js    # motor de combate e IA
    └── ui.js        # pantallas y modales
```

### Añadir un personaje

Agrega una entrada a `CHAR_LIST` en `js/data.js`:

```js
{ id: 'saitama', name: 'Saitama', series: 'One Punch Man', el: 'luz', stars: 5, role: 'atk', spd: 105,
  look: { hair: '#f6cfa6', style: 'bald', skin: '#f6cfa6', eyes: '#1b1b1b', outfit: '#f2d060', collar: '#d4202a' },
  leader: { stat: 'atk', pct: 30 },
  skills: [
    hit('Puñetazo Normal', 3.8),
    hit('Puñetazos Normales Consecutivos', 1.2, { hits: 5, cd: 3 }),
    hit('Puñetazo Serio', 9.0, { cd: 6, ignoreDef: 1 }),
  ] },
```

Aparece automáticamente en invocaciones, bestiario y arena.

## Ideas para siguientes versiones

- Runas/equipamiento (sets de estadísticas como en SW).
- Evolución de estrellas (2★ → 6★) y más niveles máximos.
- Mazmorras (Gigante, Dragón) para materiales, y energía.
- Sonido, animaciones de habilidades y arte más detallado.
- Arena en línea contra equipos de otros jugadores.
