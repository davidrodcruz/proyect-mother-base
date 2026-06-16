# David (Davo) Portfolio - Architecture & UX Plan

**Fecha:** 14 de Junio, 2026  
**Autor:** Lead Architect + UX/UI Designer  
**Estado:** Plan Maestro - Listo para Ejecución  
**Ejecución:** Agente de AI (autónomo, sin intervención humana directa)

---

## Overview

Portal web personal y portafolio para David (Davo), Senior SDET y QA Automation Engineer especializado en Fintech. El sitio funcionará como CV interactivo y showcase de su "Tactical Espionage Testing Suite (TETS)" compuesta por 4 frameworks: FOXHOUND, PATRIOT, CODEC y STINGER.

**Arquitectura Core:** Backend for Frontend (BFF) + API First  
**Filosofía:** Frontend presentacional puro, sin lógica de negocio. Todos los datos se inyectan dinámicamente vía API.  
**Costo Operativo Total:** $0/mes (todo stack open-source y free tier)

---

## Goals

1. **CV Interactivo:** Plataforma que despliegue experiencia, habilidades y certificaciones consumiendo datos desde el BFF
2. **Showcase de Proyectos:** Presentar los 4 frameworks de testing de forma visualmente impactante
3. **Lab de Pruebas:** Utilizar el portal como canvas para implementar pruebas de contratos en microservicios y automatización de endpoints
4. **Brand Personal:** Establecer presencia profesional con estética "tech/cyber/tactical"
5. **Reclutamiento:** Atraer líderes técnicos y reclutadores de nivel senior

---

## Scope

### Incluido
- Frontend presentacional (SPA/SSG)
- BFF con endpoints REST
- Secciones: Hero, Proyectos, Habilidades, Experiencia, Contacto
- Diseño responsivo (mobile-first)
- Dark mode optimizado para OLED
- Integración con iconografía táctica/cyber

### No Incluido
- Backend de negocio (fuera del BFF)
- Base de datos relacional (uso de JSON/YAML estático o headless CMS)
- Autenticación de usuarios
- Panel de administración (v1)

---

## Constraints

| Restricción | Descripción |
|-------------|-------------|
| **Arquitectura BFF** | Frontend no contiene lógica de negocio, reglas ni procesamiento de datos |
| **API First** | Todo contenido se define en endpoints antes de implementar UI |
| **Componentes Puros** | Componentes presentacionales que renderizan exactamente lo que el backend envía |
| **Separación Total** | Frontend como canvas para pruebas de contratos y automatización |
| **Performance** | Lighthouse score > 95 en todas las métricas |
| **Accesibilidad** | WCAG 2.1 AA mínimo |
| **Costo** | $0/mes - solo herramientas open-source y free tier |

---

## Security

### Headers de Seguridad (BFF - Fastify)
```typescript
// @fastify/helmet
fastify.register(require('@fastify/helmet'), {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],  // Astro islands
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.davo.dev"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
});
```

### Rate Limiting
```typescript
// @fastify/rate-limit
fastify.register(require('@fastify/rate-limit'), {
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: () => ({
    error: 'Too Many Requests',
    message: 'Rate limit exceeded, try again later'
  })
});

// Rate limit específico para contact form
fastify.register(require('@fastify/rate-limit'), {
  max: 5,
  timeWindow: '1 hour',
  keyGenerator: (req) => req.ip,
  route: '/contact'
});
```

### CORS Configuración
```typescript
fastify.register(require('@fastify/cors'), {
  origin: process.env.CORS_ORIGIN,  // https://davo.dev
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  maxAge: 86400
});
```

### Anti-Spam Contact Form
- **Honeypot field:** Campo oculto `website` que debe estar vacío
- **Time-based:** Rechazar submissions < 3 segundos (bots rápidos)
- **Rate limiting:** 5 requests/hora por IP
- **Sin JavaScript dependency:** Form funciona con JS deshabilitado

### Validación de Input
- Sanitización de todos los campos con `validator.js`
- Longitud máxima: name (100), email (254), message (2000)
- Regex validation para email
- Strip HTML tags para prevenir XSS

---

## Observability

### Logging (BFF)
```typescript
// pino (ya incluido en Fastify)
fastify.register(require('pino'), {
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
    bindings: (bindings) => ({
      pid: bindings.pid,
      hostname: bindings.hostname,
      service: 'davo-portfolio-bff'
    })
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      hostname: req.hostname,
      remoteAddress: req.ip
    }),
    res: (res) => ({
      statusCode: res.statusCode
    })
  }
});
```

### Health Check Endpoint
```yaml
GET /health
  Response:
    status: "healthy"
    timestamp: "2026-06-14T12:00:00Z"
    version: "1.0.0"
    uptime: 3600
    checks:
      dataFiles: "ok"
      memory: "ok"
```

### Métricas Básicas (sin external services)
- **Request logging:** method, url, status, duration
- **Error tracking:** errores 4xx/5xx con contexto
- **Memory usage:** alerta si > 80% heap
- **Data file monitoring:** detectar cambios en JSON/YAML files

### Alerting
- **UptimeRobot:** Monitoreo gratuito cada 5 minutos (free tier: 50 monitors)
- **GitHub Actions:** Cron job para health check cada hora
- **Logs:** Archivados localmente, rotación diaria

---

## Architecture Decisions

### ADR-001: BFF Pattern
**Decisión:** Implementar Backend for Frontend como capa intermedia  
**Razón:** Permite desacoplar completamente el frontend del backend, habilita el portal como lab de pruebas para contratos de microservicios  
**Tradeoff:**增加了 una capa adicional de complejidad, pero ganamos flexibilidad y testing capabilities

