export interface Location {
  lat: number;
  lng: number;
}

export interface LocationInfo {
  coords: Location;
  name: string;
}

export interface RoundResult {
  location: LocationInfo;
  guess: Location;
  score: number;
  distance: number;
}

export interface GameState {
  currentLocation: LocationInfo;
  guessedLocation: Location | null;
  score: number;
  round: number;
  gameOver: boolean;
  roundResults: RoundResult[];
}