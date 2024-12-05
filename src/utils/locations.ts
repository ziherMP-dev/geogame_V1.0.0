import { Location, LocationInfo } from '../types';
import { StreetViewService } from '../services/streetViewService';
import { logger } from '../utils/logger';

const BOUNDARIES = {
  lat: { min: -60, max: 70 },
  lng: { min: -180, max: 180 }
};

const POPULATION_CENTERS = [
  { lat: 40, lng: -98 },  // North America
  { lat: 48, lng: 10 },   // Europe
  { lat: 35, lng: 140 },  // East Asia
  { lat: -25, lng: 135 }, // Australia
  { lat: -15, lng: -55 }, // South America
  { lat: 30, lng: 31 },   // Africa/Middle East
];

function getRandomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function getRandomLocationNearPopulationCenter(): Location {
  const center = POPULATION_CENTERS[Math.floor(Math.random() * POPULATION_CENTERS.length)];
  const radius = 20;
  
  return {
    lat: Math.max(BOUNDARIES.lat.min, 
          Math.min(BOUNDARIES.lat.max, 
          center.lat + getRandomInRange(-radius, radius))),
    lng: Math.max(BOUNDARIES.lng.min,
          Math.min(BOUNDARIES.lng.max,
          center.lng + getRandomInRange(-radius, radius)))
  };
}

async function getLocationInfo(location: Location): Promise<string> {
  const geocoder = new google.maps.Geocoder();
  
  try {
    const response = await geocoder.geocode({ 
      location,
      language: 'en',
      region: 'US'
    });
    
    if (response.results[0]) {
      const cityComponent = response.results[0].address_components.find(
        component => component.types.includes('locality')
      );
      const countryComponent = response.results[0].address_components.find(
        component => component.types.includes('country')
      );
      
      if (cityComponent && countryComponent) {
        return `${cityComponent.long_name}, ${countryComponent.long_name}`;
      }
      return response.results[0].formatted_address;
    }
    return 'Unknown Location';
  } catch (error) {
    logger.error('Geocoding error:', error);
    return 'Unknown Location';
  }
}

export async function getRandomLocation(): Promise<LocationInfo> {
  let validLocation: Location | null = null;
  let attempts = 0;
  const maxAttempts = 10;

  while (!validLocation && attempts < maxAttempts) {
    const location = getRandomLocationNearPopulationCenter();
    const validation = await StreetViewService.validateLocation(location);

    if (validation.isValid && validation.validatedLocation) {
      validLocation = validation.validatedLocation;
      break;
    }

    attempts++;
  }

  if (!validLocation) {
    return getRandomLocation();
  }

  const name = await getLocationInfo(validLocation);
  return {
    coords: validLocation,
    name
  };
}

export function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371;
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) * Math.cos(toRad(point2.lat)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function calculateScore(distance: number): number {
  return -Math.round(distance);
}