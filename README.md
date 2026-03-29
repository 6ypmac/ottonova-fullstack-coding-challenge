# Ottonova Fullstack Coding Challenge

## Overview

A small fullstack application to explore a cities dataset with search, filtering and sorting.
The backend exposes a REST API, while the frontend provides a simple UI to interact with the data.

- Backend: Node.js (Express)
- Frontend: Angular

Filtering and sorting are handled on the backend, while the frontend uses URL query params as a single source of truth.

---

## Run locally

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Project structure

/backend — REST API
/frontend — Angular app

---

## Backend

- Node.js (Express)
- In-memory dataset (JSON)
- Supports search, filtering and sorting via query params
- Validates query parameters (e.g. sort format)

---

## Frontend

- Angular standalone components
- URL query params used for state (search, filters, sorting)
- RxJS for async data flow
- Signals for UI state (loading, error)

---

## UX considerations

- Loading state while fetching data
- UI remains responsive during requests; previous requests are cancelled using RxJS switchMap
- Empty state when no results are found
- Error state is displayed when the request fails

---

## Architecture decisions

- Filtering and sorting are handled on the backend to avoid duplicating logic in the frontend
- URL query params are used as the single source of truth so state can be shared via link
- Components are split into container and presentational to isolate data logic from UI

## API

### GET /cities

Returns a list of cities with optional filtering and sorting.
Response format is consistent for both success and error cases.

### Query parameters

- `search` (optional)  
  Filter cities by name (case-insensitive)

- `continent` (optional)  
  Filter cities by continent (exact match)

- `sort` (optional)  
  Format: `population:asc` or `population:desc`

### Behavior

- Search is case-insensitive
- Continent filter is case-insensitive
- Invalid sort parameter returns HTTP 400
- If no filters are provided, all cities are returned

### Examples

```http
GET /cities
GET /cities?search=to
GET /cities?continent=Europe
GET /cities?search=yo&continent=Asia
GET /cities?sort=population:desc
```

### Response

```json
{
  "success": true,
  "data": [
    {
      "name": "Tokyo",
      "country": "Japan",
      "continent": "Asia",
      "population": 13960000
    }
  ],
  "total": 1
}
```

### Errors

**400 Bad Request**

```json
{
  "success": false,
  "error": "Invalid sort parameter. Use 'population:asc' or 'population:desc'."
}
```
