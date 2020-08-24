import { Request as ExpressRequest } from 'express';

import { BaseModel } from '@server/resources/base';

import { ConditionType } from '../condition.service';

export interface UrlConditionRule {
    pattern: string;
}

export interface UrlConditionData {
    type: ConditionType.Url;
    rule: UrlConditionRule;
}

export class UrlCondition extends BaseModel< UrlConditionData > {
    private matcher: RegExp;

    constructor(
        public data: UrlConditionData,
        id?: string,
    ) {
      super(data, 'condition', id);
      this.matcher = new RegExp(this.data.rule.pattern);
    }

    public test(req: ExpressRequest) {
      return this.matcher.test(req.url);
    }
}
