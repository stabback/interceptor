import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { Snapshot, SnapshotService } from '@server/resources/snapshot';

export default function get(req: ExpressRequest, res: ExpressResponse) {
  const snapshot = (
        SnapshotService.get(req.params.snapshot)
    ) as Snapshot;

  if (req.query.download) {
    const filename = `${snapshot.data.meta.title} ${snapshot.data.meta.timestamp}`;
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  }

  return res.send(snapshot.asResponse);
}
