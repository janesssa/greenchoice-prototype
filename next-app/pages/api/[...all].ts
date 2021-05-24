import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

const API_SERVICE_URL = "https://api.onzo.io/";

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log('api', req.url)
  return httpProxyMiddleware(req, res, {
    target: API_SERVICE_URL,
    pathRewrite: {
        '^/api':'/'
    }
  })
}