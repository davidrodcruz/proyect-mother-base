import type { FastifyInstance } from 'fastify';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

export async function projectsRoutes(fastify: FastifyInstance) {
  // Get all projects
  fastify.get('/projects', async (request, reply) => {
    try {
      const projectsDir = join(process.cwd(), 'src/data/projects');
      const files = readdirSync(projectsDir).filter(f => f.endsWith('.json'));
      
      const projects = files.map(file => {
        const data = readFileSync(join(projectsDir, file), 'utf-8');
        return JSON.parse(data);
      });

      return projects;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to load projects data' });
    }
  });

  // Get single project by ID
  fastify.get('/projects/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const filePath = join(process.cwd(), `src/data/projects/${id}.json`);
      
      const data = readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      fastify.log.error(error);
      return reply.code(404).send({ error: 'Project not found' });
    }
  });

  // Get TETS overview
  fastify.get('/projects/tets-overview', async (request, reply) => {
    try {
      const projectsDir = join(process.cwd(), 'src/data/projects');
      const files = readdirSync(projectsDir).filter(f => f.endsWith('.json'));
      
      const frameworks = files.map(file => {
        const data = readFileSync(join(projectsDir, file), 'utf-8');
        const project = JSON.parse(data);
        return {
          id: project.id,
          role: project.subtitle,
          mission: project.description.split('.')[0],
        };
      });

      return {
        title: 'Tactical Espionage Testing Suite',
        description: '4 Frameworks. One Mission. Bulletproof Quality.',
        philosophy: 'I build quality gates, not just test cases.',
        frameworks,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to load TETS overview' });
    }
  });
}
