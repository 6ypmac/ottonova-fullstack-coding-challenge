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
  return cities.map((city) => {
    const parsedPopulation = Number(city.population);

    return {
      ...city,
      population: Number.isNaN(parsedPopulation) ? 0 : parsedPopulation,
    };
  });
}

function searchCities(cities: CityNormalized[], search?: string) {
  if (!search || search.trim() === "") return cities;

  const searchLower = search.trim().toLowerCase();

  return cities.filter((city) => city.name.toLowerCase().includes(searchLower));
}

function filterCities(cities: CityNormalized[], continent?: string) {
  if (!continent || continent.trim() === "") return cities;

  const normalizedContinent = continent.trim().toLowerCase();

  return cities.filter(
    (city) => city.continent.toLowerCase() === normalizedContinent,
  );
}

function parseSort(
  sort?: string,
): { field: "population"; order: "asc" | "desc" } | null {
  if (!sort) return null;

  const [field, order] = sort.split(":");

  if (field !== "population") return null;
  if (order !== "asc" && order !== "desc") return null;

  return { field, order };
}

function sortCities(
  cities: CityNormalized[],
  sort: { field: "population"; order: "asc" | "desc" },
): CityNormalized[] {
  return [...cities].sort((a, b) => {
    if (sort.order === "desc") {
      return b.population - a.population;
    }
    return a.population - b.population;
  });
}

function successResponse<T>(data: T, total: number) {
  return {
    success: true,
    data,
    total,
  };
}

function errorResponse(message: string) {
  return {
    success: false,
    error: message,
  };
}

app.get("/cities", (req, res) => {
  const search = req.query.search?.toString();
  const continent = req.query.continent?.toString();
  const sortParam = req.query.sort?.toString();

  const parsedSort = parseSort(sortParam);
  if (sortParam && !parsedSort) {
    return res
      .status(400)
      .json(
        errorResponse(
          "Invalid sort parameter. Use 'population:asc' or 'population:desc'.",
        ),
      );
  }

  let result = normalizeCities(cities);
  result = searchCities(result, search);
  result = filterCities(result, continent);

  if (parsedSort) {
    result = sortCities(result, parsedSort);
  }

  res.json(successResponse(result, result.length));
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

export { normalizeCities, searchCities, filterCities, sortCities, parseSort };

export default app;
export type { City, CityNormalized };
