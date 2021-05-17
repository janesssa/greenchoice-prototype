import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

const API_SERVICE_URL = "https://api.onzo.io/engagement/v2";

export default (req: NextApiRequest, res: NextApiResponse) => (
    httpProxyMiddleware(req, res, {
      target: API_SERVICE_URL,
    })
);