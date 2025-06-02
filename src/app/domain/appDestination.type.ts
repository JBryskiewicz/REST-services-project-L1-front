export interface Destination {
  city: string,
  country: string,
  temp: number,
  feels_like: number,
  pressure: number,
  windSpeed: number,
  cloudDensity: number,
  visibility: number,
  sunrise: number,
  sunset: number,
}

export interface UserDestinationView {
  id?: number;
  userId: number;
  viewName: string;
  destinations: Destination[];
}
