import type { FastifyInstance } from 'fastify';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function skillsRoutes(fastify: FastifyInstance) {
  fastify.get('/skills', async (request, reply) => {
    try {
      const data = readFileSync(join(process.cwd(), 'src/data/skills.json'), 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to load skills data' });
    }
  });
}
