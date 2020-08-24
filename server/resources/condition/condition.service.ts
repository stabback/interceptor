import { BaseService } from '@server/resources/base';
import {
  MethodCondition, UrlCondition, UrlConditionRule, MethodConditionRule,
} from './models';

type Condition = MethodCondition | UrlCondition;
type ConditionRules = MethodConditionRule | UrlConditionRule

export enum ConditionType {
    Method = 'method',
    Url = 'url',
}

export class ConditionServiceClass extends BaseService<Condition> {
  // Override default getters and setters as we need to create a condition by type
  public get items(): Condition[] {
    this._items = this.store.items ? this.store.items.map(
      (item: Condition) => ConditionServiceClass._create(
        item.data.type,
        item.data.rule,
        item.id,
      ),
    ) : [];

    return this._items;
  }

  public set items(val: Condition[]) {
    this._items = val;

    this.store.items = this._items;
  }

  constructor() {
    super(
      'condition',
      MethodCondition,
    );
  }

  public create(
    type: ConditionType,
    rule: ConditionRules,
  ): Condition {
    const condition = ConditionServiceClass._create(type, rule);

    this.items = [
      ...this.items,
      condition,
    ];

    return condition;
  }

  // Internal only function - creates a condition based on type, but does not
  // store it.  Needed for hydration from the store.
  private static _create(
    type: ConditionType,
    rule: ConditionRules,
    id?: string,
  ) {
    switch (type) {
      case ConditionType.Method:
        return new MethodCondition({ type, rule: rule as MethodConditionRule }, id);
      case ConditionType.Url:
        return new UrlCondition({ type, rule: rule as UrlConditionRule }, id);
      default:
        throw new Error(`A condition was attempted to be created with an unknown type - ${type}`);
    }
  }
}

const conitionService = new ConditionServiceClass();

export default conitionService;