### ADR-002: API First
**Decisión:** Definir contratos OpenAPI antes de implementar UI  
**Razón:** Permite desarrollo paralelo, testing temprano de contratos, y el frontend se convierte en consumidor puro  
**Tradeoff:** Requiere disciplina en el diseño de APIs, pero reduce friction en desarrollo

### ADR-003: Frontend Presentacional
**Decisión:** Frontend sin estado de negocio, solo renderiza datos del BFF  
**Razón:** Alineado con el objetivo de usar el portal como canvas para testing de microservicios  
**Tradeoff:** Más llamadas a API, pero ganamos testing surface y separación limpia

### ADR-004: Static Data Layer
**Decisión:** Datos estáticos (JSON/YAML) alimentados al BFF, no base de datos relacional  
**Razón:** Para un portfolio personal, la complejidad de una DB no está justificada  
**Tradeoff:** Menos flexibilidad para datos dinámicos, pero simplifica despliegue y mantenimiento

### ADR-005: Data Validation & Versioning
**Decisión:** JSON Schema para validación + git-based versioning de datos  
**Razón:** Garantiza integridad de datos sin DB, version control automático  
**Tradeoff:** Requiere disciplina al editar JSON, pero ganamos trazabilidad

### ADR-006: Cache Strategy
**Decisión:** ETag-based caching + Cache-Control headers  
**Razón:** Mínimo overhead, funciona con cualquier CDN gratuito  
**Tradeoff:** Invalidación manual al actualizar datos, pero simplificado con git push

---

## Data Layer

