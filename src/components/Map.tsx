import React, { useCallback, useRef, useEffect, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import { Location } from '../types';
import { useMarkers } from '../hooks/useMarkers';

interface MapProps {
  center: Location;
  guessedLocation: Location | null;
  actualLocation: Location | null;
  locationName: string | null;
  onGuess: (location: Location) => void;
  isGuessing: boolean;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultMapOptions: google.maps.MapOptions = {
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
  minZoom: 2,
  restriction: {
    latLngBounds: {
      north: 85,
      south: -85,
      west: -180,
      east: 180
    },
    strictBounds: true
  },
  language: 'en',
  region: 'US',
  mapTypeControlOptions: {
    mapTypeIds: ['roadmap', 'terrain']
  }
};

const DEFAULT_CENTER = { lat: 20, lng: 0 };
const DEFAULT_ZOOM = 2;

export function Map({ 
  center, 
  guessedLocation, 
  actualLocation, 
  locationName,
  onGuess, 
  isGuessing 
}: MapProps) {
  const mapRef = useRef<google.maps.Map>();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { updateGuessMarker, updateActualMarker } = useMarkers();

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    setMap(map);
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!isGuessing || !e.latLng) return;
    
    const clickedLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    
    onGuess(clickedLocation);
  }, [isGuessing, onGuess]);

  // Update markers
  useEffect(() => {
    if (!map) return;
    updateGuessMarker(map, guessedLocation);
    updateActualMarker(map, actualLocation, locationName);
  }, [map, guessedLocation, actualLocation, locationName, updateGuessMarker, updateActualMarker]);

  // Reset map when starting a new round
  useEffect(() => {
    if (!map) return;

    if (isGuessing) {
      map.setZoom(DEFAULT_ZOOM);
      map.setCenter(DEFAULT_CENTER);
    }
  }, [map, isGuessing]);

  // Fit bounds when showing result
  useEffect(() => {
    if (!map || !guessedLocation || !actualLocation) return;

    const bounds = new google.maps.LatLngBounds();
    bounds.extend(guessedLocation);
    bounds.extend(actualLocation);

    const padding = {
      top: 50,
      right: 50,
      bottom: 50,
      left: 50
    };

    map.fitBounds(bounds, padding);
  }, [map, guessedLocation, actualLocation]);

  return (
    <div className="h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        onClick={handleMapClick}
        onLoad={onMapLoad}
        options={defaultMapOptions}
      />
    </div>
  );
}