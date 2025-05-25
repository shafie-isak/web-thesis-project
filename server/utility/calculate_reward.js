export function calculateReward({ correct, total, type = 'quiz', difficulty = 'easy' }) {
  let baseXp = 5;      // XP per correct answer
  let baseCoins = 1;   // Coin per correct answer

  // Bonus multiplier by mode
  const typeBonus = {
    quiz: 1,
    challenge: 1.2,
    mock: 1.5,
    battle: 2, // future: challenge with friend
  };

  // Difficulty modifier (optional)
  const diffBonus = {
    easy: 1,
    medium: 1.3,
    hard: 1.5,
  };

  const accuracy = correct / total;
  const multiplier = (typeBonus[type] || 1) * (diffBonus[difficulty] || 1);

  const xp = Math.round(correct * baseXp * multiplier);
  const coins = Math.round(correct * baseCoins * multiplier);

  return {
    xp,
    coins,
    accuracy: Math.round(accuracy * 100), // for badge logic
  };
}
