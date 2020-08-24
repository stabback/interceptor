import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { SnapshotService } from '@server/resources/snapshot';

export default function getMany(req: ExpressRequest, res: ExpressResponse) {
  const snapshots = SnapshotService.items;

  return res.send(SnapshotService.buildPayload(snapshots));
}
