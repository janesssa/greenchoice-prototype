const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;
const HOST = "0.0.0.0";
const API_SERVICE_URL = "https://api.onzo.io/engagement/v2";

app.get('/info', (req, res, next) => {
  res.send('This is a proxy service which proxies to ONZO services')
})

app.use('', (req, res, next) => {
  if(req.headers.authorization.includes('Bearer')){
    next();
  } else {
    res.sendStatus(403);
  }
})

app.use('/onzo', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
      [`^/onzo`]: '',
  },
}));

app.listen(PORT, HOST, () => {
  console.log(`Starting Proxy at ${HOST}:${PORT}`)
})