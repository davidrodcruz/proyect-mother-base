# Deployment

> Guía completa para deployar el portfolio.

## Prerrequisitos

- Docker 20.10+
- Docker Compose 2.0+
- Git

## Desarrollo Local

### Instalar dependencias

```bash
# Clonar repositorio
git clone https://github.com/davo/davo-portfolio.git
cd davo-portfolio

# Instalar dependencias
pnpm install
```

### Ejecutar en desarrollo

```bash
# Frontend (http://localhost:4321)
pnpm --filter @davo/frontend dev

# BFF (http://localhost:3000)
pnpm --filter @davo/bff dev

# O ambos juntos
pnpm dev
```

## Docker

### Construir imágenes

```bash
docker compose build
```

### Ejecutar

```bash
docker compose up -d
```

### Verificar

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Frontend
curl http://localhost:80
```

### Logs

```bash
docker compose logs -f
```

### Detener

```bash
docker compose down
```

## DNS & SSL

### Cloudflare (Recomendado)

1. Crear cuenta en Cloudflare
2. Agregar dominio
3. Configurar nameservers en el registrar
4. Habilitar SSL (Full - Strict)

### DNS Records

```
Type  Name  Content      Proxy
A     @     <server-ip>  Yes
CNAME www   davo.dev     Yes
```

## Monitoreo

### UptimeRobot (Gratis)

1. Crear cuenta en UptimeRobot
2. Agregar monitor HTTP
3. URL: `https://davo.dev/api/v1/health`
4. Intervalo: 5 minutos

### GitHub Actions Health Check

El workflow `.github/workflows/healthcheck.yml` ejecuta health checks cada hora.

## Rollback

```bash
# 1. Identificar último commit funcional
git log --oneline -10

# 2. Revertir cambios
git revert HEAD

# 3. Push y deploy automático
git push origin main

# 4. Verificar
curl -f https://api.davo.dev/v1/health
curl -f https://davo.dev
```

## Troubleshooting

### BFF no levanta

```bash
# Ver logs
docker compose logs bff

# Verificar puerto
netstat -ano | findstr :3000
```

### Frontend no carga estilos

```bash
# Rebuild sin caché
docker compose build --no-cache frontend
```

### Gateway no responde

El BFF funciona sin gateway. Los endpoints de status retornan `available: false`.