### JSON Schema Validation
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["id", "company", "role", "period", "responsibilities", "technologies"],
    "properties": {
      "id": { "type": "string", "pattern": "^exp-\\d{3}$" },
      "company": { "type": "string", "minLength": 1, "maxLength": 100 },
      "role": { "type": "string", "minLength": 1, "maxLength": 100 },
      "period": {
        "type": "object",
        "required": ["start"],
        "properties": {
          "start": { "type": "string", "pattern": "^\\d{4}-\\d{2}$" },
          "end": { "type": ["string", "null"], "pattern": "^\\d{4}-\\d{2}$" }
        }
      },
      "responsibilities": { "type": "array", "minItems": 1, "items": { "type": "string" } },
      "technologies": { "type": "array", "minItems": 1, "items": { "type": "string" } },
      "achievements": { "type": "array", "items": { "type": "string" } }
    }
  }
}
```

### Cache Headers (Fastify)
```typescript
fastify.addHook('onSend', async (request, reply) => {
  if (request.url.startsWith('/api/')) {
    const dataHash = await calculateFileHash(request.url);
    reply.header('ETag', `"${dataHash}"`);
    reply.header('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    reply.header('Vary', 'Accept-Encoding');
    if (request.headers['if-none-match'] === `"${dataHash}"`) {
      reply.code(304).send();
    }
  }
});
```

### Data File Structure
```
bff/src/data/
├── profile.json
├── experience.json
├── skills.json
├── projects/
│   ├── foxhound.json
│   ├── patriot.json
│   ├── codec.json
│   └── stinger.json
├── certifications.json
├── navigation.json
├── gateway.json              # Gateway URL y configuración
└── schemas/
    ├── profile.schema.json
    ├── experience.schema.json
    ├── project.schema.json
    └── ...
```

**gateway.json:**
```json
{
  "url": "http://localhost:8000",
  "timeout_ms": 2000,
  "endpoints": {
    "health": "/api/v1/health",
    "run": "/api/v1/tests/run",
    "status": "/api/v1/tests/run/{run_id}",
    "report": "/api/v1/tests/run/{run_id}/report"
  }
}
```

### Validation on Startup
```typescript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

async function validateDataFiles() {
  const files = ['profile', 'experience', 'skills', 'certifications'];
  for (const file of files) {
    const data = await import(`./data/${file}.json`);
    const schema = await import(`./schemas/${file}.schema.json`);
    const validate = ajv.compile(schema.default);
    if (!validate(data.default)) {
      throw new Error(`Validation failed for ${file}: ${JSON.stringify(validate.errors)}`);
    }
  }
  console.log('All data files validated successfully');
}
```

---

## Design System

### Color Palette (Dark Mode OLED)
| Rol | Hex | Uso |
|-----|-----|-----|
| Primary | `#F59E0B` | Acentos dorados, confianza |
| Secondary | `#FBBF24` | Hover states, highlights |
| CTA | `#8B5CF6` | Botones de acción, links |
| Background | `#0F172A` | Fondo principal (slate-900) |
| Surface | `#1E293B` | Tarjetas, cards (slate-800) |
| Text Primary | `#F8FAFC` | Texto principal (slate-50) |
| Text Muted | `#94A3B8` | Texto secundario (slate-400) |
| Border | `#334155` | Bordes sutiles (slate-700) |

### Tipografía
| Elemento | Font | Peso | Tamaño |
|----------|------|------|--------|
| Headings | Archivo | 600-700 | 2.5rem - 4rem |
| Body | Space Grotesk | 400-500 | 1rem - 1.125rem |
| Code/Mono | JetBrains Mono | 400 | 0.875rem |

**Import CSS:**
```css
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Efectos
- **Glow sutil:** `text-shadow: 0 0 10px rgba(245, 158, 11, 0.3)`
- **Transiciones:** 150-300ms ease-out
- **Cards:** Glass morphism sutil con `backdrop-blur`
- **Hover:** Scale 1.02 + shadow elevation

### Iconografía
- **Librería:** Lucide Icons o Heroicons
- **Estilo:** Línea (outline), stroke-width: 1.5
- **Tamaño base:** 24x24 viewBox

---

## Site Structure (Sitemap)

```
/ (Home)
├── / (Hero + Introduction)
├── /projects (Showcase TETS)
│   ├── /projects/foxhound
│   ├── /projects/patriot
│   ├── /projects/codec
│   └── /projects/stinger
├── /skills (Habilidades Técnicas)
├── /experience (Experiencia Profesional)
├── /about (Sobre Mí)
└── /contact (Contacto)
```

---

## Wireframe Narrativo

### 1. Hero Section (/)
**Propósito:** Impacto inmediato, presentación profesional

**Elementos:**
- **Container:** Full viewport height, background con gradient sutil slate-900 → slate-800
- **Content:**
  - Avatar/Logo circular con borde glow dorado
  - Nombre: "David (Davo)" - Archivo 4rem bold
  - Título: "Senior SDET | QA Automation Engineer" - Space Grotesk 1.25rem
  - Tagline: "Building Quality Gates for Fintech" - italic, muted
  - Badges: `[SDET]` `[AUTOMATION]` `[FINTECH]` `[API TESTING]`
- **CTA Principal:** "View My Work" → scroll a projects
- **CTA Secundario:** "Download CV" → link externo
- **Fondo:** Partículas sutiles o grid pattern tech (CSS only, no canvas pesado)

**Responsivo:**
- Mobile: Stack vertical, avatar 80px, texto centrado
- Desktop: Layout horizontal, avatar 120px, texto alineado izquierda

### 2. Projects Showcase (/projects)
**Propósito:** Presentar los 4 frameworks de testing

**Elementos:**
- **Header:** "Tactical Espionage Testing Suite (TETS)" - Archivo 2.5rem
- **Subtitle:** "4 Frameworks. One Mission. Bulletproof Quality." - muted
- **Grid:** 2x2 en desktop, 1 column en mobile
- **Card Structure (cada framework):**
  ```
  ┌─────────────────────────────────────┐
  │ [Icon/Lottie Animation]            │
  │                                     │
  │ FOXHOUND                           │
  │ API Testing Framework              │
  │                                     │
  │ Brief description (2 líneas)       │
  │                                     │
  │ [Technologies: Python, pytest]      │
  │                                     │
  │ [GitHub] [Docs] [Demo]            │
  └─────────────────────────────────────┘
  ```
- **Hover Effect:** Card lift + border glow dorado + overlay con descripción extendida
- **Click:** Modal o página dedicada con:
  - Descripción completa
  - Arquitectura del framework
  - Ejemplos de uso
  - Métricas de cobertura
  - Screenshots/GIFs

**Responsivo:**
- Mobile: Cards apiladas verticalmente, full width
- Tablet: 2 columnas
- Desktop: 2x2 grid con gap consistente

### 3. Skills Section (/skills)
**Propósito:** Visualizar habilidades técnicas de forma dinámica

**Elementos:**
- **Container:** Background slate-800/50
- **Layout:** Grid de categorías
- **Categorías:**
  ```
  ┌──────────────┬──────────────┬──────────────┐
  │ Languages    │ Frameworks   │ Tools        │
  │ ─────────    │ ─────────    │ ─────────    │
  │ Python       │ pytest       │ Jenkins      │
  │ TypeScript   │ Selenium     │ Git          │
  │ SQL          │ Playwright   │ Docker       │
  │ Bash         │ RestAssured  │ AWS          │
  │ YAML         │ Behave       │ k6           │
  └──────────────┴──────────────┴──────────────┘
  
  ┌──────────────┬──────────────┬──────────────┐
  │ Methodologies│ Domains      │ Certs        │
  │ ─────────    │ ─────────    │ ─────────    │
  │ Agile/Scrum  │ Fintech      │ AWS SAA      │
  │ BDD          │ Payment Sys  │ ISTQB        │
  │ TDD          │ APIs         │              │
  │ CI/CD        │ Microservices│              │
  └──────────────┴──────────────┴──────────────┘
  ```
- **Item Rendering:** Cada skill como chip/badge con icono
- **Animation:** Fade-in stagger on scroll
- **Tooltip:** Hover para mostrar nivel de experiencia ( años/experto/avanzado)

**Responsivo:**
- Mobile: Categorías apiladas, 2 columnas de chips
- Desktop: Grid 3x2 de categorías

### 4. Experience Section (/experience)
**Propósito:** Timeline de carrera profesional

**Elementos:**
- **Layout:** Timeline vertical con línea central
- **Entry Structure:**
  ```
  ──●───────────────────────────────────────
    │ 2022 - Present
    │ Senior SDET @ Fintech Corp
    │ ─────────────────────────
    │ • Led API testing automation
    │ • Reduced regression time 60%
    │ • Mentored 3 junior engineers
    │ 
    │ [Technologies: Python, pytest, AWS]
  ──●───────────────────────────────────────
    │ 2019 - 2022
    │ QA Automation Engineer @ TechBank
    │ ─────────────────────────
    │ • Implemented BDD framework
    │ • 95% code coverage achieved
    │ • CI/CD pipeline optimization
  ──●───────────────────────────────────────
  ```
- **Entry Data (from BFF):**
  - company
  - role
  - period (start/end)
  - responsibilities[]
  - technologies[]
  - achievements[]

**Responsivo:**
- Mobile: Timeline simplificada, entries apiladas
- Desktop: Timeline central con entries alternando lados

### 5. About Section (/about)
**Propósito:** Filosofía de trabajo y enfoque profesional

**Elementos:**
- **Layout:** Dos columnas
- **Izquierda:** Quote/Philosophy
  > "Quality is not an act, it is a habit." - Aristotle
  > 
  > "I build quality gates, not just test cases."
- **Derecha:** Stats/Grid
  ```
  ┌─────────┬─────────┬─────────┐
  │ 8+      │ 50+     │ 95%     │
  │ Years   │ Projects│ Coverage│
  └─────────┴─────────┴─────────┘
  ```
- **Content:** Renderizado desde BFF con markdown

### 6. Contact Section (/contact)
**Propósito:** Facilitar conexión profesional

**Elementos:**
- **Container:** Background slate-900
- **Layout:** Centrado
- **Formulario (Opcional v1):**
  - Name
  - Email
  - Message
  - Submit button
- **Links Directos:**
  - LinkedIn
  - GitHub
  - Email
  - Calendly (si aplica)
- **CTA:** "Let's build something quality together"

---

## BFF API Design

### Base URL
```
https://api.davo.dev/v1
```

### Endpoints

#### Profile & CV
```yaml
GET /profile
  Response:
    name: "David (Davo)"
    title: "Senior SDET | QA Automation Engineer"
    tagline: "Building Quality Gates for Fintech"
    avatar: "https://..."
    location: "Remote / Latin America"
    years_experience: 8
    summary: "..."
    social:
      github: "https://github.com/davo"
      linkedin: "https://linkedin.com/in/davo"
      email: "davo@example.com"

GET /experience
  Response:
    - id: "exp-001"
      company: "Fintech Corp"
      role: "Senior SDET"
      period:
        start: "2022-01"
        end: null  # Present
      responsibilities:
        - "Led API testing automation strategy"
        - "Implemented contract testing with Pact"
        - "Reduced regression suite execution by 60%"
      technologies:
        - "Python"
        - "pytest"
        - "AWS"
        - "Docker"
      achievements:
        - "Zero production incidents for 12 months"

GET /skills
  Response:
    categories:
      - name: "Languages"
        items:
          - name: "Python"
            level: "expert"
            years: 8
          - name: "TypeScript"
            level: "advanced"
            years: 4
      - name: "Frameworks"
        items:
          - name: "pytest"
            level: "expert"
            years: 7
          - name: "Playwright"
            level: "advanced"
            years: 3
      # ... más categorías

GET /certifications
  Response:
    - name: "AWS Solutions Architect Associate"
      issuer: "Amazon"
      date: "2023-06"
      expiry: "2026-06"
      url: "https://..."
```

#### Projects (TETS)
```yaml
GET /projects
  Response:
    - id: "foxhound"
      name: "FOXHOUND"
      subtitle: "API Testing Framework"
      description: "..."
      icon: "foxhound-icon.svg"
      color: "#F59E0B"
      technologies:
        - "Python"
        - "pytest"
        - "requests"
        - "JSON Schema"
      stats:
        stars: 150
        forks: 45
        tests: "10,000+"
      links:
        github: "https://github.com/davo/foxhound"
        docs: "https://foxhound.davo.dev"

GET /projects/{id}
  Response:
    # Detalle completo del proyecto
    architecture: "..."
    features:
      - name: "Contract Testing"
        description: "..."
      - name: "Auto-generated Reports"
        description: "..."
    screenshots:
      - url: "https://..."
        caption: "Dashboard principal"
    demo:
      type: "gif"
      url: "https://..."

GET /projects/tets-overview
  Response:
    title: "Tactical Espionage Testing Suite"
    description: "..."
    philosophy: "..."
    frameworks:
      - id: "foxhound"
        role: "API Testing"
        mission: "Hunt down API vulnerabilities"
      - id: "patriot"
        role: "Web UI Testing"
        mission: "Protect web interfaces"
      - id: "codec"
        role: "Contract Testing"
        mission: "Decode integration contracts"
      - id: "stinger"
        role: "Mobile UI Testing"
        mission: "Sting mobile bugs"
```

#### Gateway Integration (Dynamic Status)
El BFF se conecta al Service Gateway para obtener estado en tiempo real. Si el gateway está offline, retorna datos estáticos sin errores.

```yaml
GET /projects/{id}/status
  Response:
    available: true              # gateway responde?
    gateway_url: "http://localhost:8000"
    health: "healthy"
    last_run: "2026-06-14T10:30:00Z"
    runs_today: 15
    success_rate: 94.5

  # Si gateway está offline:
  Response:
    available: false
    gateway_url: null
    health: null
    last_run: null
    runs_today: null
    success_rate: null
```

**Flujo de integración:**
```
Request: GET /projects/foxhound
    │
    ▼
┌─────────────────────────────────────┐
│  1. Cargar datos estáticos          │
│     (foxhound.json)                 │
│     → Siempre funciona              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  2. Intentar conectar al gateway    │
│     GET localhost:8000/api/v1/health│
│     → Timeout: 2 segundos          │
└──────────────┬──────────────────────┘
               │
        ┌──────┴──────┐
        │             │
     OK            FAIL
        │             │
        ▼             ▼
┌──────────────┐ ┌──────────────┐
│ status:      │ │ status:      │
│  available:  │ │  available:  │
│    true      │ │    false     │
│ health: "ok" │ │ health: null │
└──────────────┘ └──────────────┘
```

**Implementación BFF:**
```typescript
// routes/projects/status.ts

interface ProjectStatus {
  available: boolean;
  gateway_url: string | null;
  health: string | null;
  last_run: string | null;
  runs_today: number | null;
  success_rate: number | null;
}

async function getGatewayStatus(gatewayUrl: string): Promise<ProjectStatus> {
  try {
    const response = await fetch(`${gatewayUrl}/api/v1/health`, {
      signal: AbortSignal.timeout(2000)
    });
    const data = await response.json();
    return {
      available: true,
      gateway_url: gatewayUrl,
      health: data.status,
      last_run: null,
      runs_today: null,
      success_rate: null
    };
  } catch {
    return {
      available: false,
      gateway_url: null,
      health: null,
      last_run: null,
      runs_today: null,
      success_rate: null
    };
  }
}

fastify.get('/projects/:id/status', async (request, reply) => {
  const { id } = request.params;
  const project = await loadProjectData(id);
  
  if (!project) {
    return reply.code(404).send({ error: 'Project not found' });
  }
  
  const gatewayUrl = process.env.GATEWAY_URL || 'http://localhost:8000';
  const status = await getGatewayStatus(gatewayUrl);
  
  return status;
});
```

**Frontend (Astro):**
```astro
---
// pages/projects/foxhound.astro
const response = await fetch('https://api.davo.dev/v1/projects/foxhound');
const project = await response.json();
---

<Layout title={project.name}>
  <ProjectHero project={project} />
  
  {project.status.available ? (
    <LiveStatus status={project.status} />
  ) : (
    <OfflineNotice />
  )}
  
  <FeaturesList features={project.features} />
</Layout>
```

**Data File (static):**
```json
// bff/src/data/projects/foxhound.json
{
  "id": "foxhound",
  "name": "FOXHOUND",
  "subtitle": "API Testing Framework",
  "type": "api",
  "description": "Hunt down API vulnerabilities with precision",
  "icon": "foxhound-icon.svg",
  "color": "#F59E0B",
  "technologies": ["Python", "Playwright", "Behave", "Allure"],
  "features": [
    "Contract Testing",
    "Auto-generated Reports",
    "Docker Support",
    "API Gateway"
  ],
  "architecture": {
    "pattern": "Handler + Resources INI",
    "entry_point": "run_tests.py",
    "config": "api_resources.ini"
  },
  "stats": {
    "tests_executed": "10,000+",
    "coverage": "95%",
    "frameworks_tested": 25
  },
  "links": {
    "github": "https://github.com/davo/foxhound",
    "docs": "https://foxhound.davo.dev"
  }
}
```

#### Metadata
```yaml
GET /meta/technologies
  Response:
    - name: "Python"
      category: "language"
      icon: "python.svg"
    - name: "pytest"
      category: "framework"
      icon: "pytest.svg"

GET /meta/navigation
  Response:
    - label: "Home"
      path: "/"
      order: 1
    - label: "Projects"
      path: "/projects"
      order: 2
    - label: "Skills"
      path: "/skills"
      order: 3
    - label: "Experience"
      path: "/experience"
      order: 4
    - label: "About"
      path: "/about"
      order: 5
    - label: "Contact"
      path: "/contact"
      order: 6
```

### OpenAPI Specification
El BFF debe exponer su especificación OpenAPI en:
```
GET /openapi.json
GET /docs (Swagger UI)
```

---

## Proposed Solution

### Tech Stack Recomendado

#### Frontend
| Capa | Tecnología | Razón |
|------|------------|-------|
| **Framework** | **Astro** | SSG/SSR híbrido, island architecture, performance excepcional |
| **UI Components** | **React** (islands) | Componentes interactivos donde se necesiten |
| **Styling** | **Tailwind CSS** | Utility-first, dark mode nativo, responsiveness |
| **Icons** | **Lucide React** | Consistent, lightweight, SVG-based |
| **Typography** | **Google Fonts** | Archivo + Space Grotesk + JetBrains Mono |
| **Animations** | **Framer Motion** | Smooth, declarative, performant |
| **Icons** | **Simple Icons** | Brand logos oficiales |
| **SEO** | **Astro built-in** | Sitemap, robots.txt, meta tags nativos |
| **Schema.org** | **JSON-LD** | SEO semántico para Google |

**Por qué Astro:**
- **Performance:** SSG por defecto, JavaScript mínimo al cliente
- **Islands:** Solo las partes interactivas cargan JS
- **Framework agnostic:** Puedes usar React, Vue, Svelte o vanilla
- **Built-in:** Image optimization, RSS, sitemap, SEO
- **DX excelente:** HMR rápido, TypeScript out of the box

#### Backend (BFF)
| Capa | Tecnología | Razón |
|------|------------|-------|
| **Runtime** | **Node.js + TypeScript** | Type safety, JSON nativo, ecosistema rico |
| **Framework** | **Fastify** | 2x más rápido que Express, schema validation, plugin system |
| **API Spec** | **OpenAPI 3.1** | Contract-first, auto-generación de tipos |
| **Validation** | **JSON Schema + Ajv** | Validación robusta, alineada con OpenAPI |
| **Data Layer** | **JSON/YAML files** | Simple, versionable, sin DB overhead |
| **CORS** | **@fastify/cors** | Configuración flexible |
| **Rate Limiting** | **@fastify/rate-limit** | Protección contra abuse |
| **Security Headers** | **@fastify/helmet** | CSP, HSTS, X-Frame-Options |
| **Logging** | **pino** (built-in) | Logging estructurado y rápido |
| **Validation** | **validator.js** | Sanitización de input |

**Por qué Fastify:**
- Performance: 2-3x más rápido que Express
- Schema validation: Request/response validation automática
- TypeScript-first: Tipado completo
- Plugin architecture: Modular y extensible
- OpenAPI support: Plugins para auto-generar docs
- Security: Helmet integration para headers de seguridad

#### Deployment
| Servicio | Uso | Costo |
|----------|-----|-------|
| **Vercel** | Frontend (Astro) | Free tier (100GB bandwidth) |
| **Railway** | BFF (Fastify) | $5/mes |
| **Cloudflare** | CDN + DNS | Free |
| **GitHub** | Repositorio + Actions | Free |

**Alternativa Docker (100% gratis):**
```dockerfile
# Frontend
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# BFF
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

---

## Execution Plan

> **Nota:** Ejecutado por agente de AI de forma autónoma. No hay estimaciones de tiempo humano.

### Fase 0: Setup & Foundation
**Objetivo:** Estructura base del repositorio y tooling

| Tarea | Dependencias |
|-------|--------------|
| Inicializar monorepo (Turborepo + pnpm) | Ninguna |
| Configurar .editorconfig, .gitignore, CODEOWNERS | Ninguna |
| Setup ESLint + Prettier + Husky + lint-staged | Ninguna |
| Setup Astro + Tailwind + TypeScript | Ninguna |
| Setup Fastify + TypeScript + Health Check | Ninguna |
| Configurar GitHub Actions CI (lint, test, build) | Ninguna |
| Definir turbo.json con pipelines | Ninguna |
| Crear schemas JSON para validación de datos | Ninguna |

**Entregable:** Monorepo funcional con frontend y BFF separados

### Fase 1: BFF Core
**Objetivo:** Endpoints esenciales funcionando con validación

| Tarea | Dependencias |
|-------|--------------|
| Diseñar OpenAPI spec completa | Fase 0 |
| Crear data files (JSON) + schemas de validación | Fase 0 |
| Crear gateway.json con configuración del service gateway | Fase 0 |
| Implementar GET /profile | OpenAPI spec |
| Implementar GET /experience | OpenAPI spec |
| Implementar GET /skills | OpenAPI spec |
| Implementar GET /projects + GET /projects/:id | OpenAPI spec |
| Implementar GET /projects/:id/status (gateway integration) | OpenAPI spec, gateway.json |
| Implementar GET /certifications | OpenAPI spec |
| Implementar GET /health + /openapi.json | OpenAPI spec |
| Implementar POST /contact (honeypot + rate limit) | OpenAPI spec |
| Validación con JSON Schema en startup | Data files |
| Cache headers (ETag + Cache-Control) | Endpoints |
| Tests de contratos (Pact) | Endpoints |

**Entregable:** BFF con todos los endpoints, gateway integration y contratos testeados

### Fase 2: Frontend Foundation
**Objetivo:** Layout base y componentes atómicos

| Tarea | Dependencias |
|-------|--------------|
| Layout principal (Header, Footer, Nav responsive) | Fase 0 |
| Componente Badge/Chip | Layout |
| Componente Card | Layout |
| Componente Timeline | Layout |
| Componente Skill Grid | Layout |
| Dark mode setup (Tailwind) | Layout |
| Responsive breakpoints (375, 768, 1024, 1440) | Layout |

**Entregable:** Design system implementado, componentes reutilizables

### Fase 3: Pages Implementation
**Objetivo:** Todas las páginas funcionando

| Tarea | Dependencias |
|-------|--------------|
| Hero Section | Fase 2 |
| Projects Grid + Detail Modal | Fase 2, Fase 1 |
| Skills Section | Fase 2, Fase 1 |
| Experience Timeline | Fase 2, Fase 1 |
| About Section | Fase 2, Fase 1 |
| Contact Section (form + honeypot) | Fase 2, Fase 1 |
| Error handling + loading states | Todas las pages |
| Animaciones (Framer Motion) | Todas las pages |

**Entregable:** Todas las páginas renderizando datos desde BFF

### Fase 4: Polish & Optimization
**Objetivo:** Performance, accessibility, polish final

| Tarea | Dependencias |
|-------|--------------|
| Lighthouse optimization (>95) | Fase 3 |
| Accessibility audit (WCAG AA) + screen reader test | Fase 3 |
| Keyboard navigation + focus management | Fase 3 |
| SEO: meta tags, OG tags, schema.org JSON-LD | Fase 3 |
| SEO: sitemap.xml, robots.txt | Fase 3 |
| Font loading strategy (FOUT prevention) | Fase 3 |
| Image optimization pipeline | Fase 3 |
| Responsive testing (375, 768, 1024, 1440) | Fase 3 |

**Entregable:** Portal production-ready

### Fase 5: Launch
**Objetivo:** Deployment y monitoreo

| Tarea | Dependencias |
|-------|--------------|
| Docker Compose (frontend + BFF) | Fase 4 |
| Nginx config (SPA routing, gzip, cache) | Docker |
| DNS setup (Cloudflare) | Ninguna |
| SSL/HTTPS (Cloudflare free) | DNS |
| UptimeRobot monitor (free tier) | Deploy |
| GitHub Actions deploy workflow | Docker |
| Documentación de API pública | BFF |

**Entregable:** Portal live y monitoreado

---

## Deliverables

### Code
- [ ] Monorepo con estructura `/apps/frontend` y `/apps/bff`
- [ ] Frontend Astro con todas las páginas
- [ ] BFF Fastify con todos los endpoints
- [ ] Gateway integration con fallback graceful
- [ ] OpenAPI specification completa
- [ ] JSON Schemas para validación de datos
- [ ] Tests de contratos (Pact)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Docker Compose para deployment
- [ ] Nginx config para SPA routing

### Documentation
- [ ] README.md con setup instructions
- [ ] API documentation (Swagger UI)
- [ ] Architecture Decision Records (ADRs)
- [ ] .editorconfig
- [ ] CODEOWNERS
- [ ] Contributing guidelines

### Assets
- [ ] Logo/Avatar optimizado
- [ ] Icons para cada framework
- [ ] Screenshots/GIFs de proyectos
- [ ] CV descargable (PDF)

---

## Risks

| Riesgo | Probabilidad | Impacto | Score |
|--------|--------------|---------|-------|
| Scope creep en diseño | Alta | Medio | 🟡 |
| BFF se convierte en monolito | Media | Alto | 🔴 |
| Frontend acumula lógica de negocio | Media | Alto | 🔴 |
| Performance issues con many API calls | Baja | Medio | 🟢 |
| Deployment complexity | Baja | Bajo | 🟢 |
| Mantenimiento de dos codebases | Media | Medio | 🟡 |
| JSON files corruption | Baja | Alto | 🟡 |
| Free tier limits exceeded | Baja | Medio | 🟢 |
| AI agent errors en código | Media | Alto | 🔴 |

---

## Mitigations

| Riesgo | Mitigación |
|--------|------------|
| **Scope creep** | Definir MVP estricto, features futuras en backlog |
| **BFF monolito** | Modular por dominio (profile, projects, skills), plugins Fastify |
| **Lógica en frontend** | Code review estricto, lint rules, ADR-003 documentado |
| **Performance** | Cache headers, ETag validation, lazy loading de imágenes |
| **Deployment** | Docker Compose, scripts de deploy en Makefile |
| **Mantenimiento** | Shared types entre BFF y frontend, OpenAPI codegen |
| **JSON corruption** | JSON Schema validation en startup, git versioning, backups |
| **Free tier limits** | Monitoreo de uso, alerts en UptimeRobot, fallback a self-hosted |
| **AI agent errors** | Tests automatizados, CI pipeline, lint + typecheck obligatorios |

---

## Success Criteria

### Performance
- [ ] Lighthouse Performance > 95
- [ ] Lighthouse Accessibility > 95
- [ ] Lighthouse Best Practices > 95
- [ ] Lighthouse SEO > 95
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Total Blocking Time < 200ms

### Functionality
- [ ] Todos los datos se renderizan desde BFF (0 hardcode en frontend)
- [ ] Responsive en 375px, 768px, 1024px, 1440px
- [ ] Dark mode funciona correctamente
- [ ] Navegación intuitiva
- [ ] Contact form funciona con honeypot anti-spam
- [ ] Health check endpoint funciona
- [ ] OpenAPI docs accesibles en /docs

### Testing
- [ ] Contratos API testeados con Pact
- [ ] Frontend: Component tests > 80% coverage
- [ ] BFF: Endpoint tests > 90% coverage
- [ ] E2E tests para flujos críticos
- [ ] Visual regression testing (chromatic/free alternative)
- [ ] Accessibility testing automatizado (axe-core)
- [ ] Security headers validados

### Security
- [ ] CSP headers configurados
- [ ] Rate limiting activo
- [ ] Honeypot anti-spam funcional
- [ ] Input sanitization en todos los endpoints
- [ ] HTTPS forzado

### Observability
- [ ] Health check endpoint funcionando
- [ ] Request logging estructurado
- [ ] UptimeRobot monitoreando cada 5 minutos
- [ ] Error tracking configurado

### Gateway Integration
- [ ] GET /projects/:id/status retorna estado del gateway
- [ ] Fallback graceful cuando gateway está offline
- [ ] Timeout configurado (2 segundos)
- [ ] Frontend muestra LiveStatus o OfflineNotice según disponibilidad

---

## Future Improvements (Backlog)

### v1.1
- [ ] Blog section (MDX content desde BFF)
- [ ] Testimonios/References section
- [ ] Multi-language support (EN/ES)
- [ ] RSS feed para blog
- [ ] Umami analytics (self-hosted, gratis)

### v1.2
- [ ] Dashboard interactivo de métricas de testing
- [ ] Live demo de FOXHOUND integrada
- [ ] Newsletter signup (con Resend free tier: 100 emails/día)

### v2.0
- [ ] Admin panel para actualizar contenido
- [ ] Headless CMS integration (Strapi self-hosted, gratis)
- [ ] GraphQL endpoint (alternativo a REST)
- [ ] WebSocket para live updates

---

## Appendix

### Project Structure
```
davo-portfolio/
├── docs/                       # Documentación técnica
│   ├── ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   ├── DEPLOYMENT.md
│   ├── GATEWAY_INTEGRATION.md
│   └── DECISIONS.md
├── apps/
│   ├── frontend/              # Astro + React
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── atoms/     # Badge, Button, Icon
│   │   │   │   ├── molecules/ # Card, TimelineEntry
│   │   │   │   └── organisms/ # Header, Footer, Hero
│   │   │   ├── layouts/
│   │   │   ├── pages/
│   │   │   ├── styles/
│   │   │   ├──seo/            # OG tags, schema.org
│   │   │   └── utils/
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   ├── robots.txt
│   │   │   └── sitemap.xml
│   │   ├── astro.config.mjs
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   │
│   └── bff/                   # Fastify + TypeScript
│       ├── src/
│       │   ├── routes/
│       │   │   ├── profile.ts
│       │   │   ├── experience.ts
│       │   │   ├── skills.ts
│       │   │   ├── projects.ts
│       │   │   ├── projects-status.ts   # Gateway integration
│       │   │   ├── certifications.ts
│       │   │   ├── contact.ts
│       │   │   └── health.ts
│       │   ├── schemas/
│       │   ├── data/
│       │   │   ├── profile.json
│       │   │   ├── experience.json
│       │   │   ├── skills.json
│       │   │   ├── certifications.json
│       │   │   ├── navigation.json
│       │   │   ├── gateway.json         # Gateway URL config
│       │   │   └── projects/
│       │   │       ├── foxhound.json
│       │   │       ├── patriot.json
│       │   │       ├── codec.json
│       │   │       └── stinger.json
│       │   ├── plugins/
│       │   │   ├── security.ts
│       │   │   ├── cache.ts
│       │   │   └── rateLimit.ts
│       │   └── utils/
│       │       ├── logger.ts
│       │       └── validator.ts
│       ├── tests/
│       ├── Dockerfile
│       └── package.json
│
├── packages/
│   └── shared-types/          # Tipos compartidos (generated)
│
├── docker-compose.yml
├── Makefile
├── turbo.json
├── pnpm-workspace.yaml
├── .editorconfig
├── .gitignore
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── healthcheck.yml
├── package.json
└── README.md
```

### Monorepo Config

**pnpm-workspace.yaml:**
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

**turbo.json:**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    }
  }
}
```

### DX Tooling

**.editorconfig:**
```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

