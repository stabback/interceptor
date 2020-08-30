import {
  createSchema, Type, typedModel, ExtractDoc, ExtractProps,
} from 'ts-mongoose';
import { serializeDocument } from '@server/utils';
import { SerializedDocument } from '@definitions';

export const ServerErrorSchema = createSchema({
  code: Type.string({ required: true }),
  message: Type.string({ required: true }),
}, {
  timestamps: {
    createdAt: true,
    updatedAt: true,
  },
});

interface SerializedServerErrorData {
  code: ServerErrorProps['code'];
  message: ServerErrorProps['message'];
}

ServerErrorSchema.methods.toJSON = function toJSON(
  this: ServerErrorDocument,
) {
  const data: SerializedServerErrorData = {
    code: this.code,
    message: this.message,
  };

  return serializeDocument(this, data);
};

export const ServerError = typedModel('ServerError', ServerErrorSchema);
export type ServerErrorDocument = ExtractDoc<typeof ServerErrorSchema>
export type ServerErrorProps = ExtractProps<typeof ServerErrorSchema>
export type SerializedServerError = SerializedDocument<SerializedServerErrorData>
