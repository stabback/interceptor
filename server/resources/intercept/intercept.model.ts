import { Request as ExpressRequest } from 'express';

import { BaseModel } from '@server/resources/base';
import { ConditionService } from '@server/resources/condition';

export interface InterceptData {
    conditions: string[];
    defaultResponse: string | null;
    locked: boolean;
    name: string;
    responses: string[];
}

export class Intercept extends BaseModel< InterceptData > {
  constructor(
        public data: InterceptData,
        id?: string,
  ) {
    super(data, 'intercept', id);
  }

  public test(req: ExpressRequest): boolean {
    return this.data.conditions.length > 0 && this.data.conditions.every((id) => {
      const condition = ConditionService.get(id);
      if (!condition) {
        return false;
      }
      return condition.test(req);
    });
  }

  public addCondition(id: string) {
    this.data.conditions.push(id);
  }

  public removeCondition(id: string) {
    this.data.conditions = this.data.conditions.filter((condition) => condition !== id);
  }

  public addResponse(id: string) {
    this.data.responses.push(id);
  }

  public removeResponse(id: string) {
    this.data.responses = this.data.responses.filter((response) => response !== id);

    if (this.data.defaultResponse === id) {
      this.data.defaultResponse = null;
    }
  }

  public lock() {
    this.data.locked = true;
  }

  public unlock() {
    this.data.locked = false;
  }

  public get locked() {
    return this.data.locked;
  }
}
