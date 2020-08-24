import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ConditionService } from '@server/resources/condition';
import { DomainService } from '@server/resources/domain';
import { ErrorService } from '@server/resources/error';
import { InterceptService } from '@server/resources/intercept';
import { ResponseService } from '@server/resources/response';
import { UserService } from '@server/resources/user';

export default function reset(req: ExpressRequest, res: ExpressResponse) {
  ErrorService.items = [];
  InterceptService.items = [];
  ResponseService.items = [];
  DomainService.items = [];
  ConditionService.items = [];
  UserService.items = [];

  res.status(204).send();
}
