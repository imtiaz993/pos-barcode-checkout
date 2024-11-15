import { createProxyMiddleware } from 'http-proxy-middleware';

export default createProxyMiddleware({
  target: 'http://34.102.44.108:8000',
  changeOrigin: true,
  secure: false,
});
