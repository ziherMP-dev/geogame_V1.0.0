import { useEffect, useRef } from 'react';
import { Location } from '../types';

const MARKER_COLORS = {
  guess: '#EF4444', // Red
  actual: '#10B981' // Green
};

export function useMarkers() {
  const guessMarkerRef = useRef<google.maps.Marker | null>(null);
  const actualMarkerRef = useRef<google.maps.Marker | null>(null);

  const updateGuessMarker = (
    map: google.maps.Map,
    position: Location | null
  ) => {
    if (!position) {
      if (guessMarkerRef.current) {
        guessMarkerRef.current.setMap(null);
        guessMarkerRef.current = null;
      }
      return;
    }

    if (!guessMarkerRef.current) {
      guessMarkerRef.current = new google.maps.Marker({
        map,
        position,
        title: 'Your guess',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: MARKER_COLORS.guess,
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        }
      });
    } else {
      guessMarkerRef.current.setPosition(position);
    }
  };

  const updateActualMarker = (
    map: google.maps.Map,
    position: Location | null,
    title: string | null
  ) => {
    if (!position) {
      if (actualMarkerRef.current) {
        actualMarkerRef.current.setMap(null);
        actualMarkerRef.current = null;
      }
      return;
    }

    if (!actualMarkerRef.current) {
      actualMarkerRef.current = new google.maps.Marker({
        map,
        position,
        title: title || 'Actual location',
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: MARKER_COLORS.actual,
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        }
      });
    } else {
      actualMarkerRef.current.setPosition(position);
      if (title) {
        actualMarkerRef.current.setTitle(title);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (guessMarkerRef.current) {
        guessMarkerRef.current.setMap(null);
      }
      if (actualMarkerRef.current) {
        actualMarkerRef.current.setMap(null);
      }
    };
  }, []);

  return {
    updateGuessMarker,
    updateActualMarker
  };
}