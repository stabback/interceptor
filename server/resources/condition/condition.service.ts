import { ElementType } from '@definitions';
import { Types } from 'mongoose';
import {
  METHODS, CONDITION_TYPES, Condition, ConditionDocument,
} from './condition.model';

type Methods = ElementType<typeof METHODS>
type ConditionTypes = ElementType<typeof CONDITION_TYPES>

interface Rule {
  pattern?: string;
  method?: Methods;
}

export class ConditionService {
  public static async create(
    type: ConditionTypes,
    rule: Rule,
  ): Promise< ConditionDocument > {
    const condition = await Condition.create({
      conditionType: type,
      rule,
    });

    await condition.save();

    return condition;
  }

  public static async getAll(): Promise<ConditionDocument[]> {
    return Condition.find();
  }

  public static async get(id: Types.ObjectId | string): Promise<ConditionDocument | null> {
    if (Types.ObjectId.isValid(id)) {
      return Condition.findById(id);
    }
    return null;
  }

  public static async remove(id: string): Promise<void> {
    await Condition.findByIdAndDelete(id);
  }
}

export default ConditionService;
