import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactBody {
  name: string;
  email: string;
  message: string;
  website?: string;
  formTimestamp?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body as ContactBody;

  if (body.website && body.website.length > 0) {
    return res.status(200).json({ success: true });
  }

  if (body.formTimestamp) {
    const submitTime = parseInt(body.formTimestamp, 10);
    if (Date.now() - submitTime < 3000) {
      return res.status(200).json({ success: true });
    }
  }

  if (!body.name || body.name.length > 100) {
    return res.status(400).json({ error: 'Invalid name' });
  }

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  if (!body.message || body.message.length > 2000) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  const sanitizedName = body.name.replace(/<[^>]*>/g, '');
  const sanitizedMessage = body.message.replace(/<[^>]*>/g, '');

  try {
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['drc412@gmail.com'],
      replyTo: body.email,
      subject: `Contact from ${sanitizedName}`,
      text: `Name: ${sanitizedName}\nEmail: ${body.email}\n\n${sanitizedMessage}`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
