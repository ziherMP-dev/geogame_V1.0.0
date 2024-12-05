import React from 'react';
import { useGame } from '../context/GameContext';
import { Map } from './Map';
import { StreetView } from './StreetView';
import { ResultsPanel } from './ResultsPanel';

export function GameBoard() {
  const { gameState, isLoadingLocation, handleGuess, handleNextRound, handleRestart } = useGame();

  return (
    <div className="h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="h-full max-w-[1600px] mx-auto flex flex-col">
        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-4">
          <div className="h-full flex flex-col gap-4">
            <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden">
              {isLoadingLocation ? (
                <div className="p-4">
                  <p className="text-emerald-400 text-sm animate-pulse">Finding new location...</p>
                </div>
              ) : null}
              <StreetView location={gameState.currentLocation.coords} isLoading={isLoadingLocation} />
            </div>

            <div className="flex-1 bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden">
              <Map
                center={{ lat: 20, lng: 0 }}
                guessedLocation={gameState.guessedLocation}
                actualLocation={gameState.guessedLocation ? gameState.currentLocation.coords : null}
                locationName={gameState.guessedLocation ? gameState.currentLocation.name : null}
                onGuess={handleGuess}
                isGuessing={!gameState.guessedLocation}
              />
            </div>
          </div>

          <ResultsPanel
            roundResults={gameState.roundResults}
            totalScore={gameState.score}
            onRestart={handleRestart}
            gameOver={gameState.gameOver}
            currentRound={gameState.round}
            onNextRound={!gameState.gameOver ? handleNextRound : undefined}
            isLoading={isLoadingLocation}
          />
        </div>

        {/* Footer */}
        <div className="h-[10vh] flex items-center justify-center">
          <p className="text-gray-400 text-sm">GeoGame</p>
        </div>
      </div>
    </div>
  );
}