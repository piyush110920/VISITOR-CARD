import { createProxyMiddleware } from 'http-proxy-middleware';

const n8nWebhookUrl = 'http://ai.senselive.io:5678/webhook-test/senselive-visitor-card';

const proxy = createProxyMiddleware({
  target: n8nWebhookUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/upload': '/', // Rewrite the path to match the webhook
  },
  onProxyReq: (proxyReq) => {
    // You can add or remove headers here if needed
    proxyReq.setHeader('x-forwarded-host', 'ai.senselive.io:5678');
  },
});

export default proxy;