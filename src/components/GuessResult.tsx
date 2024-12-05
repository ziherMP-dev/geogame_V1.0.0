import React from 'react';
import { Location } from '../types';
import { calculateDistance } from '../utils/locations';
import { MapPin, Target } from 'lucide-react';

interface GuessResultProps {
  guessedLocation: Location;
  actualLocation: Location;
  locationName: string;
}

export function GuessResult({ guessedLocation, actualLocation, locationName }: GuessResultProps) {
  const distance = calculateDistance(guessedLocation, actualLocation);
  
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
      <h3 className="text-xl font-semibold mb-4">Round Result</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div>
            <p className="font-medium">Correct Location</p>
            <p className="text-gray-300">{locationName}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Target className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div>
            <p className="font-medium">Your Guess</p>
            <p className="text-gray-300">
              {Math.round(distance).toLocaleString()} km away
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-white/10">
          <p className="text-sm text-gray-300">
            Actual coordinates: {actualLocation.lat.toFixed(4)}°, {actualLocation.lng.toFixed(4)}°
          </p>
        </div>
      </div>
    </div>
  );
}