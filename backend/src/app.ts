import express from "express";
import cors from "cors";
import citiesData from "./data/cities.json";

const app = express();

app.use(cors());
app.use(express.json());

type City = {
  name: string;
  name_native: string;
  country: string;
  continent: string;
  latitude: string;
  longitude: string;
  population: string;
  founded: string;
  landmarks: string[];
};

type CityNormalized = Omit<City, "population"> & {
  population: number;
};

const cities: City[] = citiesData.cities;

function normalizeCities(cities: City[]): CityNormalized[] {
  return cities.map((city) => ({
    ...city,
    population: Number(city.population),
  }));
}

function searchCities(cities: CityNormalized[], search?: string) {
  if (!search || search.trim() === "") return cities;

  const searchLower = search.toLowerCase();

  return cities.filter((city) => city.name.toLowerCase().includes(searchLower));
}

function filterCities(cities: CityNormalized[], continent?: string) {
  if (!continent || continent.trim() === "") return cities;

  return cities.filter((city) => city.continent === continent);
}

function sortCities(cities: CityNormalized[], sort?: string): CityNormalized[] {
  if (!sort) return cities;

  const [field, order] = sort.split(":");

  if (field === "population") {
    return [...cities].sort((a, b) => {
      if (order === "desc") {
        return b.population - a.population;
      }
      return a.population - b.population;
    });
  }

  return cities;
}

app.get("/cities", (req, res) => {
  const search = req.query.search?.toString();
  const continent = req.query.continent?.toString();
  const sort = req.query.sort?.toString();

  let result = normalizeCities(cities);
  result = searchCities(result, search);
  result = filterCities(result, continent);
  result = sortCities(result, sort);

  res.json({
    data: result,
    total: result.length,
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
