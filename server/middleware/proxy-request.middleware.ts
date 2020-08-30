import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import createProxyMiddleware from 'http-proxy-middleware';

import { DomainService } from '@server/resources/domain';

export default async function (req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
  // Must be validated by middleware
  const domain = await DomainService.getByIdentifier(req.params.domain);
  if (!domain) {
    return res.status(404).send();
  }

  return createProxyMiddleware({
    changeOrigin: true,
    logLevel: process.env.NODE_ENV === 'test' ? 'silent' : 'warn',
    pathRewrite: {
      '/call/*/*': '',
    },
    onProxyReq(proxyReq, r: ExpressRequest) {
      if (r.body && Object.keys(r.body).length) {
        const bodyString = JSON.stringify(r.body);

        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyString));

        proxyReq.write(bodyString);
      }
    },
    target: domain.url,

  })(req, res, next);
}
