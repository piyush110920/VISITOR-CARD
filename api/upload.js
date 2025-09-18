import { createProxyMiddleware } from 'http-proxy-middleware';

const n8nWebhookUrl = 'http://ai.senselive.io:5678/webhook-test/senselive-visitor-card';

const proxy = createProxyMiddleware({
  target: n8nWebhookUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api/upload': '/',
  },
});

export default proxy;

export const config = {
  api: {
    bodyParser: false,
  },
};