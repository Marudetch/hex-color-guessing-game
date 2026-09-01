import React from 'react';
import { Volume2, VolumeX, HelpCircle, Sparkles } from 'lucide-react';

interface HeaderProps {
  currentRound: number;
  totalRounds: number;
  score: number;
  streak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHowToPlay: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRound,
  totalRounds,
  score,
  streak,
  soundEnabled,
  onToggleSound,
  onOpenHowToPlay,
}) => {
  const progressPercent = ((currentRound - 1) / totalRounds) * 100;

  return (
    <header className="w-full max-w-xl mx-auto mb-5">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-black text-sm tracking-wider">
            #
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-100 flex items-center gap-1.5 leading-none">
              HEX Color Guess
            </h1>
            <p className="text-xs text-zinc-400 font-medium mt-0.5">เกมทายรหัสสี HEX</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {streak > 1 && (
            <div
              id="streak-badge"
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold animate-pulse"
              title={`${streak} Streak!`}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{streak} Streak</span>
            </div>
          )}

          <button
            id="btn-toggle-sound"
            onClick={onToggleSound}
            className="p-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
            aria-label={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
          </button>

          <button
            id="btn-how-to-play"
            onClick={onOpenHowToPlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors text-xs font-medium"
            title="วิธีเล่น (How to Play)"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>วิธีเล่น</span>
          </button>
        </div>
      </div>

      {/* Status Bar: Round indicator and Current Score */}
      <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-sm">
        {/* Round status */}
        <div className="flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-zinc-400 font-medium">รอบการเล่น</span>
            <span id="round-indicator" className="font-bold text-zinc-200 tracking-wide">
              Round <span className="text-indigo-400 text-sm">{currentRound}</span>/{totalRounds}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        </div>

        {/* Score indicator */}
        <div className="flex items-center justify-end gap-3 pl-3 border-l border-zinc-800/80">
          <div className="text-right">
            <span className="block text-xs text-zinc-400 font-medium leading-tight">คะแนนสะสม</span>
            <span id="current-score" className="text-lg font-black text-emerald-400 tracking-tight leading-tight">
              {score}{' '}
              <span className="text-xs font-medium text-emerald-500/80">pts</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
