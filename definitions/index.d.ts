import { Document } from 'mongoose';

// https://github.com/microsoft/TypeScript/issues/28046#issuecomment-480516434
export type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never

export enum RESOURCE_TYPE {
  CONDITION = 'Condition',
  DOMAIN = 'Domain',
  SERVER_ERROR = 'ServerError',
  INTERCEPT = 'Intercept',
  RESPONSE = 'Response',
  USER = 'User',
}

export type ResourceTypes = keyof typeof RESOURCE_TYPE;

export interface SerializedDocument<D = any> {
  id: string;
  data: D;
  meta: {
    type: ResourceTypes;
    createdAt?: string;
    updatedAt?: string;
    version?: number;
  };
}
