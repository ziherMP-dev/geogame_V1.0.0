import { useRef, useCallback } from 'react';
import { Location } from '../types';
import { logger } from '../utils/logger';

export function useStreetView() {
  const streetViewRef = useRef<google.maps.StreetViewPanorama | null>(null);

  const initializeStreetView = useCallback((container: HTMLDivElement, location: Location) => {
    if (streetViewRef.current) {
      logger.debug('Street View already initialized');
      return;
    }

    streetViewRef.current = new window.google.maps.StreetViewPanorama(container, {
      position: location,
      pov: { heading: 0, pitch: 0 },
      zoom: 1,
      addressControl: false,
      showRoadLabels: false,
      zoomControl: false,
      fullscreenControl: false,
      motionTracking: false,
      motionTrackingControl: false,
      enableCloseButton: false,
    });

    logger.debug('Street View initialized');
  }, []);

  const updateStreetViewPosition = useCallback((location: Location) => {
    if (!streetViewRef.current) {
      logger.debug('Cannot update position: Street View not initialized');
      return;
    }

    streetViewRef.current.setPosition(location);
    logger.debug('Street View position updated:', location);
  }, []);

  const cleanup = useCallback(() => {
    if (streetViewRef.current) {
      logger.debug('Cleaning up Street View instance');
      streetViewRef.current.setVisible(false);
      streetViewRef.current = null;
    }
  }, []);

  return {
    streetViewRef,
    initializeStreetView,
    updateStreetViewPosition,
    cleanup
  };
}