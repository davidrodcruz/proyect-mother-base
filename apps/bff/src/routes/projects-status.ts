import type { FastifyInstance } from 'fastify';
import { readFileSync } from 'fs';
import { join } from 'path';

interface ProjectStatus {
  available: boolean;
  gateway_url: string | null;
  health: string | null;
  last_run: string | null;
  runs_today: number | null;
  success_rate: number | null;
}

async function getGatewayStatus(gatewayUrl: string, timeoutMs: number): Promise<ProjectStatus> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(`${gatewayUrl}/api/v1/health`, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Gateway responded with status ${response.status}`);
    }

    return {
      available: true,
      gateway_url: gatewayUrl,
      health: 'healthy',
      last_run: null,
      runs_today: null,
      success_rate: null,
    };
  } catch {
    return {
      available: false,
      gateway_url: null,
      health: null,
      last_run: null,
      runs_today: null,
      success_rate: null,
    };
  }
}

export async function projectStatusRoutes(fastify: FastifyInstance) {
  fastify.get('/projects/:id/status', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      // Check if project exists
      const filePath = join(process.cwd(), `src/data/projects/${id}.json`);
      try {
        readFileSync(filePath, 'utf-8');
      } catch {
        return reply.code(404).send({ error: 'Project not found' });
      }

      // Load gateway config
      const gatewayConfig = JSON.parse(
        readFileSync(join(process.cwd(), 'src/data/gateway.json'), 'utf-8')
      );

      const gatewayUrl = process.env.GATEWAY_URL || gatewayConfig.url;
      const timeoutMs = parseInt(process.env.GATEWAY_TIMEOUT || String(gatewayConfig.timeout_ms), 10);

      // Get gateway status
      const status = await getGatewayStatus(gatewayUrl, timeoutMs);

      return status;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ error: 'Failed to get project status' });
    }
  });
}
