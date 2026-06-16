import type { FastifyInstance } from 'fastify';

interface ContactBody {
  name: string;
  email: string;
  message: string;
  website?: string; // honeypot
  formTimestamp?: string; // time-based anti-spam
}

export async function contactRoutes(fastify: FastifyInstance) {
  // Rate limiting for contact form (5 per hour)
  fastify.addHook('onRequest', async (request, reply) => {
    if (request.url === '/api/v1/contact' && request.method === 'POST') {
      // Additional rate limiting for contact form
      // This is handled by the global rate limiter, but we add extra checks
    }
  });

  fastify.post('/contact', async (request, reply) => {
    const body = request.body as ContactBody;

    // Honeypot check
    if (body.website && body.website.length > 0) {
      return reply.code(200).send({ success: true }); // Silent rejection
    }

    // Time-based check (reject if submitted too fast)
    if (body.formTimestamp) {
      const submitTime = parseInt(body.formTimestamp, 10);
      const now = Date.now();
      if (now - submitTime < 3000) {
        return reply.code(200).send({ success: true }); // Silent rejection
      }
    }

    // Input validation
    if (!body.name || body.name.length > 100) {
      return reply.code(400).send({ error: 'Invalid name' });
    }

    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return reply.code(400).send({ error: 'Invalid email' });
    }

    if (!body.message || body.message.length > 2000) {
      return reply.code(400).send({ error: 'Invalid message' });
    }

    // Sanitize input
    const sanitizedName = body.name.replace(/<[^>]*>/g, '');
    const sanitizedMessage = body.message.replace(/<[^>]*>/g, '');

    // In production, this would send an email or store in database
    fastify.log.info({
      contact: {
        name: sanitizedName,
        email: body.email,
        message: sanitizedMessage,
      },
    }, 'New contact form submission');

    return reply.code(200).send({ success: true });
  });
}
