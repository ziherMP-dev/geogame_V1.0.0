import { useEffect, useRef } from 'react';
import { Location } from '../types';
import { useGoogleMapsLoaded } from '../services/googleMapsService';
import { useStreetView } from '../hooks/useStreetView';
import { useLocationValidation } from '../hooks/useLocationValidation';
import { logger } from '../utils/logger';

interface StreetViewProps {
  location: Location;
  isLoading?: boolean;
  onLoad?: () => void;
}

export function StreetView({ location, isLoading, onLoad }: StreetViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isGoogleMapsLoaded = useGoogleMapsLoaded();
  const { isValidating, validatedLocation, validateLocation, resetValidation } = useLocationValidation();
  const { streetViewRef, initializeStreetView, updateStreetViewPosition, cleanup } = useStreetView();

  // Log component state
  logger.debug('StreetView component state:', {
    isGoogleMapsLoaded,
    isLoading,
    isValidating,
    hasValidatedLocation: !!validatedLocation,
    hasInitialized: !!streetViewRef.current,
    location
  });

  // Reset validation when loading new round
  useEffect(() => {
    if (isLoading) {
      cleanup();
      resetValidation();
    }
  }, [isLoading, cleanup, resetValidation]);

  // Validate location before initializing Street View
  useEffect(() => {
    if (!isGoogleMapsLoaded || isLoading) {
      logger.debug('Skipping location validation:', { 
        apiNotLoaded: !isGoogleMapsLoaded, 
        isLoading 
      });
      return;
    }

    validateLocation(location);
  }, [location, isGoogleMapsLoaded, isLoading, validateLocation]);

  // Initialize Street View only after location is validated
  useEffect(() => {
    if (!containerRef.current || !isGoogleMapsLoaded || !validatedLocation || isLoading || streetViewRef.current) {
      logger.debug('Skipping initialization due to:', {
        noContainer: !containerRef.current,
        apiNotLoaded: !isGoogleMapsLoaded,
        noValidLocation: !validatedLocation,
        isLoading,
        alreadyInitialized: !!streetViewRef.current
      });
      return;
    }

    logger.debug('Initializing new Street View instance');
    initializeStreetView(containerRef.current, validatedLocation);
    onLoad?.();
  }, [validatedLocation, isGoogleMapsLoaded, isLoading, onLoad, initializeStreetView]);

  // Update position when location changes
  useEffect(() => {
    if (!streetViewRef.current || !validatedLocation || isLoading) {
      logger.debug('Skipping position update:', {
        noInstance: !streetViewRef.current,
        noValidLocation: !validatedLocation,
        isLoading
      });
      return;
    }

    logger.debug('Updating position to:', validatedLocation);
    updateStreetViewPosition(validatedLocation);
  }, [validatedLocation, isLoading, updateStreetViewPosition]);

  if (isLoading || isValidating) {
    return (
      <div className="w-full h-full bg-gray-800/50 flex items-center justify-center">
        <div className="text-emerald-400 animate-pulse">Finding new location...</div>
      </div>
    );
  }

  if (!isGoogleMapsLoaded) {
    return (
      <div className="w-full h-full bg-gray-800/50 flex items-center justify-center">
        <div className="text-emerald-400 animate-pulse">Initializing Street View...</div>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full" />;
}