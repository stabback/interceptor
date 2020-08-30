// http://jsonpatch.com/

import { Document } from 'mongoose';
import { applyPatch, Operation } from 'fast-json-patch';

/**
 * Applies a list of JSON Patch operations.
 * @param document Document to update
 * @param operations List of operations to apply
 * @see http://jsonpatch.com/
 */
export default async function applyPatchOperations(
  document: Document,
  operations: Operation[],
): Promise<void> {
  const pojoDocument = document.toObject();

  try {
    applyPatch(pojoDocument, operations);
  } catch (e) {
    console.error(e);
    throw new Error(`Could not apply operations - ${e}`);
  }

  await document.updateOne(pojoDocument);
}
