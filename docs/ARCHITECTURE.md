# Architecture

> Resumen ejecutivo de la arquitectura del portfolio.

## Overview

Portal web personal y portafolio para David (Davo), Senior SDET y QA Automation Engineer especializado en Fintech.

**Arquitectura Core:** Backend for Frontend (BFF) + API First  
**Filosofía:** Frontend presentacional puro, sin lógica de negocio.  
**Costo Operativo:** $0/mes

## Componentes

```
┌─────────────────────────────────────────────────────────────────┐
│                    PORTFOLIO (lo que construimos)                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐  │
│  │  Frontend   │───▶│     BFF     │───▶│  JSON Data Files    │  │
│  │  (Astro)    │    │  (Fastify)  │    │  (profile, projects)│  │
│  │             │    │             │    └─────────────────────┘  │
│  │  /projects  │    │  GET /projects                           │
│  │  /skills    │    │  GET /skills                             │
│  │  /about     │    │  GET /profile                            │
│  └─────────────┘    └──────────────────────────────────────────┘
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
           │
           │ Solo links/referencias
           ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNO (no construimos esto)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Service Gateway (FastAPI) - localhost:8000              │   │
│  │  POST /api/v1/tests/run { type: "api" | "ui" | "cvc" }  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Capa | Tecnología | Razón |
|------|------------|-------|
| **Frontend** | Astro + React | SSG performance, island architecture |
| **Styling** | Tailwind CSS | Utility-first, dark mode |
| **BFF** | Fastify + TypeScript | Performance, type safety |
| **Data** | JSON files | Simple, versionable |
| **Deployment** | Docker + Nginx | Self-hosted, $0 cost |

## Decisiones Clave

1. **BFF Pattern:** Frontend no contiene lógica de negocio
2. **API First:** Contratos definidos antes de UI
3. **Static Data:** JSON files en vez de base de datos
4. **Gateway Integration:** Fallback graceful cuando gateway está offline

## Security

- CSP headers via @fastify/helmet
- Rate limiting (100/min general, 5/hour contact form)
- Honeypot anti-spam
- Input sanitization
- HTTPS forzado

## Performance

- Lighthouse score > 95
- SSG por defecto (Astro)
- ETag-based caching
- Font loading optimizado
