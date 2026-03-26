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

const cities: City[] = citiesData.cities;

app.get("/cities", (req, res) => {
  const { search, continent } = req.query;

  let result = [...cities];

  // search by name
  if (typeof search === "string" && search.trim() !== "") {
    const searchLower = search.toLowerCase();

    result = result.filter((city) =>
      city.name.toLowerCase().includes(searchLower),
    );
  }

  // filter by continent
  if (typeof continent === "string" && continent.trim() !== "") {
    result = result.filter((city) => city.continent === continent);
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
