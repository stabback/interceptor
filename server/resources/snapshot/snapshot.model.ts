import { BaseModel } from '@server/resources/base';

import { MethodCondition, UrlCondition } from '@server/resources/condition';
import { Domain } from '@server/resources/domain';
import { ApiError } from '@server/resources/error';
import { Intercept } from '@server/resources/intercept';
import { Response } from '@server/resources/response';
import { User } from '@server/resources/user';

export type SnapshotTypes = 'auto' | 'user';

export interface SnapshotData {
    meta: {
        notes: string;
        timestamp: string;
        title: string;
        type: SnapshotTypes;
        version: string;
        size: number;
    };
    model: {
        condition: (MethodCondition | UrlCondition)[];
        domain: Domain[];
        error: ApiError[];
        intercept: Intercept[];
        response: Response[];
        user: User[];
    };
}

export class Snapshot extends BaseModel< SnapshotData > {
  constructor(
        public data: SnapshotData,
        id?: string,
  ) {
    super(data, 'snapshot', id);
  }
}
