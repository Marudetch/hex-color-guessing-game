import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import { GameStatus } from '../types';

interface FeedbackBannerProps {
  gameStatus: GameStatus;
  isCorrect: boolean | null;
  isLastRound: boolean;
  onNextRound: () => void;
  autoAdvanceSeconds?: number;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  gameStatus,
  isCorrect,
  isLastRound,
  onNextRound,
  autoAdvanceSeconds = 1.5,
}) => {
  const [timeLeft, setTimeLeft] = useState(autoAdvanceSeconds);

  useEffect(() => {
    if (gameStatus !== 'round-result') {
      setTimeLeft(autoAdvanceSeconds);
      return;
    }

    setTimeLeft(autoAdvanceSeconds);
    const durationMs = autoAdvanceSeconds * 1000;
    const intervalMs = 50;
    let elapsedMs = 0;

    const interval = setInterval(() => {
      elapsedMs += intervalMs;
      const remaining = Math.max(0, (durationMs - elapsedMs) / 1000);
      setTimeLeft(remaining);

      if (elapsedMs >= durationMs) {
        clearInterval(interval);
        onNextRound();
      }
    }, intervalMs);

    return () => {
      clearInterval(interval);
    };
  }, [gameStatus, onNextRound, autoAdvanceSeconds]);

  if (gameStatus !== 'round-result' || isCorrect === null) {
    return null;
  }

  const progress = Math.max(0, (timeLeft / autoAdvanceSeconds) * 100);

  return (
    <div
      id="feedback-banner"
      className="w-full mt-5 animate-in slide-in-from-bottom-3 duration-200"
    >
      <div
        className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl ${
          isCorrect
            ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-100 shadow-emerald-950/50'
            : 'bg-rose-950/70 border-rose-500/50 text-rose-100 shadow-rose-950/50'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
              isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            ) : (
              <XCircle className="w-6 h-6 stroke-[2.5]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span id="feedback-message" className="text-lg font-black tracking-tight">
                {isCorrect ? 'Correct!' : 'Wrong!'}
              </span>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  isCorrect
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                }`}
              >
                {isCorrect ? '+10 pts' : '+0 pts'}
              </span>
            </div>
            <p className="text-xs text-zinc-300 font-medium mt-0.5">
              {isCorrect
                ? 'ยอดเยี่ยม! คุณเลือกสีได้ตรงกับรหัส HEX'
                : 'ไม่เป็นไร! ลองวิเคราะห์รหัส Red, Green, Blue ในรอบถัดไป'}
            </p>
          </div>
        </div>

        {/* Action Button & Timer */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            id="btn-next-round"
            onClick={onNextRound}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all active:scale-[0.98] ${
              isCorrect
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40'
                : 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/40'
            }`}
          >
            <span>{isLastRound ? 'ดูผลคะแนนรวม' : 'รอบถัดไป'}</span>
            {isLastRound ? (
              <Trophy className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Auto-advance progress track */}
      <div className="w-full h-1 bg-zinc-800/80 rounded-full mt-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-100 ${
            isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
