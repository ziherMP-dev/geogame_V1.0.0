import { useEffect, useState } from 'react';

export function useGoogleMapsLoaded() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google?.maps?.StreetViewPanorama) {
        console.log('[GoogleMapsService] Google Maps API fully loaded');
        setIsLoaded(true);
      } else {
        console.log('[GoogleMapsService] Waiting for Google Maps API...');
        setTimeout(checkGoogleMapsLoaded, 100);
      }
    };

    checkGoogleMapsLoaded();
  }, []);

  return isLoaded;
}