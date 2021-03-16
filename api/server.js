const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors')

const app = express();
const PORT = 3000;
const HOST = "0.0.0.0";
const API_SERVICE_URL = "https://api.onzo.io/engagement/v2";

app.options('*', cors())

app.get('/info', (req, res, next) => {
  res.send('This is a proxy service which proxies to ONZO services')
})

app.use('/', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true
}));

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`)
})