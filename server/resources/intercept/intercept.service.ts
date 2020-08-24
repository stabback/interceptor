import { BaseService } from '@server/resources/base';

import { Intercept } from './intercept.model';

export class InterceptServiceClass extends BaseService< Intercept > {
  constructor() {
    super(
      'intercept',
      Intercept,
    );
  }

  public create(name: string, conditions: string[] = [], responses: string[] = []): Intercept {
    const intercept = new Intercept({
      conditions, defaultResponse: null, locked: false, name, responses,
    });

    this.items = [
      ...this.items,
      intercept,
    ];

    return intercept;
  }
}

const interceptService = new InterceptServiceClass();

export default interceptService;
