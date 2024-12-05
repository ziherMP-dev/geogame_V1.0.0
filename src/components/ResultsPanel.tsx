import React from 'react';
import { RoundResult as RoundResultType } from '../types';
import { RoundResult } from './RoundResult';
import { Trophy } from 'lucide-react';

interface ResultsPanelProps {
  roundResults: RoundResultType[];
  totalScore: number;
  currentRound: number;
  onRestart?: () => void;
  onNextRound?: () => void;
  gameOver: boolean;
  isLoading?: boolean;
}

export function ResultsPanel({ 
  roundResults, 
  totalScore, 
  currentRound,
  onRestart, 
  onNextRound,
  gameOver,
  isLoading 
}: ResultsPanelProps) {
  return (
    <div className="h-full bg-white/10 backdrop-blur-lg rounded-xl p-4 flex flex-col">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{totalScore}</p>
            <p className="text-xs text-gray-300">Penalty km</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{currentRound}/5</p>
            <p className="text-xs text-gray-300">Round</p>
          </div>
        </div>
        {onNextRound && !gameOver && (
          <button
            onClick={onNextRound}
            disabled={isLoading}
            className={`
              bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm transition-all duration-200
              ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-600 hover:shadow-lg'}
            `}
          >
            {isLoading ? 'Loading...' : 'Next Round'}
          </button>
        )}
      </div>

      {/* Results Section */}
      <div className="flex-1 overflow-auto space-y-2 min-h-0">
        {roundResults.map((result, index) => (
          <RoundResult key={index} result={result} roundNumber={index + 1} />
        ))}
      </div>

      {/* Game Over Section */}
      {gameOver && (
        <div className="pt-3 mt-3 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-xs text-gray-400">Final Score</p>
                <p className="text-xl font-bold text-white">{totalScore}</p>
              </div>
            </div>
            <button
              onClick={onRestart}
              className="bg-indigo-500 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-600 transition-all duration-200 text-sm font-medium"
            >
              Play Again
            </button>
          </div>
        </div>
      )}

      {/* Footer Space */}
      <div className="h-[10vh]" />
    </div>
  );
}