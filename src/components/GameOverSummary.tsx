import React, { useState } from 'react';
import { RotateCcw, Trophy, Award, CheckCircle2, XCircle, Share2, Check } from 'lucide-react';
import { RoundHistory } from '../types';

interface GameOverSummaryProps {
  score: number;
  totalRounds: number;
  history: RoundHistory[];
  bestStreak: number;
  onPlayAgain: () => void;
}

export const GameOverSummary: React.FC<GameOverSummaryProps> = ({
  score,
  totalRounds,
  history,
  bestStreak,
  onPlayAgain,
}) => {
  const [copied, setCopied] = useState(false);

  const maxPossibleScore = totalRounds * 10;
  const correctCount = history.filter((h) => h.isCorrect).length;
  const accuracy = Math.round((correctCount / totalRounds) * 100);

  // Performance Tier Evaluation
  const getTier = (scoreVal: number) => {
    if (scoreVal === 100) return { title: 'HEX Master 👑', desc: 'ยอดเยี่ยมระดับสูงสุด! คุณคือเซียนโค้ดสีตัวจริง', color: 'from-amber-400 to-yellow-500', badge: 'Perfect Score' };
    if (scoreVal >= 80) return { title: 'Color Expert 🌟', desc: 'สายตาเฉียบคมมาก สามารถแยกแยะแม่สีได้แม่นยำ', color: 'from-emerald-400 to-teal-500', badge: 'Expert' };
    if (scoreVal >= 60) return { title: 'Palette Pro 🎨', desc: 'ทำได้ดีมาก! มีความเข้าใจรหัส RGB และเฉดสีที่ดี', color: 'from-indigo-400 to-violet-500', badge: 'Proficient' };
    if (scoreVal >= 40) return { title: 'Hue Explorer ✨', desc: 'เริ่มต้นได้ดี ลองสังเกตความเข้มของ Red, Green, Blue เพิ่มเติม', color: 'from-blue-400 to-cyan-500', badge: 'Intermediate' };
    return { title: 'Color Apprentice 🌱', desc: 'ฝึกฝนอีกนิด เรียนรู้หลักการ RGB แล้วมาลองใหม่อีกครั้ง!', color: 'from-zinc-400 to-zinc-500', badge: 'Novice' };
  };

  const tier = getTier(score);

  const handleShare = () => {
    const shareText = `🎨 ฉันเล่นเกม HEX Color Guessing Game ได้คะแนน ${score}/${maxPossibleScore} (${accuracy}% Accuracy)! มาลองทดสอบสายตากัน 🚀`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      id="game-over-summary"
      className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl backdrop-blur-md animate-in zoom-in-95 duration-300"
    >
      {/* Header icon */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 mb-4 text-white">
          <Trophy className="w-8 h-8 text-amber-300" />
        </div>
        <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">
          Game Completed (จบ 10 รอบ)
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          สรุปผลคะแนนรวม
        </h2>
        <p className="text-sm text-zinc-400 mt-1 max-w-sm">
          {tier.desc}
        </p>
      </div>

      {/* Main Score Card */}
      <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 text-center mb-6 relative overflow-hidden">
        <div className="text-xs font-semibold text-zinc-400 mb-1">คะแนนรวมทั้งหมด (Total Score)</div>
        <div id="final-score" className="text-5xl sm:text-6xl font-black tracking-tight text-white mb-2">
          {score}
          <span className="text-xl font-bold text-zinc-500 ml-1">/{maxPossibleScore}</span>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-bold text-zinc-200">
          <Award className="w-3.5 h-3.5 text-indigo-400" />
          <span>ฉายา: {tier.title}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-zinc-800/80 text-center">
          <div>
            <span className="block text-xs text-zinc-500 font-medium">ตอบถูก</span>
            <span className="text-base sm:text-lg font-bold text-emerald-400">
              {correctCount} <span className="text-xs text-zinc-500">/ 10</span>
            </span>
          </div>
          <div>
            <span className="block text-xs text-zinc-500 font-medium">ความแม่นยำ</span>
            <span className="text-base sm:text-lg font-bold text-indigo-400">
              {accuracy}%
            </span>
          </div>
          <div>
            <span className="block text-xs text-zinc-500 font-medium">Best Streak</span>
            <span className="text-base sm:text-lg font-bold text-amber-400">
              {bestStreak} ติดต่อกัน
            </span>
          </div>
        </div>
      </div>

      {/* Round-by-Round Breakdown */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            ประวัติการทาย 10 รอบ
          </span>
          <span className="text-xs text-zinc-500 font-medium">{correctCount} สำเร็จ</span>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {history.map((round) => (
            <div
              key={round.round}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                round.isCorrect
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
              }`}
              title={`Round ${round.round}: Target ${round.targetHex} (${round.isCorrect ? 'Correct +10' : 'Wrong +0'})`}
            >
              <div className="flex items-center justify-between w-full text-[10px] font-bold opacity-80 mb-1">
                <span>R{round.round}</span>
                {round.isCorrect ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <XCircle className="w-3 h-3 text-rose-400" />
                )}
              </div>
              <div
                className="w-full h-5 rounded-md border border-white/20 shadow-inner"
                style={{ backgroundColor: round.targetHex }}
              />
              <span className="text-[9px] font-mono mt-1 text-zinc-300 truncate w-full text-center">
                {round.targetHex}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons: Play Again & Share */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          id="btn-play-again"
          onClick={onPlayAgain}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-indigo-900/30 transition-all cursor-pointer"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Play Again (เล่นใหม่อีกครั้ง)</span>
        </button>

        <button
          id="btn-share-score"
          onClick={handleShare}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] text-zinc-200 hover:text-white font-medium text-sm flex items-center justify-center gap-2 border border-zinc-700 transition-colors cursor-pointer"
          title="คัดลอกผลคะแนน"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 font-bold">คัดลอกแล้ว</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>แชร์คะแนน</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
