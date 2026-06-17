import type { APIRoute } from 'astro';

import profileData from '../../../data/api/profile.json';
import skillsData from '../../../data/api/skills.json';
import experienceData from '../../../data/api/experience.json';
import certificationsData from '../../../data/api/certifications.json';
import navigationData from '../../../data/api/navigation.json';
import gatewayConfig from '../../../data/api/gateway.json';
import codecProject from '../../../data/api/projects/codec.json';
import foxhoundProject from '../../../data/api/projects/foxhound.json';
import patriotProject from '../../../data/api/projects/patriot.json';
import stingerProject from '../../../data/api/projects/stinger.json';

const projectsList = [foxhoundProject, patriotProject, stingerProject, codecProject] as Array<{
  id: string; subtitle: string; description: string; [key: string]: unknown;
}>;

const staticData: Record<string, unknown> = {
  profile: profileData,
  skills: skillsData,
  experience: experienceData,
  certifications: certificationsData,
  navigation: navigationData,
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

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

export const GET: APIRoute = async ({ params }) => {
  const segments = params.path ? params.path.split('/').filter(Boolean) : [];
  const [resource, ...rest] = segments;

  if (!resource) return json({ error: 'Not found' }, 404);

  if (resource === 'health') {
    return json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
      checks: { dataFiles: 'ok' },
    });
  }

  if (resource === 'projects') {
    if (rest.length === 0) return json(projectsList);

    if (rest.length === 1) {
      if (rest[0] === 'tets-overview') {
        const frameworks = projectsList.map(p => ({
          id: p.id,
          role: p.subtitle,
          mission: p.description.split('.')[0],
        }));
        return json({
          title: 'Tactical Espionage Testing Suite',
          description: '4 Frameworks. One Mission. Bulletproof Quality.',
          philosophy: 'I build quality gates, not just test cases.',
          frameworks,
        });
      }

      const project = projectsList.find(p => p.id === rest[0]);
      if (project) return json(project);
      return json({ error: 'Project not found' }, 404);
    }

    if (rest.length === 2 && rest[1] === 'status') {
      const found = projectsList.some(p => p.id === rest[0]);
      if (!found) return json({ error: 'Project not found' }, 404);

      const gw = (gatewayConfig as { url: string; timeout_ms: number });
      const gatewayUrl = process.env.GATEWAY_URL || gw.url;
      const timeoutMs = parseInt(process.env.GATEWAY_TIMEOUT || String(gw.timeout_ms), 10);
      const status = await getGatewayStatus(gatewayUrl, timeoutMs);
      return json(status);
    }

    return json({ error: 'Not found' }, 404);
  }

  if (staticData[resource]) return json(staticData[resource]);

  return json({ error: 'Not found' }, 404);
};

export const POST: APIRoute = async ({ params, request }) => {
  const segments = params.path ? params.path.split('/').filter(Boolean) : [];
  const [resource, ...rest] = segments;

  if (resource === 'contact' && rest.length === 0) {
    const body = await request.json().catch(() => ({}));
    const { name, email, message, website, formTimestamp } = body;

    if (website && website.length > 0) return json({ success: true });

    if (formTimestamp) {
      const submitTime = parseInt(formTimestamp, 10);
      if (Date.now() - submitTime < 3000) return json({ success: true });
    }

    if (!name || name.length > 100) return json({ error: 'Invalid name' }, 400);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Invalid email' }, 400);
    if (!message || message.length > 2000) return json({ error: 'Invalid message' }, 400);

    console.log('Contact form submission:', {
      name: name.replace(/<[^>]*>/g, ''),
      email,
      message: message.replace(/<[^>]*>/g, ''),
    });
    return json({ success: true });
  }

  return json({ error: 'Not found' }, 404);
};

export const prerender = false;
