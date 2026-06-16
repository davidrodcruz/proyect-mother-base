# Gateway Integration

> Cómo el BFF se conecta al Service Gateway.

## Overview

El BFF del portfolio puede conectarse al Service Gateway (FastAPI) para obtener estado en tiempo real de los frameworks de testing.

**Importante:** El BFF funciona sin gateway. La integración es opcional.

## Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                    BFF (Fastify)                                 │
│                    api.davo.dev/v1                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  GET /projects/:id/status                                        │
│       │                                                          │
│       ▼                                                          │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  1. Cargar datos estáticos (foxhound.json)              │    │
│  │  2. Intentar conectar al gateway (2s timeout)           │    │
│  │  3. Retornar status (available: true/false)             │    │
│  └─────────────────────────────────────────────────────────┘    │
│       │                                                          │
│       ▼                                                          │
│  GET localhost:8000/api/v1/health                                │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
           │
           │ Si gateway está offline
           ▼
┌─────────────────────────────────────────────────────────────────┐
│  Response:                                                       │
│  {                                                               │
│    "available": false,                                           │
│    "gateway_url": null,                                          │
│    "health": null                                                │
│  }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Configuración

### gateway.json

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

### Environment Variables

```env
GATEWAY_URL=http://localhost:8000
GATEWAY_TIMEOUT=2000
```

## Implementación

```typescript
// routes/projects-status.ts

async function getGatewayStatus(gatewayUrl: string, timeoutMs: number) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(`${gatewayUrl}/api/v1/health`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Gateway responded with status ${response.status}`);
    }

    return {
      available: true,
      gateway_url: gatewayUrl,
      health: 'healthy',
      last_run: null,
      runs_today: null,
      success_rate: null,
    };
  } catch {
    return {
      available: false,
      gateway_url: null,
      health: null,
      last_run: null,
      runs_today: null,
      success_rate: null,
    };
  }
}
```

## Frontend

```astro
---
// pages/projects/[id].astro
const statusRes = await fetch(`${API_URL}/api/v1/projects/${id}/status`);
const status = await statusRes.json();
---

{status.available ? (
  <div class="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
    <span class="text-green-400">Gateway Online</span>
  </div>
) : (
  <div class="bg-slate-500/10 border border-slate-500/30 p-4 rounded-lg">
    <span class="text-slate-400">Gateway Offline</span>
  </div>
)}
```

## Gateway Endpoints

El gateway (FastAPI) debe exponer:

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/health` | GET | Health check |
| `/api/v1/tests/run` | POST | Ejecutar tests |
| `/api/v1/tests/run/:id` | GET | Estado de ejecución |
| `/api/v1/tests/run/:id/report` | GET | Descargar reporte |
