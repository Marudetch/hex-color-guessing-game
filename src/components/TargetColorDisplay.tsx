import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check, Info, Sparkles } from 'lucide-react';
import { hexToRgb } from '../utils/colorUtils';
import { GameStatus } from '../types';

interface TargetColorDisplayProps {
  targetHex: string;
  gameStatus: GameStatus;
  isCorrect: boolean | null;
}

export const TargetColorDisplay: React.FC<TargetColorDisplayProps> = ({
  targetHex,
  gameStatus,
  isCorrect,
}) => {
  const [copied, setCopied] = useState(false);
  const [showRgbTooltip, setShowRgbTooltip] = useState(false);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const rgb = hexToRgb(targetHex);
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

  // Handle clicking RGB Hint to show tooltip for 3 seconds then fade out
  const handleTriggerRgbHint = () => {
    if (tooltipTimeoutRef.current) {
      clearTimeout(tooltipTimeoutRef.current);
    }
    setShowRgbTooltip(true);

    tooltipTimeoutRef.current = setTimeout(() => {
      setShowRgbTooltip(false);
    }, 3000);
  };

  // Clear timeout on unmount or when targetHex changes
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, [targetHex]);

  const handleCopy = () => {
    navigator.clipboard.writeText(targetHex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isRoundResolved = gameStatus === 'round-result';

  return (
    <div className="w-full mb-6">
      {/* Target Color Card */}
      <div
        id="target-color-card"
        className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
          isRoundResolved
            ? isCorrect
              ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10'
              : 'border-rose-500/50 shadow-lg shadow-rose-500/10'
            : 'border-zinc-800 bg-zinc-900/90 shadow-xl shadow-black/40'
        }`}
      >
        {/* If round is resolved, show actual target color background with smooth opacity */}
        {isRoundResolved && (
          <div
            className="absolute inset-0 transition-opacity duration-500 ease-out opacity-25"
            style={{ backgroundColor: targetHex }}
          />
        )}

        <div className="relative z-10 p-5 sm:p-7 flex flex-col items-center justify-center text-center">
          {/* Label & Actions */}
          <div className="flex items-center justify-between w-full max-w-sm mb-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {isRoundResolved ? 'Target Color Answer' : 'Target HEX Code'}
            </span>
            <div className="flex items-center gap-2 relative">
              {/* RGB Hint Button with relative tooltip container */}
              <div className="relative">
                <button
                  id="btn-rgb-hint"
                  onClick={handleTriggerRgbHint}
                  className={`text-xs flex items-center gap-1.5 transition-all px-2.5 py-1 rounded-lg border font-medium active:scale-95 ${
                    showRgbTooltip
                      ? 'bg-indigo-600/30 border-indigo-500/60 text-indigo-300 shadow-sm shadow-indigo-500/20'
                      : 'bg-zinc-800/80 border-zinc-700/80 text-zinc-300 hover:text-white hover:bg-zinc-700'
                  }`}
                  title="คลิกเพื่อดูค่าสี RGB (แสดง 3 วินาที)"
                >
                  <Info className="w-3.5 h-3.5 text-indigo-400" />
                  <span>RGB Hint</span>
                </button>

                {/* Floating RGB Pop-up Tooltip (3s timer) */}
                {showRgbTooltip && (
                  <div
                    id="rgb-hint-popup"
                    className="absolute top-full right-0 mt-2 z-30 animate-in fade-in zoom-in-95 duration-200"
                  >
                    <div className="flex flex-col items-center">
                      {/* Arrow caret */}
                      <div className="w-2.5 h-2.5 bg-zinc-800 border-t border-l border-zinc-700 rotate-45 -mb-1.5 shadow-sm" />
                      
                      <div className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl shadow-black/80 backdrop-blur-md whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: targetHex }}
                          />
                          <span className="text-xs font-mono font-bold text-indigo-300 select-all">
                            {rgbString}
                          </span>
                        </div>
                        <div className="text-[10px] text-zinc-400 font-sans mt-0.5 text-center">
                          (R: {rgb.r}, G: {rgb.g}, B: {rgb.b})
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Copy HEX Button */}
              <button
                id="btn-copy-hex"
                onClick={handleCopy}
                className="text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/80 hover:bg-zinc-700 active:scale-95"
                title="Copy HEX Code"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Large Target HEX Display Box */}
          <div
            id="target-hex-box"
            className="w-full max-w-md py-4 px-6 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-center mb-3 transition-transform duration-200 hover:scale-[1.01]"
          >
            <div className="flex items-center gap-2 font-mono text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white select-all">
              <span className="text-indigo-400">#</span>
              <span className="text-zinc-100">{targetHex.replace('#', '')}</span>
            </div>
          </div>

          {/* If round is resolved, show revealed color preview pill */}
          {isRoundResolved && (
            <div className="flex items-center gap-2 mt-1 px-3.5 py-1.5 rounded-xl border border-zinc-700/80 bg-zinc-900/90 shadow-inner">
              <div
                className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                style={{ backgroundColor: targetHex }}
              />
              <span className="text-xs font-semibold text-zinc-300 font-mono">
                เฉลย: {targetHex} ({rgbString})
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
