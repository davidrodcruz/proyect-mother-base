# David (Davo) Portfolio

> Personal portfolio and CV for David (Davo), Senior SDET | QA Automation Engineer.

## Overview

A modern, performant portfolio website built with Astro and Fastify, showcasing the Tactical Espionage Testing Suite (TETS).

## Tech Stack

- **Frontend:** Astro + React + Tailwind CSS
- **BFF:** Fastify + TypeScript
- **Data:** JSON files with validation
- **Deployment:** Docker + Nginx

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+

### Development

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev
```

- Frontend: http://localhost:4321
- BFF: http://localhost:3000

### Docker

```bash
# Build and run
docker compose up -d

# Verify
curl http://localhost:3000/api/v1/health
```

## Project Structure

```
davo-portfolio/
├── apps/
│   ├── frontend/      # Astro + React
│   └── bff/           # Fastify + TypeScript
├── packages/
│   └── shared-types/  # Shared TypeScript types
├── docs/              # Documentation
└── docker-compose.yml
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API_REFERENCE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Gateway Integration](docs/GATEWAY_INTEGRATION.md)
- [Decisions](docs/DECISIONS.md)

## License

MIT
