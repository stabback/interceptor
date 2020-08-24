import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { Snapshot, SnapshotService } from '@server/resources/snapshot';

export default function remove(req: ExpressRequest, res: ExpressResponse) {
  // Validation must be performed as middleware
  const snapshot = SnapshotService.get(req.params.snapshot) as Snapshot;

  SnapshotService.remove(snapshot.id);

  res.status(204).send();
}
