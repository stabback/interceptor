import {
  createSchema, Type, typedModel, ExtractDoc, ExtractProps,
} from 'ts-mongoose';
import { Request } from 'express';
import { SerializedDocument } from '@definitions';
import { serializeDocument, convertReferencesToIds, convertReferenceToId } from '@server/utils';
import { Types } from 'mongoose';

import { ConditionSchema, ConditionDocument } from '../condition/condition.model';
import { ResponseSchema, ResponseDocument } from '../response/response.model';
import { Domain, DomainDocument } from '../domain';

export const InterceptSchema = createSchema({
  conditions: Type.array({ default: [], required: true }).of(
    Type.ref(Type.objectId()).to('Condition', ConditionSchema),
  ),
  defaultResponse: Type.ref(Type.objectId()).to('Response', ResponseSchema),
  locked: Type.boolean({ default: false }),
  name: Type.string({ required: true }),
  responses: Type.array({ default: [], required: true }).of(
    Type.ref(Type.objectId()).to('Response', ResponseSchema),
  ),

  // Methods
  ...({} as {
    addResponse: (response: ResponseDocument) => Promise<void>;
    addCondition: (condition: ConditionDocument) => Promise<void>;
    test: (req: Request) => Promise<boolean>;
    lock: () => void;
    unlock: () => void;
  }),
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
});

// Add Methods
InterceptSchema.methods.addResponse = async function addResponse(
  this: ExtractDoc<typeof InterceptSchema>, response: ResponseDocument,
) {
  await this.populate('responses');
  await this.execPopulate();

  const responses = this.responses as ResponseDocument[];

  if (responses.find((r) => r.id === response.id)) {
    throw new Error('Intercept already has this response');
  }

  if (responses.find((r) => r.name === response.name)) {
    throw new Error('Intercept already has a response with that name.');
  }

  responses.push(response);

  await this.save();
};

InterceptSchema.methods.addCondition = async function addCondition(
  this: InterceptDocument, condition: ConditionDocument,
) {
  if (this.locked) {
    throw new Error('Intercept is locked, cannot add a condition.');
  }

  this.populate('conditions');
  await this.execPopulate();

  const conditions = this.conditions as ConditionDocument[];

  if (conditions.find((r) => r.id === condition.id)) {
    throw new Error('Intercept already has this condition');
  }

  conditions.push(condition);

  await this.save();
};

InterceptSchema.methods.test = async function test(
  this: InterceptDocument, req: Request,
): Promise<boolean> {
  this.populate('conditions');
  await this.execPopulate();

  if (this.conditions.length === 0) {
    return false;
  }

  return this.conditions.every((condition) => {
    if ('test' in condition) {
      return condition.test(req);
    }
    return false;
  });
};

InterceptSchema.methods.lock = async function lock(
  this: InterceptDocument,
) {
  this.locked = true;
  await this.save();
};

InterceptSchema.methods.unlock = async function lock(
  this: InterceptDocument,
) {
  this.locked = false;
  await this.save();
};

// Hooks
async function removeFromDomains(
  removedIntercept: InterceptDocument,
) {
  if (!removedIntercept) return;

  const domains: DomainDocument[] = await Domain.where('intercepts', removedIntercept.id).exec();

  const saveActions = [];

  for (const domain of domains) {
    domain.intercepts = domain.intercepts
      .filter((intercept) => !(intercept as Types.ObjectId).equals(removedIntercept.id));

    saveActions.push(domain.save());
  }

  await Promise.all(saveActions);
}
InterceptSchema.post('deleteOne', removeFromDomains);
InterceptSchema.post('deleteMany', removeFromDomains);
InterceptSchema.post('findOneAndDelete', removeFromDomains);

interface SerializedInterceptData {
  conditions: string[];
  defaultResponse: string | null;
  locked: InterceptProps['locked'];
  name: InterceptProps['name'];
  responses: string[];
}

InterceptSchema.methods.toJSON = function toJSON(
  this: InterceptDocument,
) {
  const data: SerializedInterceptData = {
    name: this.name,
    locked: this.locked,
    conditions: convertReferencesToIds(this.conditions),
    responses: convertReferencesToIds(this.responses),
    defaultResponse: convertReferenceToId(this.defaultResponse),
  };

  return serializeDocument(this, data);
};

export const Intercept = typedModel('Intercept', InterceptSchema);
export type InterceptDocument = ExtractDoc<typeof InterceptSchema>
export type InterceptProps = ExtractProps<typeof InterceptSchema>
export type SerializedIntercept = SerializedDocument<SerializedInterceptData>
