# Ottonova Fullstack Coding Challenge

This project contains a simple fullstack application:

- Backend: Node.js REST API
- Frontend: Angular application

## Project structure

/backend — REST API
/frontend — Angular app

## API

### GET /cities

Returns a list of cities with optional filtering and sorting.

### Query parameters

- `search` (optional)  
  Filter cities by name (case-insensitive)

- `continent` (optional)  
  Filter cities by continent (exact match)

- `sort` (optional)  
  Format: `population:asc` or `population:desc`

---

### Examples

```
GET /cities
GET /cities?search=to
GET /cities?continent=Europe
GET /cities?search=yo&continent=Asia
GET /cities?sort=population:desc
```

---

### Response

```json
{
  "data": [
    {
      "name": "Tokyo",
      "country": "Japan",
      "continent": "Asia",
      "population": 13960000
      ...
    }
  ],
  "total": 1
}
```

---

### Errors

**400 Bad Request**

```json
{
  "error": "Invalid sort parameter. Use 'population:asc' or 'population:desc'."
}
```
