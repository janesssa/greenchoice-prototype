// import { NextApiRequest, NextApiResponse } from 'next';
// import httpProxyMiddleware from 'next-http-proxy-middleware';

// const API_SERVICE_URL = "https://api.onzo.io/";

// export default (req: NextApiRequest, res: NextApiResponse) => {
//   console.log('api', req, res)
//   return httpProxyMiddleware(req, res, {
//     target: API_SERVICE_URL,
//   })
// }


import {createProxyMiddleware} from'http-proxy-middleware';

export default createProxyMiddleware({
         target:'https://api.onzo.io',
         changeOrigin: true
     });
