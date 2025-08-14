const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Apply routes from routes.js
routes.forEach(({ path, target }) => {
  app.use(path, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: { [`^${path}`]: '' }
  }));
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});