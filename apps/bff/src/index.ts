import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { createJsonRoute } from './lib/data-loader.js';
import { projectsRoutes } from './routes/projects.js';
import { healthRoutes } from './routes/health.js';
import { contactRoutes } from './routes/contact.js';
import { projectStatusRoutes } from './routes/projects-status.js';

const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
      level: (label) => ({ level: label }),
      bindings: (bindings) => ({
        pid: bindings.pid,
        hostname: bindings.hostname,
        service: 'davo-portfolio-bff',
      }),
    },
    timestamp: true,
  },
});

// Security
await app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", process.env.GATEWAY_URL || 'http://localhost:8000'],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});

// CORS
await app.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:4321',
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  maxAge: 86400,
});

// Rate limiting
await app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
  errorResponseBuilder: () => ({
    error: 'Too Many Requests',
    message: 'Rate limit exceeded, try again later',
  }),
});

// Routes — JSON data files
createJsonRoute(app, '/api/v1/profile', 'profile.json', 'profile');
createJsonRoute(app, '/api/v1/experience', 'experience.json', 'experience');
createJsonRoute(app, '/api/v1/skills', 'skills.json', 'skills');
createJsonRoute(app, '/api/v1/certifications', 'certifications.json', 'certifications');
createJsonRoute(app, '/api/v1/navigation', 'navigation.json', 'navigation');

// Routes — custom handlers
await app.register(projectsRoutes, { prefix: '/api/v1' });
await app.register(healthRoutes, { prefix: '/api/v1' });
await app.register(contactRoutes, { prefix: '/api/v1' });
await app.register(projectStatusRoutes, { prefix: '/api/v1' });

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await app.listen({ port, host });
    app.log.info(`Server running on http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
