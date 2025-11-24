 'use client';

import React from 'react';
import CountUp from './CountUp';

type Stat = {
  number: string;
  label: string;
};

export default function HeroStats({ stats }: { stats: Stat[] }) {
  return (
    <div className="mt-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white/90 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 text-center shadow hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <div className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 leading-tight">
              <CountUp value={s.number} />
            </div>
            <div className="text-sm md:text-base text-gray-600">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
