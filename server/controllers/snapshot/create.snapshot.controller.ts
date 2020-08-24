import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { SnapshotService } from '@server/resources/snapshot';

export default function create(req: ExpressRequest, res: ExpressResponse) {
  const { title, notes } = req.body;

  const snapshot = SnapshotService.create(title, notes, 'user');

  return res.status(201).send(snapshot.asResponse);
}
