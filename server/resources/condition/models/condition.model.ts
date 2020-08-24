import { BaseModel } from '@server/resources/base';

import { ConditionType } from '../condition.service';

export interface ConditionData {
    type: ConditionType;
    rule: {};
}

export class Condition extends BaseModel< ConditionData > {
  constructor(
        public data: ConditionData,
        id?: string,
  ) {
    super(data, 'condition', id);
  }

  public static test() {
    return false;
  }
}
