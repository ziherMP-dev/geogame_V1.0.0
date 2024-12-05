import React from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { GameProvider } from './context/GameContext';
import { GameBoard } from './components/GameBoard';
import { ConfigError } from './components/ConfigError';
import { LoadingScreen } from './components/LoadingScreen';

const libraries: ("places" | "geometry" | "drawing" | "visualization")[] = [];

function App() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries,
  });

  if (!apiKey) {
    return <ConfigError />;
  }

  if (loadError) {
    return <LoadingScreen error={loadError} />;
  }

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <GameProvider>
      <GameBoard />
    </GameProvider>
  );
}

export default App;