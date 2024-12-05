import React from 'react';
import { RoundResult as RoundResultType } from '../types';
import { MapPin, Target } from 'lucide-react';

interface RoundResultProps {
  result: RoundResultType;
  roundNumber: number;
}

export function RoundResult({ result, roundNumber }: RoundResultProps) {
  return (
    <div className="bg-white/10 rounded-lg p-2 hover:bg-white/15 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-3 h-3 text-emerald-500" />
          <span className="text-white text-sm">Round {roundNumber}</span>
        </div>
        <span className="text-white text-sm font-bold">{result.score} pts</span>
      </div>
      <div className="text-gray-400 text-xs mt-1">
        <div className="truncate">{result.location.name}</div>
        <div className="flex items-center gap-1 mt-0.5">
          <Target className="w-3 h-3 text-red-500" />
          <p>{Math.round(result.distance).toLocaleString()} km</p>
        </div>
      </div>
    </div>
  );
}