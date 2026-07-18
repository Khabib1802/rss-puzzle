function shuffleArray<T>(array: T[]): T[] {
  const midpoint = 0.5;
  return [...array].sort(() => Math.random() - midpoint);
}

function splitIntoWords(sentence: string): string[] {
  return sentence.trim().split(/\s+/).filter(Boolean);
}

function isSentenceCorrect(userSentence: string, correctSentence: string): boolean {
  const cleanUser = userSentence.trim();
  const cleanCorrect = correctSentence.trim();

  return cleanUser === cleanCorrect;
}

function checkUserWordOrder(userOrder: string[], correctOrder: string[]): boolean[] {
  return userOrder.map((word, index) => word === correctOrder[index]);
}

export { shuffleArray, splitIntoWords, isSentenceCorrect, checkUserWordOrder };
