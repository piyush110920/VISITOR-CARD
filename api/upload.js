import { createProxyMiddleware } from 'http-proxy-middleware';

// The URL of your n8n webhook
const n8nWebhookUrl = 'http://ai.senselive.io:5678/webhook-test/senselive-visitor-card';

const proxy = createProxyMiddleware({
  target: n8nWebhookUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/upload': '/', // Rewrites the URL path from /api/upload to /
  },
  onProxyReq: (proxyReq) => {
    // Add custom headers if necessary
    proxyReq.setHeader('x-forwarded-host', 'ai.senselive.io:5678');
  },
});

export default proxy;