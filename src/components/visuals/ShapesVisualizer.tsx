import React, { useState } from 'react';

interface ShapesVisualizerProps {
  initialShape?: 'triangle' | 'square' | 'circle' | 'rectangle';
}

export const ShapesVisualizer: React.FC<ShapesVisualizerProps> = ({
  initialShape = 'triangle'
}) => {
  const [selectedShape, setSelectedShape] = useState(initialShape);

  const shapesData = {
    triangle: {
      name: 'Triangle (त्रिकोण)',
      sides: 3,
      corners: 3,
      fact: 'Has 3 straight sides and 3 sharp corners!',
      color: 'stroke-amber-600 fill-amber-100',
      svg: (
        <svg viewBox="0 0 200 160" className="w-48 h-40 mx-auto">
          <polygon points="100,20 25,140 175,140" className="fill-amber-100 stroke-amber-600 stroke-[4]" />
          {/* Highlight corners */}
          <circle cx="100" cy="20" r="6" className="fill-rose-500 animate-pulse" />
          <circle cx="25" cy="140" r="6" className="fill-rose-500 animate-pulse" />
          <circle cx="175" cy="140" r="6" className="fill-rose-500 animate-pulse" />
        </svg>
      )
    },
    square: {
      name: 'Square (चौरस)',
      sides: 4,
      corners: 4,
      fact: 'Has 4 equal straight sides and 4 square corners!',
      color: 'stroke-teal-600 fill-teal-100',
      svg: (
        <svg viewBox="0 0 200 160" className="w-48 h-40 mx-auto">
          <rect x="40" y="20" width="120" height="120" rx="4" className="fill-teal-100 stroke-teal-600 stroke-[4]" />
          <circle cx="40" cy="20" r="6" className="fill-rose-500 animate-pulse" />
          <circle cx="160" cy="20" r="6" className="fill-rose-500 animate-pulse" />
          <circle cx="40" cy="140" r="6" className="fill-rose-500 animate-pulse" />
          <circle cx="160" cy="140" r="6" className="fill-rose-500 animate-pulse" />
        </svg>
      )
    },
    circle: {
      name: 'Circle (वर्तुळ)',
      sides: 0,
      corners: 0,
      fact: 'Round like a coin! Has 0 straight sides and 0 corners.',
      color: 'stroke-purple-600 fill-purple-100',
      svg: (
        <svg viewBox="0 0 200 160" className="w-48 h-40 mx-auto">
          <circle cx="100" cy="80" r="60" className="fill-purple-100 stroke-purple-600 stroke-[4]" />
        </svg>
      )
    },
    rectangle: {
      name: 'Rectangle (आयताकृती)',
      sides: 4,
      corners: 4,
      fact: 'Has 2 long sides and 2 short sides, with 4 corners!',
      color: 'stroke-blue-600 fill-blue-100',
      svg: (
        <svg viewBox="0 0 200 160" className="w-48 h-40 mx-auto">
          <rect x="25" y="40" width="150" height="80" rx="4" className="fill-blue-100 stroke-blue-600 stroke-[4]" />
          <circle cx="25" cy="40" r="6" className="fill-rose-500 animate-pulse" />
          <circle cx="175" cy="40" r="6" className="fill-rose-500 animate-pulse" />
          <circle cx="25" cy="120" r="6" className="fill-rose-500 animate-pulse" />
          <circle cx="175" cy="120" r="6" className="fill-rose-500 animate-pulse" />
        </svg>
      )
    }
  };

  const current = shapesData[selectedShape];

  return (
    <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-5 shadow-sm text-center">
      <div className="flex items-center justify-between mb-4 border-b border-purple-200/50 pb-2">
        <span className="font-semibold text-slate-800 text-sm md:text-base">
          Geometric Attributes Explorer
        </span>
        <div className="flex gap-1">
          {(Object.keys(shapesData) as Array<keyof typeof shapesData>).map((sh) => (
            <button
              key={sh}
              onClick={() => setSelectedShape(sh)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition ${
                selectedShape === sh
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-purple-100'
              }`}
            >
              {sh}
            </button>
          ))}
        </div>
      </div>

      <div className="py-2">{current.svg}</div>

      <div className="grid grid-cols-2 gap-3 mt-4 max-w-sm mx-auto">
        <div className="bg-white p-2.5 rounded-xl border border-purple-100 shadow-2xs">
          <span className="block text-xs text-slate-500">Straight Sides</span>
          <span className="text-xl font-bold text-purple-900 tabular-nums">{current.sides}</span>
        </div>
        <div className="bg-white p-2.5 rounded-xl border border-purple-100 shadow-2xs">
          <span className="block text-xs text-slate-500">Corners (Red Dots)</span>
          <span className="text-xl font-bold text-rose-600 tabular-nums">{current.corners}</span>
        </div>
      </div>

      <p className="text-xs text-purple-900 font-medium mt-3">{current.fact}</p>
    </div>
  );
};
