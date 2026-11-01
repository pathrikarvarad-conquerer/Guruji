import React from 'react';

interface NumberLineProps {
  min?: number;
  max?: number;
  start?: number;
  jump?: number;
  end?: number;
  direction?: 'backward' | 'forward';
}

export const NumberLine: React.FC<NumberLineProps> = ({
  min = 0,
  max = 15,
  start = 11,
  jump = 4,
  end = 7,
  direction = 'backward'
}) => {
  const range = max - min;
  const getX = (val: number) => {
    return 40 + ((val - min) / range) * 520;
  };

  const startX = getX(start);
  const endX = getX(end);

  return (
    <div className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-2 border-b border-sky-200/50 pb-2">
        <span className="font-semibold text-slate-800 text-sm md:text-base">
          Interactive Number Line Hop: <span className="text-sky-800 font-bold">{start} - {jump} = {end}</span>
        </span>
        <span className="text-xs text-sky-900 font-medium">
          🐸 Hop backward {jump} times from {start}
        </span>
      </div>

      <div className="w-full overflow-x-auto py-4">
        <svg viewBox="0 0 600 130" className="w-full max-w-2xl mx-auto block select-none">
          {/* Main Axis Line */}
          <line
            x1="30"
            y1="85"
            x2="570"
            y2="85"
            stroke="#0284C7"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Left Arrow */}
          <polygon points="30,80 20,85 30,90" fill="#0284C7" />
          {/* Right Arrow */}
          <polygon points="570,80 580,85 570,90" fill="#0284C7" />

          {/* Ticks and Numbers */}
          {Array.from({ length: range + 1 }).map((_, i) => {
            const val = min + i;
            const x = getX(val);
            const isStart = val === start;
            const isEnd = val === end;

            return (
              <g key={`tick-${val}`}>
                <line
                  x1={x}
                  y1={isStart || isEnd ? "75" : "80"}
                  x2={x}
                  y2="92"
                  stroke={isStart ? "#DC2626" : isEnd ? "#16A34A" : "#64748B"}
                  strokeWidth={isStart || isEnd ? "3" : "1.5"}
                />
                <text
                  x={x}
                  y="112"
                  textAnchor="middle"
                  className={`text-[12px] tabular-nums font-semibold ${
                    isStart
                      ? "fill-rose-700 font-bold"
                      : isEnd
                      ? "fill-emerald-700 font-bold"
                      : "fill-slate-600"
                  }`}
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Arc Jumps */}
          {direction === 'backward' && (
            <g>
              {Array.from({ length: jump }).map((_, hopIdx) => {
                const hopFromVal = start - hopIdx;
                const hopToVal = hopFromVal - 1;
                const hFromX = getX(hopFromVal);
                const hToX = getX(hopToVal);
                const midX = (hFromX + hToX) / 2;
                return (
                  <path
                    key={`hop-${hopIdx}`}
                    d={`M ${hFromX} 80 Q ${midX} 35 ${hToX} 80`}
                    fill="none"
                    stroke="#EA580C"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                );
              })}
            </g>
          )}

          {/* Character / Marker on Start */}
          <circle cx={startX} cy="85" r="5" fill="#DC2626" />
          <text x={startX} y="32" textAnchor="middle" className="text-[14px]">
            🏁
          </text>
          <text x={startX} y="47" textAnchor="middle" className="text-[10px] font-bold fill-rose-700">
            Start ({start})
          </text>

          {/* Marker on Landing */}
          <circle cx={endX} cy="85" r="7" fill="#16A34A" />
          <circle cx={endX} cy="85" r="11" fill="none" stroke="#16A34A" strokeWidth="2" className="animate-ping" />
          <text x={endX} y="28" textAnchor="middle" className="text-[18px]">
            🐸
          </text>
          <text x={endX} y="47" textAnchor="middle" className="text-[10px] font-bold fill-emerald-700">
            Lands on {end}
          </text>
        </svg>
      </div>
    </div>
  );
};
