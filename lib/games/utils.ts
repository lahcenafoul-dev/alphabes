export function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** `count` random distinct items from `pool`, excluding `exclude`. */
export function pickDistractors<T>(pool: T[], exclude: T, count: number): T[] {
  return shuffle(pool.filter((item) => item !== exclude)).slice(0, count);
}
