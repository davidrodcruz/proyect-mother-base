import type { FastifyInstance } from 'fastify';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function navigationRoutes(fastify: FastifyInstance) {
  fastify.get('/navigation', async (request, reply) => {
    try {
      const data = readFileSync(join(process.cwd(), 'src/data/navigation.json'), 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to load navigation data' });
    }
  });
}
