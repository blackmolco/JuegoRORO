# 🏴‍☠️ Grand Line Legends

Juego de rol por turnos estilo Summoners War con personajes de One Piece para móvil (iOS/Android).

## Características

- **30+ personajes** de One Piece (Luffy G5, Zoro, Ace, Law, Hancock, Whitebeard, Roger, Kaido...)
- **5 elementos**: Fuego 🔥, Agua 💧, Viento 🌪️, Luz ✨, Oscuridad 🌑
- **Sistema de combate por turnos** con cooldowns, efectos de estado y ventajas elementales
- **Sistema Gacha** con pity garantizado (4★ cada 50, 5★ cada 100)
- **Modo Aventura**: 3 islas × 5 etapas (Mar del Este, Grand Line, Nuevo Mundo)
- **Arena PvP**: 6 rangos de oponentes (Bronce → Leyenda)
- **Colección de personajes** con subida de nivel
- **Persistencia**: partida guardada con AsyncStorage

## Personajes destacados

| Estrellas | Personajes |
|-----------|-----------|
| ⭐⭐⭐⭐⭐ | Luffy Gear 5, Gol D. Roger, Whitebeard, Shanks, Kaido |
| ⭐⭐⭐⭐ | Zoro, Sanji, Ace, Law, Hancock, Doflamingo, Marco, Katakuri |
| ⭐⭐⭐ | Nami, Usopp, Chopper, Robin, Enel, Jinbe, Franky, Brook, Buggy, Smoker |
| ⭐⭐ | Coby, Tashigi, Alvida |
| ⭐ | Marines y piratas comunes |

## Instalación

```bash
npm install
npx expo start
```

Escanea el QR con la app **Expo Go** en tu celular.

## Tecnologías

- **React Native** + **Expo** (~50.0.0)
- **Zustand** — estado global
- **React Navigation 6** — navegación
- **AsyncStorage** — persistencia
- **Expo Linear Gradient** — UI

## Sistema de batalla

- Turnos basados en **SPD** (velocidad)
- Multiplicadores elementales (1.5× ventaja / 0.75× desventaja)
- Efectos de estado: Aturdido, Quemado, Veneno, Lento, Escudo, ATK±, DEF±
- Daño crítico basado en CRIT Rate y CRIT DMG
- Fórmula: `DMG = ATK × Multiplicador_Skill × (1 - DEF/(DEF+1000)) × Elemento × Crítico`
