import type { FastifyInstance } from 'fastify';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function certificationsRoutes(fastify: FastifyInstance) {
  fastify.get('/certifications', async (request, reply) => {
    try {
      const data = readFileSync(join(process.cwd(), 'src/data/certifications.json'), 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to load certifications data' });
    }
  });
}
