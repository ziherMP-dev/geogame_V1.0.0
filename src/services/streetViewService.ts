import { Location } from '../types';
import { logger } from '../utils/logger';

export class StreetViewService {
  private static instance: google.maps.StreetViewService | null = null;

  private static getInstance(): google.maps.StreetViewService {
    if (!this.instance) {
      logger.debug('Creating new StreetViewService instance');
      this.instance = new google.maps.StreetViewService();
    }
    return this.instance;
  }

  static async validateLocation(location: Location): Promise<{ 
    isValid: boolean; 
    validatedLocation?: Location;
  }> {
    logger.debug('Validating location:', location);
    
    return new Promise((resolve) => {
      this.getInstance().getPanorama({
        location,
        radius: 50,
        source: google.maps.StreetViewSource.OUTDOOR,
        preference: google.maps.StreetViewPreference.NEAREST
      }, (data, status) => {
        if (status === google.maps.StreetViewStatus.OK && data?.location?.latLng) {
          const validatedLocation = {
            lat: data.location.latLng.lat(),
            lng: data.location.latLng.lng()
          };
          logger.debug('Location validated:', validatedLocation);
          resolve({
            isValid: true,
            validatedLocation
          });
        } else {
          logger.debug('Location invalid, status:', status);
          resolve({ isValid: false });
        }
      });
    });
  }
}