import {
  createSchema, Type, typedModel, ExtractDoc, ExtractProps,
} from 'ts-mongoose';
import { serializeDocument, convertReferencesToIds } from '@server/utils';
import { SerializedDocument } from '@definitions';
import { InterceptSchema, InterceptDocument } from '../intercept/intercept.model';

export const DomainSchema = createSchema({
  intercepts: Type.array({ required: true }).of(
    Type.ref(Type.objectId()).to('Intercept', InterceptSchema),
  ),
  key: Type.string({ required: true, unique: true }),
  name: Type.string({ required: true }),
  url: Type.string({ required: true, unique: true }),

  // Methods
  ...({} as {
    addIntercept: (intercept: InterceptDocument) => Promise<void>;
  }),
});

// Add Methods
DomainSchema.methods.addIntercept = async function addIntercept(
  this: ExtractDoc<typeof DomainSchema>, intercept: InterceptDocument,
) {
  this.populate('intercepts');
  await this.execPopulate();

  const intercepts = this.intercepts as InterceptDocument[];

  if (intercepts.find((r) => r.id === intercept.id)) {
    throw new Error('Domain already has this intercept');
  }

  if (intercepts.find((r) => r.name === intercept.name)) {
    throw new Error('Domain already has a intercept with that name.');
  }

  intercepts.push(intercept);

  await this.save();
};

interface SerializedDomainData {
  intercepts: string[];
  key: DomainProps['key'];
  name: DomainProps['name'];
  url: DomainProps['url'];
}

DomainSchema.methods.toJSON = function toJSON(
  this: DomainDocument,
) {
  const data: SerializedDomainData = {
    intercepts: convertReferencesToIds(this.intercepts),
    key: this.key,
    name: this.name,
    url: this.url,
  };

  return serializeDocument(this, data);
};

export const Domain = typedModel('Domain', DomainSchema);
export type DomainDocument = ExtractDoc<typeof DomainSchema>
export type DomainProps = ExtractProps<typeof DomainSchema>
export type SerializedDomain = SerializedDocument<SerializedDomainData>
