function shuffleArray<T>(array: T[]): T[] {
  const midpoint = 0.5;
  return [...array].sort(() => Math.random() - midpoint);
}

export default shuffleArray;
