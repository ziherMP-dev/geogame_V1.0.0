import React from 'react';
import { RoundResult } from '../types';
import { MapPin } from 'lucide-react';

interface GameSummaryProps {
  roundResults: RoundResult[];
  totalScore: number;
  onRestart: () => void;
}

export function GameSummary({ roundResults, totalScore, onRestart }: GameSummaryProps) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl p-6 max-w-2xl w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-4">Game Summary</h2>
        
        <div className="space-y-3 mb-6 max-h-[320px] overflow-y-auto">
          {roundResults.map((result, index) => (
            <div key={index} className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors duration-200">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  <span className="text-white font-medium">Round {index + 1}</span>
                </div>
                <span className="text-white font-bold">{result.score} points</span>
              </div>
              <div className="text-gray-400 text-sm">
                <p>{result.location.name}</p>
                <p>{Math.round(result.distance).toLocaleString()} km away</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="text-center">
            <p className="text-gray-400">Total Score</p>
            <p className="text-4xl font-bold text-white mt-1">{totalScore}</p>
          </div>
          
          <button
            onClick={onRestart}
            className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-200 text-lg font-medium hover:shadow-lg shadow-indigo-500/20"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
}