import type { FastifyInstance } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (request, reply) => {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      checks: {
        dataFiles: 'ok',
        memory: process.memoryUsage().heapUsed < process.memoryUsage().heapTotal * 0.8 ? 'ok' : 'warning',
      },
    };
  });
}
