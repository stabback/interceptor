import { Request as ExpressRequest } from 'express';

import { BaseModel } from '@server/resources/base';

import { ConditionType } from '../condition.service';

export interface MethodConditionRule {
    method: 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DELETE';
}

export interface MethodConditionData {
    type: ConditionType.Method;
    rule: MethodConditionRule;
}

export class MethodCondition extends BaseModel<MethodConditionData> {
  constructor(
        public data: MethodConditionData,
        id?: string,
  ) {
    super(data, 'condition', id);
  }

  public test(req: ExpressRequest) {
    return req.method === this.data.rule.method;
  }
}
