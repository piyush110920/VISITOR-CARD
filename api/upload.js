import { createReadStream } from 'fs';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  try {
    const n8nWebhookUrl = 'http://ai.senselive.io:5678/webhook/senselive-visitor-card';

    // 1. Manually read the incoming request body from the stream
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const body = Buffer.concat(chunks);

    // 2. Prepare headers for the forwarded request
    const forwardedHeaders = { ...req.headers };

    // Delete problematic headers that can cause issues with Vercel's proxy
    delete forwardedHeaders.host;
    delete forwardedHeaders['content-length'];

    // 3. Forward the request to n8n
    const response = await fetch(n8nWebhookUrl, {
      method: req.method,
      headers: forwardedHeaders,
      body: body,
    });

    // 4. Send the n8n response back to the client
    const responseData = await response.arrayBuffer();
    const contentType = response.headers.get('content-type');

    res.setHeader('Content-Type', contentType || 'application/octet-stream');
    res.status(response.status).send(Buffer.from(responseData));

  } catch (error) {
    // 5. Log the specific error to the console for debugging
    console.error('Proxy forwarding error:', error);
    res.status(500).json({ error: 'Proxy request failed', details: error.message });
  }
}