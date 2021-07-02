import { NextApiRequest, NextApiResponse } from 'next';
import httpProxyMiddleware from 'next-http-proxy-middleware';

const API_SERVICE_URL = "https://api.onzo.io/";

export default (req: NextApiRequest, res: NextApiResponse) => {
  console.log(req.url)
  return new Promise<void>(resolve => {
    if(req.method === "GET"){
      return httpProxyMiddleware(req, res, {
        target: API_SERVICE_URL,
        pathRewrite: {
          '^/api': '/'
        }
      }).catch(console.error)
    }
    res.status(405).end()
    return resolve()
  })
}