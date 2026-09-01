export interface ColorOption {
  id: string;
  hex: string;
  isTarget: boolean;
}

export interface RoundHistory {
  round: number;
  targetHex: string;
  selectedHex: string;
  isCorrect: boolean;
  scoreEarned: number;
  timeSpentMs?: number;
}

export type GameStatus = 'playing' | 'round-result' | 'game-over';

export interface GameState {
  currentRound: number;
  totalRounds: number;
  score: number;
  targetHex: string;
  options: ColorOption[];
  selectedOption: ColorOption | null;
  status: GameStatus;
  history: RoundHistory[];
  streak: number;
  bestStreak: number;
}
