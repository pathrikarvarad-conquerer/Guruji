import React, { useState } from 'react';
import { Layers, Plus, Minus } from 'lucide-react';

interface TensOnesBlocksProps {
  initialTens?: number;
  initialOnes?: number;
  interactive?: boolean;
  onCountChange?: (tens: number, ones: number, total: number) => void;
  highlightRegroup?: boolean;
}

export const TensOnesBlocks: React.FC<TensOnesBlocksProps> = ({
  initialTens = 3,
  initialOnes = 4,
  interactive = false,
  onCountChange,
  highlightRegroup = false
}) => {
  const [tens, setTens] = useState(initialTens);
  const [ones, setOnes] = useState(initialOnes);

  const total = tens * 10 + ones;

  const update = (newTens: number, newOnes: number) => {
    setTens(newTens);
    setOnes(newOnes);
    if (onCountChange) {
      onCountChange(newTens, newOnes, newTens * 10 + newOnes);
    }
  };

  return (
    <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-amber-200/50 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-700" />
          <span className="font-semibold text-slate-800 text-sm md:text-base">
            Base-10 Place Value Workshop
          </span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 font-medium mr-2">Total Value:</span>
          <span className="text-xl font-bold text-amber-900 tabular-nums">{total}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tens Zone (दशक) */}
        <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="font-bold text-slate-800 text-sm">
                  Tens Rods (दशक) <span className="text-xs text-amber-700 font-normal">· {tens} Rods = {tens * 10}</span>
                </span>
              </div>
              {interactive && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => update(Math.max(0, tens - 1), ones)}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                    title="Remove ten rod"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => update(Math.min(9, tens + 1), ones)}
                    className="p-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-800 transition"
                    title="Add ten rod"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Visual Rods Representation */}
            <div className="flex flex-wrap gap-2.5 min-h-[110px] items-end p-2 bg-slate-50/60 rounded-lg border border-slate-100">
              {tens === 0 ? (
                <span className="text-xs text-slate-400 italic m-auto">0 Ten-Rods</span>
              ) : (
                Array.from({ length: tens }).map((_, rodIdx) => (
                  <div
                    key={`rod-${rodIdx}`}
                    className="flex flex-col border border-amber-600 bg-amber-400 rounded w-5.5 shadow-xs transition-transform hover:scale-105"
                    title={`Ten-Rod #${rodIdx + 1} (Value: 10)`}
                  >
                    {Array.from({ length: 10 }).map((_, blockIdx) => (
                      <div
                        key={`b-${blockIdx}`}
                        className="h-2 border-b border-amber-500/80 last:border-b-0"
                      />
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500 text-center">
            Each rod has 10 connected unit cubes
          </div>
        </div>

        {/* Ones Zone (एकक) */}
        <div className="bg-white rounded-xl p-4 border border-amber-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-teal-500"></span>
                <span className="font-bold text-slate-800 text-sm">
                  Ones Cubes (एकक) <span className="text-xs text-teal-700 font-normal">· {ones} Single Cubes = {ones}</span>
                </span>
              </div>
              {interactive && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => update(tens, Math.max(0, ones - 1))}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                    title="Remove one cube"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => update(tens, Math.min(19, ones + 1))}
                    className="p-1 rounded bg-teal-100 hover:bg-teal-200 text-teal-800 transition"
                    title="Add one cube"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Visual Ones Cubes */}
            <div className="flex flex-wrap gap-2 min-h-[110px] items-center p-2 bg-slate-50/60 rounded-lg border border-slate-100 content-start">
              {ones === 0 ? (
                <span className="text-xs text-slate-400 italic m-auto">0 Ones Cubes</span>
              ) : (
                Array.from({ length: ones }).map((_, oneIdx) => (
                  <div
                    key={`one-${oneIdx}`}
                    className={`w-5.5 h-5.5 rounded border border-teal-600 bg-teal-400 shadow-2xs transition-transform hover:scale-110 flex items-center justify-center text-[9px] font-bold text-teal-950 ${
                      highlightRegroup && oneIdx >= 10 ? 'ring-2 ring-rose-400 animate-pulse' : ''
                    }`}
                    title={`Cube #${oneIdx + 1}`}
                  >
                    1
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="mt-2 text-xs text-slate-500 text-center">
            {ones >= 10 ? (
              <span className="text-rose-600 font-medium">10 ones can be traded for 1 Ten-Rod!</span>
            ) : (
              'Single units ready to be counted'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
