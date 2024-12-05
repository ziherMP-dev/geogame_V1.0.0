import { useEffect, useRef } from 'react';
import { Location } from '../types';
import { GOOGLE_MAPS_MARKER } from '../utils/constants';

export function useAdvancedMarker() {
  const guessMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);
  const actualMarkerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(null);

  const createMarkerElement = (color: string) => {
    const svg = `
      <svg viewBox="0 0 24 24" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
        <path d="${GOOGLE_MAPS_MARKER.path}" fill="${color}" stroke="white" stroke-width="2"/>
      </svg>
    `;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = document.createElement('img');
    img.src = url;
    return img;
  };

  const updateGuessMarker = (
    map: google.maps.Map,
    position: Location | null
  ) => {
    if (!position) {
      if (guessMarkerRef.current) {
        guessMarkerRef.current.map = null;
        guessMarkerRef.current = null;
      }
      return;
    }

    if (!guessMarkerRef.current) {
      const content = createMarkerElement('#EF4444');
      guessMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map,
        position,
        content,
        title: 'Your guess'
      });
    } else {
      guessMarkerRef.current.position = position;
    }
  };

  const updateActualMarker = (
    map: google.maps.Map,
    position: Location | null,
    title: string | null
  ) => {
    if (!position) {
      if (actualMarkerRef.current) {
        actualMarkerRef.current.map = null;
        actualMarkerRef.current = null;
      }
      return;
    }

    if (!actualMarkerRef.current) {
      const content = createMarkerElement('#10B981');
      actualMarkerRef.current = new google.maps.marker.AdvancedMarkerElement({
        map,
        position,
        content,
        title: title || 'Actual location'
      });
    } else {
      actualMarkerRef.current.position = position;
      if (title) {
        actualMarkerRef.current.title = title;
      }
    }
  };

  useEffect(() => {
    return () => {
      if (guessMarkerRef.current) {
        guessMarkerRef.current.map = null;
      }
      if (actualMarkerRef.current) {
        actualMarkerRef.current.map = null;
      }
    };
  }, []);

  return {
    updateGuessMarker,
    updateActualMarker
  };
}