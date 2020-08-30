import { SerializedDocument } from '@definitions';
import { Definition, ExtractDoc } from 'ts-mongoose';

export default function serializeDocument<Data>(
  document: ExtractDoc<Definition>,
  data: Data,
): SerializedDocument<Data> {
  const { createdAt } = document;
  const { updatedAt } = document;

  const res = {
    id: document.id,
    data,
    meta: {
      // TODO PR mongoose-ts.  Missing property from mongoose-ts
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: (document.constructor as any).modelName,
      version: document.__v,
      createdAt,
      updatedAt,
    },
  };

  return res;
}
