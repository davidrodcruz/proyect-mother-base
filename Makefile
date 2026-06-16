.PHONY: dev build test lint typecheck deploy health clean

# Development
dev:
	pnpm dev

# Build
build:
	pnpm build

# Test
test:
	pnpm test

# Lint
lint:
	pnpm lint

# TypeCheck
typecheck:
	pnpm typecheck

# Docker
docker-build:
	docker compose build

docker-up:
	docker compose up -d

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

# Deploy
deploy: docker-down
	git pull
	docker compose build
	docker compose up -d

# Health
health:
	curl -f http://localhost:3000/api/v1/health || exit 1
	curl -f http://localhost:80 || exit 1

# Clean
clean:
	rm -rf node_modules
	rm -rf apps/frontend/node_modules
	rm -rf apps/bff/node_modules
	rm -rf packages/shared-types/node_modules
	rm -rf apps/frontend/dist
	rm -rf apps/bff/dist
	rm -rf packages/shared-types/dist
	rm -rf .turbo

# Install
install:
	pnpm install
