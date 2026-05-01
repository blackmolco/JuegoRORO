import { SUMMON_POOL, CHARACTERS } from '../data/characters';

const totalWeight = SUMMON_POOL.standard.reduce((sum, e) => sum + e.weight, 0);

export const performSummon = (count = 1, pityCount = 0) => {
  const results = [];
  let currentPity = pityCount;

  for (let i = 0; i < count; i++) {
    currentPity++;
    let roll = Math.random() * totalWeight;
    let selected = SUMMON_POOL.standard[SUMMON_POOL.standard.length - 1];

    // Pity system: guaranteed 4★+ at 50 pulls, 5★ at 100
    if (currentPity >= 100) {
      const fiveStars = SUMMON_POOL.standard.filter((e) => CHARACTERS[e.id]?.stars === 5);
      selected = fiveStars[Math.floor(Math.random() * fiveStars.length)];
      currentPity = 0;
    } else if (currentPity >= 50) {
      const fourPlusStars = SUMMON_POOL.standard.filter(
        (e) => (CHARACTERS[e.id]?.stars ?? 0) >= 4
      );
      const subTotal = fourPlusStars.reduce((s, e) => s + e.weight, 0);
      roll = Math.random() * subTotal;
      let acc = 0;
      for (const entry of fourPlusStars) {
        acc += entry.weight;
        if (roll <= acc) { selected = entry; break; }
      }
      if (CHARACTERS[selected.id]?.stars >= 4) currentPity = 0;
    } else {
      let acc = 0;
      for (const entry of SUMMON_POOL.standard) {
        acc += entry.weight;
        if (roll <= acc) { selected = entry; break; }
      }
    }

    results.push({ characterId: selected.id, isNew: true });
  }

  return { results, newPity: currentPity };
};

export const SUMMON_COSTS = {
  single: 150,   // crystals
  multi: 1350,   // 10 pulls (10% discount)
};
