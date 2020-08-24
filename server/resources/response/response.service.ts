import { BaseService } from '@server/resources/base';

import { Headers, Response } from './response.model';

export class ResponseServiceClass extends BaseService< Response > {
  constructor() {
    super(
      'response',
      Response,
    );
  }

  public create(
    name: string,
    status: number,
    headers: Headers,
    body: string | {} | undefined,
    delay: number,
  ): Response {
    const response = new Response({
      name, status, headers, body, delay,
    });

    this.items = [
      ...this.items,
      response,
    ];

    return response;
  }
}

const responseService = new ResponseServiceClass();

export default responseService;
