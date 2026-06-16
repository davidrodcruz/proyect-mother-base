import type { FastifyInstance } from 'fastify';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function profileRoutes(fastify: FastifyInstance) {
  fastify.get('/profile', async (request, reply) => {
    try {
      const data = readFileSync(join(process.cwd(), 'src/data/profile.json'), 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to load profile data' });
    }
  });
}
