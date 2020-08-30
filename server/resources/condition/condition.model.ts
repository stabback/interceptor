import {
  createSchema, Type, typedModel, ExtractProps, ExtractDoc,
} from 'ts-mongoose';
import { Request } from 'express';
import { SerializedDocument } from '@definitions';
import { Types } from 'mongoose';
import { serializeDocument } from '@server/utils';
import { InterceptDocument, Intercept } from '../intercept';

export const METHODS = ['POST', 'GET', 'PATCH', 'PUT', 'DELETE'] as const;
export const CONDITION_TYPES = ['url', 'method'] as const;

export const ConditionSchema = createSchema({
  conditionType: Type.string({ required: true, enum: CONDITION_TYPES }),
  rule: Type.object({ required: true }).of({
    pattern: Type.string(),
    method: Type.string({ enum: METHODS }),
  }),

  // Methods
  ...({} as {
      test: (req: Request) => boolean;
    }),
});

ConditionSchema.methods.test = function test(
  this: ExtractProps<typeof ConditionSchema>, req: Request,
): boolean {
  switch (this.conditionType) {
    case 'url':
      if (!this.rule.pattern) {
        throw new Error('No pattern provided for a url rule');
      }
      return new RegExp(this.rule.pattern).test(req.url);
    case 'method':
      return this.rule.method === req.method;
    default:
      throw new Error('No test for the provided rule');
  }
};

async function removeFromIntercepts(
  removedCondition: ConditionDocument,
) {
  if (!removedCondition) return;

  const intercepts: InterceptDocument[] = await Intercept.where('conditions', removedCondition.id).exec();
  const saveActions = [];

  for (const intercept of intercepts) {
    intercept.conditions = intercept.conditions
      .filter((condition) => !(condition as Types.ObjectId).equals(removedCondition.id));

    saveActions.push(intercept.save());
  }

  await Promise.all(saveActions);
}
ConditionSchema.post('deleteOne', removeFromIntercepts);
ConditionSchema.post('deleteMany', removeFromIntercepts);
ConditionSchema.post('findOneAndDelete', removeFromIntercepts);

interface SerializedConditionData {
  conditionType: ConditionProps['conditionType'];
  rule: {
    pattern?: ConditionProps['rule']['pattern'];
    method?: ConditionProps['rule']['method'];
  };

}

ConditionSchema.methods.toJSON = function toJSON(
  this: ConditionDocument,
) {
  const data: SerializedConditionData = {
    conditionType: this.conditionType,
    rule: {
      pattern: this.rule.pattern,
      method: this.rule.method,
    },
  };

  return serializeDocument(this, data);
};

export const Condition = typedModel('Condition', ConditionSchema);
export type ConditionDocument = ExtractDoc<typeof ConditionSchema>
export type ConditionProps = ExtractProps<typeof ConditionSchema>
export type SerializedCondition = SerializedDocument<ConditionDocument>
