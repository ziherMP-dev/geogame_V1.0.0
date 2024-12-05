import { useState, useCallback, useRef } from 'react';
import { Location } from '../types';
import { StreetViewService } from '../services/streetViewService';
import { logger } from '../utils/logger';

export function useLocationValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [validatedLocation, setValidatedLocation] = useState<Location | null>(null);
  const validationLockRef = useRef(false);

  const validateLocation = useCallback(async (location: Location) => {
    // Skip validation if locked (location already validated)
    if (validationLockRef.current) {
      logger.debug('Skipping validation - location locked');
      return;
    }

    logger.debug('Starting location validation:', location);
    setIsValidating(true);
    
    try {
      const validation = await StreetViewService.validateLocation(location);
      if (validation.isValid && validation.validatedLocation) {
        logger.debug('Location validated:', validation.validatedLocation);
        setValidatedLocation(validation.validatedLocation);
        // Lock validation after successful validation
        validationLockRef.current = true;
      } else {
        logger.debug('Location validation failed');
        setValidatedLocation(null);
      }
    } catch (error) {
      logger.error('Location validation error:', error);
      setValidatedLocation(null);
    } finally {
      setIsValidating(false);
    }
  }, []);

  const resetValidation = useCallback(() => {
    logger.debug('Resetting location validation');
    validationLockRef.current = false;
    setValidatedLocation(null);
  }, []);

  return {
    isValidating,
    validatedLocation,
    validateLocation,
    resetValidation
  };
}