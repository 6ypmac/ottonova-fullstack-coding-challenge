import {
  normalizeCities,
  parseSort,
  searchCities,
  filterCities,
  sortCities,
} from "./app";
import type { City, CityNormalized } from "./app";

const baseCity = {
  name: "Test",
  name_native: "Test",
  country: "Test",
  continent: "Test",
  latitude: "0",
  longitude: "0",
  founded: "2000",
  landmarks: [],
};

const city = (overrides = {}): City => ({
  ...baseCity,
  population: "1",
  ...overrides,
});

const normalizeCity = (overrides = {}): CityNormalized => ({
  ...baseCity,
  population: 1,
  ...overrides,
});

describe("normalizeCities", () => {
  it("should convert population to number", () => {
    const input = [city({ population: "1000" })];

    const result = normalizeCities(input);

    expect(result[0].population).toBe(1000);
  });

  it("should fallback to 0 if population is invalid", () => {
    const input = [city({ population: "abc" })];

    const result = normalizeCities(input);

    expect(result[0].population).toBe(0);
  });
});

describe("searchCities", () => {
  const cities = [
    normalizeCity({ name: "Tokyo", continent: "Asia" }),
    normalizeCity({ name: "Berlin", continent: "Europe" }),
  ];

  it("should filter cities by name (case-insensitive)", () => {
    const result = searchCities(cities, "to");

    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("Tokyo");
  });

  it("should return all cities if search is empty", () => {
    const result = searchCities(cities);

    expect(result).toHaveLength(2);
  });
});

describe("filterCities", () => {
  const cities = [
    normalizeCity({ name: "Tokyo", continent: "Asia" }),
    normalizeCity({ name: "Berlin", continent: "Europe" }),
  ];

  it("should filter cities by continent", () => {
    const result = filterCities(cities, "Asia");

    expect(result.length).toBe(1);
    expect(result[0].name).toBe("Tokyo");
  });

  it("should return all cities if continent is not provided", () => {
    const result = filterCities(cities);

    expect(result.length).toBe(2);
  });
});

describe("parseSort", () => {
  it("should parse valid sort parameter", () => {
    const result = parseSort("population:desc");

    expect(result).toEqual({
      field: "population",
      order: "desc",
    });
  });

  it("should return null for invalid field", () => {
    const result = parseSort("invalid:desc");

    expect(result).toBeNull();
  });

  it("should return null for invalid order", () => {
    const result = parseSort("population:wrong");

    expect(result).toBeNull();
  });

  it("should return null if sort is undefined", () => {
    const result = parseSort(undefined);

    expect(result).toBeNull();
  });
});

describe("sortCities", () => {
  const cities = [
    normalizeCity({ name: "CityA", population: 100 }),
    normalizeCity({ name: "CityB", population: 200 }),
  ];

  it("should sort cities by population ascending", () => {
    const result = sortCities(cities, {
      field: "population",
      order: "asc",
    });

    expect(result[0].population).toBe(100);
    expect(result[1].population).toBe(200);
  });

  it("should sort cities by population descending", () => {
    const result = sortCities(cities, {
      field: "population",
      order: "desc",
    });

    expect(result[0].population).toBe(200);
    expect(result[1].population).toBe(100);
  });
});
