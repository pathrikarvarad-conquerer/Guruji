import React from 'react';

interface TenFrameProps {
  firstCount?: number;
  secondCount?: number;
  interactive?: boolean;
}

export const TenFrame: React.FC<TenFrameProps> = ({
  firstCount = 8,
  secondCount = 5
}) => {
  const total = firstCount + secondCount;
  // Frame 1 capacity: 10
  const frame1First = Math.min(10, firstCount);
  const frame1Second = Math.min(10 - frame1First, secondCount);

  // Frame 2 (overflow)
  const remainingSecond = Math.max(0, secondCount - frame1Second);

  return (
    <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-teal-200/50 pb-3">
        <span className="font-semibold text-slate-800 text-sm md:text-base">
          Interactive Ten-Frame Builder: <span className="text-teal-700 font-bold">{firstCount} + {secondCount} = {total}</span>
        </span>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span> First Number ({firstCount})
          </span>
          <span className="flex items-center gap-1.5 font-medium text-slate-700">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span> Added Part ({secondCount})
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Frame 1: Target to fill 10 */}
        <div className="bg-white p-3.5 rounded-xl border border-teal-100 shadow-2xs">
          <div className="text-xs font-semibold text-slate-600 mb-2 flex justify-between">
            <span>Primary Ten-Frame (Makes 10)</span>
            <span className="text-teal-700">{frame1First + frame1Second} / 10 spots</span>
          </div>
          <div className="grid grid-cols-5 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            {Array.from({ length: 10 }).map((_, idx) => {
              const isFirst = idx < frame1First;
              const isSecond = idx >= frame1First && idx < frame1First + frame1Second;
              return (
                <div
                  key={`f1-${idx}`}
                  className="aspect-square rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-inner"
                >
                  {isFirst && (
                    <div className="w-4/5 h-4/5 rounded-full bg-blue-500 shadow-xs animate-in zoom-in-50 duration-200"></div>
                  )}
                  {isSecond && (
                    <div className="w-4/5 h-4/5 rounded-full bg-rose-500 shadow-xs ring-2 ring-rose-200 animate-in zoom-in-50 duration-200"></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-[11px] text-teal-800 font-medium text-center mt-2">
            Frame 1 is FULL = 10
          </div>
        </div>

        {/* Frame 2: Leftover after filling 10 */}
        <div className="bg-white p-3.5 rounded-xl border border-teal-100 shadow-2xs">
          <div className="text-xs font-semibold text-slate-600 mb-2 flex justify-between">
            <span>Second Frame (Leftovers)</span>
            <span className="text-slate-500">{remainingSecond} / 10 spots</span>
          </div>
          <div className="grid grid-cols-5 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            {Array.from({ length: 10 }).map((_, idx) => {
              const isFilled = idx < remainingSecond;
              return (
                <div
                  key={`f2-${idx}`}
                  className="aspect-square rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-inner"
                >
                  {isFilled && (
                    <div className="w-4/5 h-4/5 rounded-full bg-rose-500 shadow-xs animate-in zoom-in-50 duration-200"></div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-[11px] text-slate-600 font-medium text-center mt-2">
            {remainingSecond} extra counter{remainingSecond !== 1 ? 's' : ''} = {10} + {remainingSecond} = {10 + remainingSecond}
          </div>
        </div>
      </div>
    </div>
  );
};
