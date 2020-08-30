import { Types } from 'mongoose';

// TODO - Educate myself so I can type this
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Reference = Types.ObjectId | any | undefined;

export function convertReferenceToId(reference: Reference) {
  if (!reference) {
    return null;
  }

  if ('id' in reference) {
    return String(reference._id);
  }

  return String(reference);
}
export function convertReferencesToIds(references: Reference[]): string[] {
  return references
    .map((reference) => convertReferenceToId(reference))
    .filter((reference): reference is string => (reference !== null));
}
