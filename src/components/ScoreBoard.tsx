interface ScoreBoardProps {
  score: number;
  round: number;
  onNextRound?: () => void;
  gameOver?: boolean;
  onRestart?: () => void;
  isLoading?: boolean;
}

export function ScoreBoard({ score, round, onNextRound, gameOver, onRestart, isLoading }: ScoreBoardProps) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex gap-4">
        <div className="text-center">
          <p className="text-3xl font-bold">{score}</p>
          <p className="text-sm text-gray-300">Penalty km</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold">{round}/5</p>
          <p className="text-sm text-gray-300">Round</p>
        </div>
      </div>
      {onNextRound && !gameOver && (
        <button
          onClick={onNextRound}
          disabled={isLoading}
          className={`
            bg-emerald-500 text-white px-6 py-2 rounded-lg transition-all duration-200
            ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-600 hover:shadow-lg'}
          `}
        >
          {isLoading ? 'Loading...' : 'Next Round'}
        </button>
      )}
    </div>
  );
}