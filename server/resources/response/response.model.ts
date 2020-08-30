import { Response as ExpressResponse } from 'express';

import {
  createSchema, Type, typedModel, ExtractProps, ExtractDoc,
} from 'ts-mongoose';
import { serializeDocument } from '@server/utils';
import { SerializedDocument } from '@definitions';
import { Types } from 'mongoose';
import { InterceptDocument, Intercept } from '../intercept';

export const ResponseSchema = createSchema({
  name: Type.string({ required: true }),
  status: Type.number({ required: true }),
  body: Type.string(),
  delay: Type.number({ default: 0 }),
  headers: Type.array({ required: true }).of({
    name: Type.string({ required: true }),
    value: Type.string({ required: true }),
  }),

  // Methods
  ...({} as {
    send: (res: ExpressResponse) => void;
  }),
});

// Add Methods
ResponseSchema.methods.send = async function send(
  this: ExtractProps<typeof ResponseSchema>, res: ExpressResponse,
) {
  try {
    res.status(this.status);
    this.headers.forEach(({ name, value }) => {
      res.setHeader(name, value);
    });

    const { body } = this;

    if (this.delay) {
      await new Promise((resolve) => setTimeout(resolve, this.delay));
    }
    return res.send(body);
  } catch (e) {
    const headerNames = res.getHeaderNames();
    let header;
    for (header of headerNames) {
      if (!header.includes('x-interceptor')) {
        res.removeHeader(header);
      }
    }

    return res.status(500).send(`
Interceptor error - Could not send configured response.  This is likely due to a malformed content-type.

Express error:
${e}
`);
  }
};

interface SerializedResponseData {
  name: ResponseProps['name'];
  status: ResponseProps['status'];
  body: ResponseProps['body'];
  delay: ResponseProps['delay'];
  headers: { name: string; value: string }[];
}

ResponseSchema.methods.toJSON = function toJSON(
  this: ResponseDocument,
) {
  const data: SerializedResponseData = {
    name: this.name,
    status: this.status,
    body: this.body,
    delay: this.delay,
    headers: this.headers.map(({ name, value }) => ({ name, value })),
  };

  return serializeDocument(this, data);
};

async function removeFromIntercepts(
  removedResponse: ResponseDocument,
) {
  if (!removedResponse) return;

  const intercepts: InterceptDocument[] = await Intercept.where('responses', removedResponse.id).exec();
  const saveActions = [];

  for (const intercept of intercepts) {
    intercept.responses = intercept.responses
      .filter((response) => !(response as Types.ObjectId).equals(removedResponse.id));

    saveActions.push(intercept.save());
  }

  await Promise.all(saveActions);
}
ResponseSchema.post('deleteOne', removeFromIntercepts);
ResponseSchema.post('deleteMany', removeFromIntercepts);
ResponseSchema.post('findOneAndDelete', removeFromIntercepts);

export const Response = typedModel('Response', ResponseSchema);
export type ResponseDocument = ExtractDoc<typeof ResponseSchema>
export type ResponseProps = ExtractProps<typeof ResponseSchema>
export type SerializedResponse = SerializedDocument<SerializedResponseData>
