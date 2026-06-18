import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  const { name, email, message, website, formTimestamp } = body;

  if (website && website.length > 0) {
    return res.status(200).json({ success: true });
  }

  if (formTimestamp) {
    const submitTime = parseInt(formTimestamp, 10);
    if (Date.now() - submitTime < 3000) {
      return res.status(200).json({ success: true });
    }
  }

  if (!name || name.length > 100) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (!message || message.length > 2000) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  const sanitizedName = name.replace(/<[^>]*>/g, '');
  const sanitizedMessage = message.replace(/<[^>]*>/g, '');

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: ['drc412@gmail.com'],
      replyTo: email,
      subject: `Contact from ${sanitizedName}`,
      text: `Name: ${sanitizedName}\nEmail: ${email}\n\n${sanitizedMessage}`,
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
