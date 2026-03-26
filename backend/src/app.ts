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

app.get("/cities", (req, res) => {
  const search = req.query.search?.toString();
  const continent = req.query.continent?.toString();
  const sortParam = req.query.sort?.toString();

  const parsedSort = parseSort(sortParam);
  if (sortParam && !parsedSort) {
    return res.status(400).json({
      error:
        "Invalid sort parameter. Use 'population:asc' or 'population:desc'.",
    });
  }

  let result = normalizeCities(cities);
  result = searchCities(result, search);
  result = filterCities(result, continent);

  if (parsedSort) {
    result = sortCities(result, parsedSort);
  }

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
