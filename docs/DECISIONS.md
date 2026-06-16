# Architecture Decision Records

> Decisiones de arquitectura y tradeoffs.

## ADR-001: BFF Pattern

**Decisión:** Implementar Backend for Frontend como capa intermedia.

**Razón:**
- Desacopla completamente el frontend del backend
- Habilita el portal como lab de pruebas para contratos
- Permite integración opcional con service gateway

**Tradeoff:**
-增加了 una capa adicional de complejidad
- Ganamos flexibilidad y testing capabilities

---

## ADR-002: API First

**Decisión:** Definir contratos OpenAPI antes de implementar UI.

**Razón:**
- Desarrollo paralelo
- Testing temprano de contratos
- Frontend se convierte en consumidor puro

**Tradeoff:**
- Requiere disciplina en diseño de APIs
- Reduce friction en desarrollo

---

## ADR-003: Frontend Presentacional

**Decisión:** Frontend sin estado de negocio, solo renderiza datos del BFF.

**Razón:**
- Alineado con objetivo de usar el portal como canvas para testing
- Separación limpia de responsabilidades

**Tradeoff:**
- Más llamadas a API
- Ganamos testing surface y separación limpia

---

## ADR-004: Static Data Layer

**Decisión:** Datos estáticos (JSON) alimentados al BFF, no base de datos relacional.

**Razón:**
- Para portfolio personal, DB no está justificada
- Simple, versionable, sin DB overhead

**Tradeoff:**
- Menos flexibilidad para datos dinámicos
- Simplifica despliegue y mantenimiento

---

## ADR-005: Data Validation & Versioning

**Decisión:** JSON Schema para validación + git-based versioning.

**Razón:**
- Garantiza integridad de datos sin DB
- Version control automático

**Tradeoff:**
- Requiere disciplina al editar JSON
- Ganamos trazabilidad

---

## ADR-006: Cache Strategy

**Decisión:** ETag-based caching + Cache-Control headers.

**Razón:**
- Mínimo overhead
- Funciona con cualquier CDN gratuito

**Tradeoff:**
- Invalidación manual al actualizar datos
- Simplificado con git push

---

## ADR-007: Gateway Integration

**Decisión:** Integración opcional con service gateway vía fallback graceful.

**Razón:**
- Portfolio funciona sin gateway
- Muestra capabilities de testing cuando gateway está disponible

**Tradeoff:**
- Complejidad adicional en BFF
- Mejor experiencia de usuario

---

## ADR-008: Docker Deployment

**Decisión:** Docker Compose para deployment self-hosted.

**Razón:**
- $0 coste operativo
- Control total sobre infraestructura
- Reproducible

**Tradeoff:**
- Requiere servidor propio
- Más mantenimiento que SaaS