**Husky + lint-staged:**
```json
// package.json (root)
{
  "scripts": {
    "prepare": "husky install",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck",
    "build": "turbo run build"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,yaml,yml}": ["prettier --write"],
    "*.{md,css}": ["prettier --write"]
  }
}
```

**CODEOWNERS:**
```
# Default owner for everything
*       @davo

# BFF specific
/apps/bff/   @davo

# Frontend specific
/apps/frontend/ @davo

# Shared types
/packages/  @davo
```

### SEO

**Schema.org JSON-LD (Persona):**
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "David (Davo)",
  "jobTitle": "Senior SDET | QA Automation Engineer",
  "description": "Building Quality Gates for Fintech",
  "url": "https://davo.dev",
  "sameAs": [
    "https://github.com/davo",
    "https://linkedin.com/in/davo"
  ],
  "knowsAbout": [
    "Quality Assurance",
    "Test Automation",
    "API Testing",
    "Fintech",
    "Python",
    "TypeScript"
  ],
  "hasCredential": [
    {
      "@type": "EducationalOccupationalCredential",
      "name": "AWS Solutions Architect Associate",
      "credentialCategory": "certificate"
    }
  ]
}
```

**robots.txt:**
```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /health

Sitemap: https://davo.dev/sitemap.xml
```

**Meta Tags (Astro):**
```html
<!-- Primary Meta Tags -->
<title>David (Davo) - Senior SDET | QA Automation Engineer</title>
<meta name="title" content="David (Davo) - Senior SDET | QA Automation Engineer">
<meta name="description" content="Building Quality Gates for Fintech. Specialized in API Testing, Contract Testing, and Test Automation.">
<meta name="keywords" content="SDET, QA Automation, API Testing, Fintech, Python, TypeScript, Contract Testing">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://davo.dev/">
<meta property="og:title" content="David (Davo) - Senior SDET">
<meta property="og:description" content="Building Quality Gates for Fintech">
<meta property="og:image" content="https://davo.dev/og-image.png">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://davo.dev/">
<meta property="twitter:title" content="David (Davo) - Senior SDET">
<meta property="twitter:description" content="Building Quality Gates for Fintech">
<meta property="twitter:image" content="https://davo.dev/og-image.png">
```

### Performance

**Font Loading Strategy:**
```css
/* Preconnect to Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* FOUT prevention - show fallback text until font loads */
.font-display { font-display: swap; }
```

**Image Optimization:**
```typescript
// Astro Image component
import { Image } from 'astro:assets';
<Image
  src={avatar}
  alt="David (Davo)"
  width={120}
  height={120}
  loading="lazy"
  decoding="async"
  format="webp"
  quality={80}
