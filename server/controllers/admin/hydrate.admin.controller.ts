import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

import { ConditionService, ConditionType } from '@server/resources/condition';
import { DomainService } from '@server/resources/domain';
import { ErrorService } from '@server/resources/error';
import { InterceptService } from '@server/resources/intercept';
import { ResponseService } from '@server/resources/response';
import { UserService } from '@server/resources/user';

export default function hydrate(req: ExpressRequest, res: ExpressResponse) {
  ErrorService.items = [];
  InterceptService.items = [];
  ResponseService.items = [];
  DomainService.items = [];
  ConditionService.items = [];
  UserService.items = [];

  const domains = {
    bar: DomainService.create('Bar domain', 'http://example.com/bar', 'bar'),
    foo: DomainService.create('Foo domain', 'http://example.com/foo', 'foo'),
  };

  const intercepts = {
    bar: InterceptService.create('Bar Intercept'),
    foo: InterceptService.create('Foo Intercept'),
  };

  domains.foo.addIntercept(intercepts.foo.id);
  domains.foo.addIntercept(intercepts.bar.id);

  DomainService.save();

  const responses = {
    bar: ResponseService.create('Bar Response', 418, { 'X-Foo': 'Bar' }, 'tea is on', 200),
    foo: ResponseService.create('Foo Response', 200, {}, 'greased lightning', 500),
  };

  intercepts.foo.addResponse(responses.foo.id);
  intercepts.foo.addResponse(responses.bar.id);

  const conditions = {
    bar: ConditionService.create(ConditionType.Method, { method: 'POST' }),
    foo: ConditionService.create(ConditionType.Method, { method: 'GET' }),
  };

  intercepts.foo.addCondition(conditions.foo.id);
  intercepts.foo.addCondition(conditions.bar.id);

  InterceptService.save();

  UserService.create('bar');
  UserService.create('foo');

  res.status(200).send({
    conditions: ConditionService.items,
    domains: DomainService.items,
    intercepts: InterceptService.items,
    responses: ResponseService.items,
    users: UserService.items,
  });
}
