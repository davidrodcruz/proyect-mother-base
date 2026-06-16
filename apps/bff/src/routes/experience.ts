import type { FastifyInstance } from 'fastify';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function experienceRoutes(fastify: FastifyInstance) {
  fastify.get('/experience', async (request, reply) => {
    try {
      const data = readFileSync(join(process.cwd(), 'src/data/experience.json'), 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to load experience data' });
    }
  });
}