/>
```

### Deployment

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: ./apps/frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - bff
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:80"]
      interval: 30s
      timeout: 3s
      retries: 3

  bff:
    build:
      context: ./apps/bff
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - CORS_ORIGIN=https://davo.dev
      - LOG_LEVEL=info
    volumes:
      - ./apps/bff/src/data:/app/src/data:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./apps/frontend/dist:/usr/share/nginx/html:ro
    depends_on:
      - frontend
      - bff
    restart: unless-stopped
```

**Makefile:**
```makefile
.PHONY: dev build test lint typecheck deploy

dev:
	docker-compose up

build:
	docker-compose build

test:
	pnpm run test

lint:
	pnpm run lint

typecheck:
	pnpm run typecheck

deploy:
	docker-compose down
	git pull
	docker-compose build
	docker-compose up -d

health:
	curl -f http://localhost:3000/health || exit 1
	curl -f http://localhost:80 || exit 1
```

### Environment Variables
```env
# Frontend
PUBLIC_API_URL=https://api.davo.dev/v1
PUBLIC_SITE_URL=https://davo.dev

# BFF
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://davo.dev
LOG_LEVEL=info

# Gateway Integration (optional)
GATEWAY_URL=http://localhost:8000
GATEWAY_TIMEOUT=2000
```

