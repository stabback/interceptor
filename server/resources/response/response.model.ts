import { Response as ExpressResponse } from 'express';

import { BaseModel } from '@server/resources/base';

export interface Headers {
    [key: string]: string;
}

export interface ResponseData {
    name: string;
    status: number;
    headers: Headers;
    body: string | {} | undefined;
    delay: number;
}

export class Response extends BaseModel< ResponseData > {
  constructor(
        public data: ResponseData,
        id?: string,
  ) {
    super(data, 'response', id);
  }

  public async send(res: ExpressResponse) {
    try {
      res.status(this.data.status);
      Object.entries(this.data.headers).forEach(([key, val]) => {
        res.setHeader(key, val);
      });

      let { body } = this.data;
      if (typeof body !== 'string') {
        body = JSON.stringify(body);
      }

      if (this.data.delay) {
        await new Promise((resolve) => setTimeout(resolve, this.data.delay));
      }
      return res.send(body);
    } catch (e) {
      const headerNames = res.getHeaderNames();
      let header;
      for (header of headerNames) {
        if (!header.includes('x-interceptor')) {
          res.removeHeader(header);
        }
      }

      return res.status(500).send(`
Interceptor error - Could not send configured response.  This is likely due to a malformed content-type.

Express error:
${e}
`);
    }
  }
}
