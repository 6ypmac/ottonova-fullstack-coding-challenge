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
  res.json({
    data: cities,
    total: cities.length,
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
