# API Reference

> Documentación completa de endpoints del BFF.

## Base URL

```
http://localhost:3000/api/v1
```

## Endpoints

### Profile

#### GET /profile

Retorna el perfil profesional.

**Response:**
```json
{
  "name": "David (Davo)",
  "title": "Senior SDET | QA Automation Engineer",
  "tagline": "Building Quality Gates for Fintech",
  "avatar": "/avatar.png",
  "location": "Remote / Latin America",
  "years_experience": 8,
  "summary": "Passionate about building quality gates...",
  "social": {
    "github": "https://github.com/davo",
    "linkedin": "https://linkedin.com/in/davo",
    "email": "davo@example.com"
  }
}
```

### Experience

#### GET /experience

Retorna la experiencia profesional.

**Response:**
```json
[
  {
    "id": "exp-001",
    "company": "Fintech Corp",
    "role": "Senior SDET",
    "period": {
      "start": "2022-01",
      "end": null
    },
    "responsibilities": ["Led API testing automation..."],
    "technologies": ["Python", "pytest", "Playwright"],
    "achievements": ["Zero production incidents..."]
  }
]
```

### Skills

#### GET /skills

Retorna las habilidades técnicas agrupadas por categoría.

**Response:**
```json
{
  "categories": [
    {
      "name": "Languages",
      "items": [
        { "name": "Python", "level": "expert", "years": 8 }
      ]
    }
  ]
}
```

### Projects

#### GET /projects

Retorna todos los proyectos.

**Response:**
```json
[
  {
    "id": "foxhound",
    "name": "FOXHOUND",
    "subtitle": "API Testing Framework",
    "type": "api",
    "description": "Hunt down API vulnerabilities...",
    "technologies": ["Python", "Playwright", "Behave"],
    "stats": {
      "tests_executed": "10,000+",
      "coverage": "95%"
    }
  }
]
```

#### GET /projects/:id

Retorna un proyecto específico.

**Params:**
- `id` - ID del proyecto (foxhound, patriot, codec, stinger)

**Response:** Objeto Project completo.

#### GET /projects/tets-overview

Retorna visión general del Tactical Espionage Testing Suite.

**Response:**
```json
{
  "title": "Tactical Espionage Testing Suite",
  "description": "4 Frameworks. One Mission. Bulletproof Quality.",
  "frameworks": [
    { "id": "foxhound", "role": "API Testing" }
  ]
}
```

#### GET /projects/:id/status

Retorna el estado del gateway para un proyecto.

**Response:**
```json
{
  "available": true,
  "gateway_url": "http://localhost:8000",
  "health": "healthy",
  "last_run": null,
  "runs_today": null,
  "success_rate": null
}
```

### Certifications

#### GET /certifications

Retorna las certificaciones.

**Response:**
```json
[
  {
    "name": "AWS Solutions Architect Associate",
    "issuer": "Amazon",
    "date": "2024-06",
    "expiry": "2027-06"
  }
]
```

### Navigation

#### GET /navigation

Retorna la estructura de navegación.

**Response:**
```json
[
  { "label": "Home", "path": "/", "order": 1 },
  { "label": "Projects", "path": "/projects", "order": 2 }
]
```

### Health

#### GET /health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-06-14T12:00:00Z",
  "version": "1.0.0",
  "uptime": 3600,
  "checks": {
    "dataFiles": "ok",
    "memory": "ok"
  }
}
```

### Contact

#### POST /contact

Envía un mensaje de contacto.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello!",
  "website": "",
  "formTimestamp": "1718400000000"
}
```

**Anti-spam:**
- `website` debe estar vacío (honeypot)
- `formTimestamp` debe tener > 3 segundos

**Response:**
```json
{ "success": true }
```

### OpenAPI

#### GET /openapi.json

Retorna la especificación OpenAPI.

#### GET /docs

Swagger UI para explorar la API.
