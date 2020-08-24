import { NextFunction, Request as ExpressRequest, Response as ExpressResponse } from 'express';
import createProxyMiddleware from 'http-proxy-middleware';

import { Domain, DomainService } from '@server/resources/domain';

export default function (req: ExpressRequest, res: ExpressResponse, next: NextFunction) {
  // Must be validated by middleware
  const domain = DomainService.getByKey(req.params.domain) as Domain;

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
    target: domain.data.url,

  })(req, res, next);
}
