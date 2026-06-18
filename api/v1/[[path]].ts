import type { VercelRequest, VercelResponse } from '@vercel/node';

import profileData from '../data/profile.json';
import skillsData from '../data/skills.json';
import experienceData from '../data/experience.json';
import certificationsData from '../data/certifications.json';
import navigationData from '../data/navigation.json';
import gatewayConfig from '../data/gateway.json';
import codecProject from '../data/projects/codec.json';
import foxhoundProject from '../data/projects/foxhound.json';
import patriotProject from '../data/projects/patriot.json';
import stingerProject from '../data/projects/stinger.json';

const projectsList = [foxhoundProject, patriotProject, stingerProject, codecProject] as Array<{
  id: string; subtitle: string; description: string; [key: string]: unknown
}>;

const staticData: Record<string, unknown> = {
  profile: profileData,
  skills: skillsData,
  experience: experienceData,
  certifications: certificationsData,
  navigation: navigationData,
};

async function getGatewayStatus(gatewayUrl: string, timeoutMs: number) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    const response = await fetch(`${gatewayUrl}/api/v1/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`Gateway responded with status ${response.status}`);
    return { available: true, gateway_url: gatewayUrl, health: 'healthy', last_run: null, runs_today: null, success_rate: null };
  } catch {
    return { available: false, gateway_url: null, health: null, last_run: null, runs_today: null, success_rate: null };
  }
}

function sendJSON(res: VercelResponse, status: number, data: unknown) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(status).json(data);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { path } = req.query;
  const segments: string[] = Array.isArray(path) ? path : path ? [path] : [];
  const [resource, ...rest] = segments;

  try {
    switch (req.method) {
      case 'GET': {
        if (!resource) {
          return sendJSON(res, 404, { error: 'Not found' });
        }

        if (resource === 'health') {
          return sendJSON(res, 200, {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            uptime: process.uptime(),
            checks: { dataFiles: 'ok' },
          });
        }

        if (resource === 'projects') {
          if (rest.length === 0) {
            return sendJSON(res, 200, projectsList);
          }

          if (rest.length === 1) {
            if (rest[0] === 'tets-overview') {
              const frameworks = projectsList.map(p => ({
                id: p.id,
                role: p.subtitle,
                mission: p.description.split('.')[0],
              }));
              return sendJSON(res, 200, {
                title: 'Tactical Espionage Testing Suite',
                description: '4 Frameworks. One Mission. Bulletproof Quality.',
                philosophy: 'I build quality gates, not just test cases.',
                frameworks,
              });
            }

            const project = projectsList.find(p => p.id === rest[0]);
            if (project) return sendJSON(res, 200, project);
            return sendJSON(res, 404, { error: 'Project not found' });
          }

          if (rest.length === 2 && rest[1] === 'status') {
            const found = projectsList.some(p => p.id === rest[0]);
            if (!found) return sendJSON(res, 404, { error: 'Project not found' });

            const gatewayUrl = process.env.GATEWAY_URL || (gatewayConfig as { url: string; timeout_ms: number }).url;
            const timeoutMs = parseInt(process.env.GATEWAY_TIMEOUT || String((gatewayConfig as { url: string; timeout_ms: number }).timeout_ms), 10);
            const status = await getGatewayStatus(gatewayUrl, timeoutMs);
            return sendJSON(res, 200, status);
          }

          return sendJSON(res, 404, { error: 'Not found' });
        }

        if (staticData[resource]) {
          return sendJSON(res, 200, staticData[resource]);
        }

        return sendJSON(res, 404, { error: 'Not found' });
      }

      case 'POST': {
        if (resource === 'contact' && rest.length === 0) {
          const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
          const { name, email, message, website, formTimestamp } = body;

          if (website && website.length > 0) {
            return sendJSON(res, 200, { success: true });
          }

          if (formTimestamp) {
            const submitTime = parseInt(formTimestamp, 10);
            if (Date.now() - submitTime < 3000) {
              return sendJSON(res, 200, { success: true });
            }
          }

          if (!name || name.length > 100) {
            return sendJSON(res, 400, { error: 'Invalid name' });
          }
          if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return sendJSON(res, 400, { error: 'Invalid email' });
          }
          if (!message || message.length > 2000) {
            return sendJSON(res, 400, { error: 'Invalid message' });
          }

          console.log('Contact form submission:', { name: name.replace(/<[^>]*>/g, ''), email, message: message.replace(/<[^>]*>/g, '') });
          return sendJSON(res, 200, { success: true });
        }

        return sendJSON(res, 404, { error: 'Not found' });
      }

      default:
        return sendJSON(res, 405, { error: 'Method not allowed' });
    }
  } catch (error) {
    console.error(error);
    return sendJSON(res, 500, { error: 'Internal server error' });
  }
}
