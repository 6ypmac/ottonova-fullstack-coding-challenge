export type City = {
  name: string;
  name_native: string;
  country: string;
  continent: string;
  latitude: string;
  longitude: string;
  population: number;
  founded: string;
  landmarks: string[];
};

export type CitiesResponse = {
  success: boolean;
  data: City[];
  total: number;
};
