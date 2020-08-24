import { BaseResource, ResourceNames } from '@definitions';

// Note this is imported directly to avoid a circular dependency
// utils/index => verify-params => api model => base model => utils/index
import generateId from '@server/utils/generate-id/generate-id';

export abstract class BaseModel< Data > {
  constructor(
      public data: Data,
      public readonly type: ResourceNames,
      public id: string = '',
  ) {
    if (id === '') {
      this.id = generateId(this.type);
    }
  }

  public get asResponse(): BaseResource {
    return {
      id: this.id,
      type: this.type,
      data: this.data,
    };
  }
}
