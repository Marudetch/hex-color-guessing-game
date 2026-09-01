import React, { useState, useEffect, useCallback } from 'react';
import { GameState, ColorOption, RoundHistory } from './types';
import { generateColorRound } from './utils/colorUtils';
import { playSound } from './utils/sound';
import { Header } from './components/Header';
import { TargetColorDisplay } from './components/TargetColorDisplay';
import { ColorGrid } from './components/ColorGrid';
import { FeedbackBanner } from './components/FeedbackBanner';
import { GameOverSummary } from './components/GameOverSummary';
import { HowToPlayModal } from './components/HowToPlayModal';

const TOTAL_ROUNDS = 10;

export default function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialRound = generateColorRound();
    return {
      currentRound: 1,
      totalRounds: TOTAL_ROUNDS,
      score: 0,
      targetHex: initialRound.targetHex,
      options: initialRound.options,
      selectedOption: null,
      status: 'playing',
      history: [],
      streak: 0,
      bestStreak: 0,
    };
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hex_sound_enabled');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const [isHowToPlayOpen, setIsHowToPlayOpen] = useState(false);

  // Toggle Sound Setting
  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      localStorage.setItem('hex_sound_enabled', String(next));
      return next;
    });
  };

  // User selects an option
  const handleSelectOption = useCallback(
    (option: ColorOption) => {
      setGameState((prev) => {
        if (prev.status !== 'playing') return prev;

        const isCorrect = option.isTarget;
        const scoreIncrement = isCorrect ? 10 : 0;
        const newScore = prev.score + scoreIncrement;
        const newStreak = isCorrect ? prev.streak + 1 : 0;
        const newBestStreak = Math.max(prev.bestStreak, newStreak);

        const roundRecord: RoundHistory = {
          round: prev.currentRound,
          targetHex: prev.targetHex,
          selectedHex: option.hex,
          isCorrect,
          scoreEarned: scoreIncrement,
        };

        if (isCorrect) {
          playSound('correct', soundEnabled);
        } else {
          playSound('wrong', soundEnabled);
        }

        return {
          ...prev,
          score: newScore,
          selectedOption: option,
          status: 'round-result',
          history: [...prev.history, roundRecord],
          streak: newStreak,
          bestStreak: newBestStreak,
        };
      });
    },
    [soundEnabled]
  );

  // Advance to Next Round or End Game
  const handleNextRound = useCallback(() => {
    setGameState((prev) => {
      if (prev.status !== 'round-result') return prev;

      if (prev.currentRound >= prev.totalRounds) {
        playSound('complete', soundEnabled);
        return {
          ...prev,
          status: 'game-over',
        };
      }

      const nextRoundData = generateColorRound();
      playSound('click', soundEnabled);
      return {
        ...prev,
        currentRound: prev.currentRound + 1,
        targetHex: nextRoundData.targetHex,
        options: nextRoundData.options,
        selectedOption: null,
        status: 'playing',
      };
    });
  }, [soundEnabled]);

  // Restart / Play Again
  const handlePlayAgain = () => {
    const firstRound = generateColorRound();
    playSound('click', soundEnabled);
    setGameState({
      currentRound: 1,
      totalRounds: TOTAL_ROUNDS,
      score: 0,
      targetHex: firstRound.targetHex,
      options: firstRound.options,
      selectedOption: null,
      status: 'playing',
      history: [],
      streak: 0,
      bestStreak: gameState.bestStreak,
    });
  };

  // Keyboard Shortcuts (1-6 to pick color, Space/Enter to advance)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when inside modals or inputs
      if (isHowToPlayOpen) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;

      // Extract number 1-6 from key ('1'-'6') or code ('Digit1'-'Digit6', 'Numpad1'-'Numpad6')
      let pressedNumber: number | null = null;

      if (/^[1-6]$/.test(e.key)) {
        pressedNumber = parseInt(e.key, 10);
      } else if (e.code && /^Digit[1-6]$/.test(e.code)) {
        pressedNumber = parseInt(e.code.replace('Digit', ''), 10);
      } else if (e.code && /^Numpad[1-6]$/.test(e.code)) {
        pressedNumber = parseInt(e.code.replace('Numpad', ''), 10);
      }

      if (gameState.status === 'playing' && pressedNumber !== null) {
        const optionIndex = pressedNumber - 1;
        if (gameState.options[optionIndex]) {
          e.preventDefault();
          handleSelectOption(gameState.options[optionIndex]);
        }
      } else if (gameState.status === 'round-result') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleNextRound();
        }
      } else if (gameState.status === 'game-over') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePlayAgain();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isHowToPlayOpen, handleSelectOption, handleNextRound]);

  const isSelectedCorrect = gameState.selectedOption ? gameState.selectedOption.isTarget : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between py-6 px-4 sm:px-6 relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 transition-all duration-700"
          style={{
            backgroundColor:
              gameState.status === 'round-result'
                ? isSelectedCorrect
                  ? '#10b981'
                  : '#f43f5e'
                : gameState.targetHex,
          }}
        />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-xl mx-auto flex-1 flex flex-col justify-center">
        {gameState.status !== 'game-over' ? (
          <div className="flex flex-col">
            {/* Header with Round, Score, Controls */}
            <Header
              currentRound={gameState.currentRound}
              totalRounds={gameState.totalRounds}
              score={gameState.score}
              streak={gameState.streak}
              soundEnabled={soundEnabled}
              onToggleSound={handleToggleSound}
              onOpenHowToPlay={() => setIsHowToPlayOpen(true)}
            />

            {/* Target HEX Color Box */}
            <TargetColorDisplay
              targetHex={gameState.targetHex}
              gameStatus={gameState.status}
              isCorrect={isSelectedCorrect}
            />

            {/* 6 Color Options Grid */}
            <ColorGrid
              options={gameState.options}
              selectedOption={gameState.selectedOption}
              gameStatus={gameState.status}
              onSelectOption={handleSelectOption}
            />

            {/* Feedback Banner (Correct / Wrong + Auto Advance) */}
            <FeedbackBanner
              gameStatus={gameState.status}
              isCorrect={isSelectedCorrect}
              isLastRound={gameState.currentRound === gameState.totalRounds}
              onNextRound={handleNextRound}
              autoAdvanceSeconds={1.5}
            />
          </div>
        ) : (
          /* Game Over Summary View */
          <GameOverSummary
            score={gameState.score}
            totalRounds={gameState.totalRounds}
            history={gameState.history}
            bestStreak={gameState.bestStreak}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </main>

      {/* Footer info & shortcut guide */}
      <footer className="relative z-10 w-full max-w-xl mx-auto mt-6 text-center text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-zinc-900 pt-4">
        <span>HEX Color Guessing Game</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHowToPlayOpen(true)}
            className="hover:text-zinc-300 transition-colors underline underline-offset-2"
          >
            กติกาการเล่น
          </button>
          <span>•</span>
          <span className="hidden sm:inline">คีย์ลัด: กดปุ่มเลข 1-6 บนคีย์บอร์ด</span>
        </div>
      </footer>

      {/* How to Play Modal */}
      <HowToPlayModal
        isOpen={isHowToPlayOpen}
        onClose={() => setIsHowToPlayOpen(false)}
      />
    </div>
  );
}
