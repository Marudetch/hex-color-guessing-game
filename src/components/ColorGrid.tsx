import React from 'react';
import { Check, X } from 'lucide-react';
import { ColorOption, GameStatus } from '../types';
import { getContrastTextColor } from '../utils/colorUtils';

interface ColorGridProps {
  options: ColorOption[];
  selectedOption: ColorOption | null;
  gameStatus: GameStatus;
  onSelectOption: (option: ColorOption) => void;
}

export const ColorGrid: React.FC<ColorGridProps> = ({
  options,
  selectedOption,
  gameStatus,
  onSelectOption,
}) => {
  const isResolved = gameStatus === 'round-result';

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          เลือกสีที่ตรงกับรหัส HEX ด้านบน (Select 1 of 6 Colors)
        </span>
        <span className="text-[11px] text-zinc-500 font-medium">6 ตัวเลือก</span>
      </div>

      <div
        id="color-options-grid"
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full"
      >
        {options.map((option, index) => {
          const isSelected = selectedOption?.id === option.id;
          const isTarget = option.isTarget;
          const contrastText = getContrastTextColor(option.hex);

          // State styling
          let borderClasses = 'border-zinc-800/80 hover:border-zinc-500 hover:shadow-lg hover:shadow-black/40';
          let ringClasses = '';
          let opacityClass = 'opacity-100';

          if (isResolved) {
            if (isTarget) {
              borderClasses = 'border-emerald-400 ring-2 ring-emerald-500/80 shadow-lg shadow-emerald-500/20';
            } else if (isSelected && !isTarget) {
              borderClasses = 'border-rose-500 ring-2 ring-rose-500/80 shadow-lg shadow-rose-500/20';
            } else {
              opacityClass = 'opacity-35 scale-[0.98]';
            }
          }

          return (
            <button
              key={option.id}
              id={`color-option-${index + 1}`}
              onClick={() => {
                if (!isResolved) {
                  onSelectOption(option);
                }
              }}
              disabled={isResolved}
              aria-label={`Color option ${index + 1}: ${option.hex}`}
              className={`group relative h-24 sm:h-28 md:h-32 w-full rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden flex flex-col items-center justify-center p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 active:scale-[0.97] ${borderClasses} ${ringClasses} ${opacityClass}`}
              style={{ backgroundColor: option.hex }}
            >
              {/* Color Shine overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10 pointer-events-none" />

              {/* In-game feedback overlay icons */}
              {isResolved && isSelected && (
                <div className="relative z-10 flex flex-col items-center justify-center animate-in zoom-in-75 duration-200">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md ${
                      isTarget ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}
                  >
                    {isTarget ? <Check className="w-5 h-5 stroke-[3]" /> : <X className="w-5 h-5 stroke-[3]" />}
                  </div>
                  <span
                    className={`mt-1 text-xs font-bold px-2 py-0.5 rounded-md backdrop-blur-md ${
                      isTarget
                        ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                        : 'bg-rose-950/80 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {isTarget ? 'ถูกต้อง!' : 'ไม่ใช่สีนี้'}
                  </span>
                </div>
              )}

              {/* Show target highlight if user picked wrong but this was the actual answer */}
              {isResolved && !isSelected && isTarget && (
                <div className="relative z-10 flex flex-col items-center justify-center animate-in zoom-in-75 duration-200">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-md">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span className="mt-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/90 text-emerald-300 border border-emerald-500/30">
                    คำตอบที่ถูก
                  </span>
                </div>
              )}

              {/* On hover or reveal, show HEX string badge subtly */}
              {isResolved && (
                <div className="absolute bottom-1.5 right-2 z-10">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/50 text-white/90 backdrop-blur-sm`}>
                    {option.hex}
                  </span>
                </div>
              )}

              {/* Number keyboard shortcut indicator */}
              {!isResolved && (
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="flex items-center justify-center min-w-[22px] h-[22px] px-1 text-[11px] font-mono font-bold rounded-lg bg-black/60 text-white/95 border border-white/20 backdrop-blur-md shadow-sm group-hover:bg-black/80 group-hover:border-white/40 transition-all">
                    {index + 1}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
