import React, { useState } from 'react';
import { audioService } from '../../utils/audio';

interface CountingBeadsProps {
  total?: number;
  itemIcon?: string;
  itemLabel?: string;
  onCounted?: (count: number) => void;
}

export const CountingBeads: React.FC<CountingBeadsProps> = ({
  total = 7,
  itemIcon = '🍎',
  itemLabel = 'Apples',
  onCounted
}) => {
  const [countedIndices, setCountedIndices] = useState<number[]>([]);

  const handleTap = (idx: number) => {
    let next: number[];
    if (countedIndices.includes(idx)) {
      next = countedIndices.filter((i) => i !== idx);
    } else {
      next = [...countedIndices, idx];
      audioService.playChime('click');
    }
    setCountedIndices(next);
    if (onCounted) {
      onCounted(next.length);
    }
  };

  const reset = () => {
    setCountedIndices([]);
    if (onCounted) onCounted(0);
  };

  return (
    <div className="bg-rose-50/70 border border-rose-200/80 rounded-2xl p-5 shadow-sm text-center">
      <div className="flex items-center justify-between mb-3 border-b border-rose-200/50 pb-2">
        <span className="font-semibold text-slate-800 text-sm md:text-base">
          Tactile 1-to-1 Counting Garden
        </span>
        <button
          onClick={reset}
          className="text-xs text-rose-700 hover:text-rose-900 font-medium px-2 py-1 rounded bg-rose-100/80 transition"
        >
          Reset Count
        </button>
      </div>

      <p className="text-xs text-slate-600 mb-4">
        Tap each {itemLabel.toLowerCase()} with your finger to count along!
      </p>

      <div className="flex flex-wrap justify-center items-center gap-3.5 my-3 py-2 min-h-[90px]">
        {Array.from({ length: total }).map((_, idx) => {
          const isCounted = countedIndices.includes(idx);
          const orderNumber = countedIndices.indexOf(idx) + 1;
          return (
            <button
              key={`item-${idx}`}
              onClick={() => handleTap(idx)}
              className={`relative p-3 rounded-2xl transition-all transform active:scale-90 select-none ${
                isCounted
                  ? 'bg-rose-100 ring-2 ring-rose-500 scale-105 shadow-sm'
                  : 'bg-white border border-slate-200 hover:border-rose-300 shadow-2xs hover:scale-102'
              }`}
              title={`Tap to count item ${idx + 1}`}
            >
              <span className="text-3xl block leading-none">{itemIcon}</span>
              {isCounted && (
                <span className="absolute -top-2 -right-2 w-5.5 h-5.5 rounded-full bg-rose-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {orderNumber}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-2 border-t border-rose-200/40 flex items-center justify-center gap-2">
        <span className="text-xs text-slate-500">Currently counted:</span>
        <span className="text-lg font-bold text-rose-800 tabular-nums">
          {countedIndices.length} / {total} {itemLabel}
        </span>
      </div>
    </div>
  );
};
