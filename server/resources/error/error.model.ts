import { BaseModel } from '@server/resources/base';

Error.stackTraceLimit = 20;
export interface ApiErrorData {
    code: string;
    message: string;
    timestamp: string;
}

export class ApiError extends BaseModel< ApiErrorData > {
  constructor(
        public data: ApiErrorData,
        id?: string,
  ) {
    super(data, 'error', id);
  }
}
