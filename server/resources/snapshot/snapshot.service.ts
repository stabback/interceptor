import sizeof from 'object-sizeof';

import { BaseService } from '@server/resources/base';
import { ConditionService } from '@server/resources/condition';
import { DomainService } from '@server/resources/domain';
import { ErrorService } from '@server/resources/error';
import { InterceptService } from '@server/resources/intercept';
import { ResponseService } from '@server/resources/response';
import { UserService } from '@server/resources/user';

import { version } from '@PACKAGE_JSON';
import { Snapshot, SnapshotTypes } from './snapshot.model';

export class SnapshotServiceClass extends BaseService< Snapshot > {
  constructor() {
    super(
      'snapshot',
      Snapshot,
    );
  }

  public create(title = '(unnamed)', notes = '', type: SnapshotTypes = 'auto'): Snapshot {
    const model = {
      condition: ConditionService.items,
      domain: DomainService.items,
      error: ErrorService.items,
      intercept: InterceptService.items,
      response: ResponseService.items,
      user: UserService.items,
    };

    const snapshot = new Snapshot({
      meta: {
        notes,
        timestamp: new Date().toISOString(),
        title,
        type,
        version,
        size: sizeof(model),
      },
      model,
    });

    this.items = [
      ...this.items,
      snapshot,
    ];

    return snapshot;
  }

  static buildPayload(items: Snapshot[]) {
    return {
      items: items
        .map((item) => item.asResponse)

      // Remove the model from the bulk call for performance reasons
        .map((item) => ({
          ...item,
          data: {
            meta: item.data.meta,
          },
        })),
    };
  }
}

const snapshotService = new SnapshotServiceClass();

export default snapshotService;