### Disaster Recovery

**Backup Strategy:**
- **Git:** Todos los datos versionados en git (source of truth)
- **Data files:** Respaldados en cada commit
- **No DB:** Sin riesgo de pérdida de datos persistentes
- **Rollback:** `git revert` + redeploy automático

**Rollback Procedure:**
```bash
# 1. Identificar último commit funcional
git log --oneline -10

# 2. Revertir cambios
git revert HEAD

# 3. Push y deploy automático
git push origin main

# 4. Verificar health check
curl -f https://api.davo.dev/v1/health
curl -f https://davo.dev
```

### Docs Structure
El proyecto mantiene una carpeta `/docs` con documentación técnica:

```
davo-portfolio/
├── docs/
│   ├── ARCHITECTURE.md          # Este documento (resumen ejecutivo)
│   ├── API_REFERENCE.md         # Endpoints, schemas, ejemplos
│   ├── DEPLOYMENT.md            # Docker, DNS, SSL, monitoreo
│   ├── GATEWAY_INTEGRATION.md   # Cómo se conecta al service gateway
│   └── DECISIONS.md             # ADRs y tradeoffs
├── apps/
│   ├── frontend/
│   └── bff/
└── ...
```

**Propósito de cada archivo:**
- `ARCHITECTURE.md`: Visión general para nuevos desarrolladores
- `API_REFERENCE.md`: Documentación completa de endpoints
- `DEPLOYMENT.md`: Guía paso a paso para deployar
- `GATEWAY_INTEGRATION.md`: Cómo el BFF se conecta al service gateway
- `DECISIONS.md`: Por qué se tomaron ciertas decisiones técnicas

---

**Documento generado por:** Lead Architect  
**Ejecutado por:** AI Agent (autónomo)  
**Última actualización:** 14 de Junio, 2026  
**Versión:** 2.1.0  
**Costo operativo:** $0/mes
