import React from 'react';
import { X, Lightbulb, CheckCircle2, HelpCircle } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="how-to-play-modal"
        className="relative w-full max-w-lg rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="btn-close-modal"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
          aria-label="Close instructions"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              วิธีเล่นเกม HEX Color Guess
            </h2>
            <p className="text-xs text-zinc-400">กติกาและหลักการอ่านรหัสสี HEX</p>
          </div>
        </div>

        {/* Rules List */}
        <div className="space-y-3 mb-6 text-sm">
          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-zinc-200 block text-xs sm:text-sm">
                1. ดูรหัสสีเป้าหมาย (Target HEX Code)
              </span>
              <p className="text-xs text-zinc-400 mt-0.5">
                ในแต่ละรอบ ระบบจะสุ่มรหัสสี HEX ขึ้นมา เช่น <code className="text-indigo-300 font-mono font-bold bg-zinc-800 px-1.5 py-0.5 rounded">#4A90E2</code>
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-zinc-200 block text-xs sm:text-sm">
                2. เลือก 1 ใน 6 กล่องสีที่คิดว่าตรงกับรหัส
              </span>
              <p className="text-xs text-zinc-400 mt-0.5">
                คลิกเลือกสีที่ถูกต้อง หรือกดปุ่มตัวเลข <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono font-bold text-[11px]">1</kbd> ถึง <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-mono font-bold text-[11px]">6</kbd> บนคีย์บอร์ด
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-zinc-200 block text-xs sm:text-sm">
                3. สะสมคะแนนและเล่นให้ครบ 10 รอบ
              </span>
              <p className="text-xs text-zinc-400 mt-0.5">
                ตอบถูกรับ <span className="text-emerald-400 font-bold">+10 คะแนน</span> หากตอบผิดรับ 0 คะแนน คะแนนเต็ม 100 คะแนน
              </p>
            </div>
          </div>
        </div>

        {/* HEX Color Cheat Sheet */}
        <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 mb-6">
          <div className="flex items-center gap-2 mb-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>เทคนิคการอ่านรหัสสี #RRGGBB</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed mb-3">
            รหัส HEX 6 ตัว แบ่งออกเป็น 3 คู่แม่สีหลัก เลขฐาน 16 (00 = มืดสุด, FF = สว่างสุด):
          </p>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="p-2 rounded-xl bg-red-950/40 border border-red-800/40">
              <span className="text-red-400 font-bold block">#RR</span>
              <span className="text-zinc-300 text-[11px]">สีแดง (Red)</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-800/40">
              <span className="text-emerald-400 font-bold block">#GG</span>
              <span className="text-zinc-300 text-[11px]">สีเขียว (Green)</span>
            </div>
            <div className="p-2 rounded-xl bg-blue-950/40 border border-blue-800/40">
              <span className="text-blue-400 font-bold block">#BB</span>
              <span className="text-zinc-300 text-[11px]">สีน้ำเงิน (Blue)</span>
            </div>
          </div>
        </div>

        {/* Got it button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold text-sm transition-all"
        >
          เข้าใจแล้ว เริ่มเล่นกันเลย!
        </button>
      </div>
    </div>
  );
};
