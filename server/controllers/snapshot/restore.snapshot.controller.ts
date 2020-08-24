import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { Snapshot, SnapshotService } from '@server/resources/snapshot';

import { ConditionService } from '@server/resources/condition';
import { DomainService } from '@server/resources/domain';
import { ErrorService } from '@server/resources/error';
import { InterceptService } from '@server/resources/intercept';
import { ResponseService } from '@server/resources/response';
import { UserService } from '@server/resources/user';

export default function restore(req: ExpressRequest, res: ExpressResponse) {
  SnapshotService.create(
    'Pre-restoral snapshot',
    `Snapshot prior to restoring [${req.params.snapshot}]`,
    'auto',
  );

  const existingSnapshot = (
        SnapshotService.get(req.params.snapshot)
    ) as Snapshot;

  ConditionService.items = existingSnapshot.data.model.condition;
  DomainService.items = existingSnapshot.data.model.domain;
  ErrorService.items = existingSnapshot.data.model.error;
  InterceptService.items = existingSnapshot.data.model.intercept;
  ResponseService.items = existingSnapshot.data.model.response;
  UserService.items = existingSnapshot.data.model.user;

  return res.status(204).send();
}
