import React, { createContext, useContext, useCallback, useState } from 'react';
import { Location, GameState, RoundResult } from '../types';
import { getRandomLocation, calculateDistance, calculateScore } from '../utils/locations';

interface GameContextType {
  gameState: GameState;
  isLoadingLocation: boolean;
  handleGuess: (location: Location) => void;
  handleNextRound: () => void;
  handleRestart: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    currentLocation: { coords: { lat: 0, lng: 0 }, name: '' },
    guessedLocation: null,
    score: 0,
    round: 1,
    gameOver: false,
    roundResults: [],
  });

  const loadNewLocation = useCallback(async () => {
    setIsLoadingLocation(true);
    try {
      const location = await getRandomLocation();
      setGameState(prev => ({
        ...prev,
        currentLocation: location,
      }));
    } finally {
      setIsLoadingLocation(false);
    }
  }, []);

  // Initialize first location
  React.useEffect(() => {
    loadNewLocation();
  }, [loadNewLocation]);

  const handleGuess = useCallback((location: Location) => {
    if (gameState.guessedLocation) return;

    const distance = calculateDistance(location, gameState.currentLocation.coords);
    const roundScore = calculateScore(distance);

    const roundResult: RoundResult = {
      location: gameState.currentLocation,
      guess: location,
      score: roundScore,
      distance,
    };

    setGameState(prev => ({
      ...prev,
      guessedLocation: location,
      score: prev.score + roundScore,
      gameOver: prev.round === 5,
      roundResults: [...prev.roundResults, roundResult],
    }));
  }, [gameState.guessedLocation, gameState.currentLocation]);

  const handleNextRound = useCallback(() => {
    loadNewLocation();
    setGameState(prev => ({
      ...prev,
      guessedLocation: null,
      round: prev.round + 1,
    }));
  }, [loadNewLocation]);

  const handleRestart = useCallback(() => {
    loadNewLocation();
    setGameState({
      currentLocation: { coords: { lat: 0, lng: 0 }, name: '' },
      guessedLocation: null,
      score: 0,
      round: 1,
      gameOver: false,
      roundResults: [],
    });
  }, [loadNewLocation]);

  return (
    <GameContext.Provider value={{ gameState, isLoadingLocation, handleGuess, handleNextRound, handleRestart }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}