import express from 'express';
import http from 'http';
import supertest from 'supertest';

import app from '@server/app';
import { Condition, ConditionService, ConditionType } from '@server/resources/condition';
import { Domain, DomainService } from '@server/resources/domain';
import { ErrorService } from '@server/resources/error';
import { Intercept, InterceptService } from '@server/resources/intercept';
import { Response, ResponseService } from '@server/resources/response';
import { SnapshotService } from '@server/resources/snapshot';
import { User, UserService } from '@server/resources/user';

const request = supertest(app);

const mockedDomainApp = express();
mockedDomainApp.use('*', (req, res) => {
  res.send({
    originalUrl: req.originalUrl,
    passedThrough: true,
    url: req.url,
  });
});
mockedDomainApp.set('port', 2032);
const mockedDomainServer = http.createServer(mockedDomainApp);
mockedDomainServer.listen(2032);

const call = (...parts: string[]) => request.get(`/call/${parts.join('/')}`);

describe('Call router', () => {
  afterAll(() => {
    mockedDomainServer.close();
  });

  beforeEach(() => {
    SnapshotService.items = [];
    UserService.items = [];
    DomainService.items = [];
    InterceptService.items = [];
    ConditionService.items = [];
    ResponseService.items = [];
    ErrorService.items = [];
  });

  describe('without a valid user', () => {
    it('errors if no user is provided', async (done) => {
      const res = await call();

      expect(res.status).toBe(404);
      done();
    });
    it('errors if an invalid user is provided', async (done) => {
      const res = await call('foo');

      expect(res.status).toBe(404);
      done();
    });
  });

  describe('with a valid user', () => {
    let user: User;
    beforeEach(() => {
      user = UserService.create('user');
    });

    it('errors if no domain is provided', async (done) => {
      const res = await call(user.data.key);

      expect(res.status).toBe(404);
      done();
    });
    it('errors if an invalid domain is provided', async (done) => {
      const res = await call(user.data.key, 'junk');

      expect(res.status).toBe(404);
      done();
    });

    describe('with a valid domain', () => {
      let domain: Domain;
      beforeEach(() => {
        domain = DomainService.create('Foo domain', 'http://localhost:2032', 'foo');
      });

      it('passes through calls if no intercepts are available', async (done) => {
        const res = await call(user.data.key, domain.data.key, 'posts');
        expect(res.body.passedThrough).toBeTruthy();
        done();
      });

      it('appends matched user and domain information as a header', async (done) => {
        const res = await call(user.data.key, domain.data.key, 'posts');
        expect(res.header['x-interceptor-domain']).toBe(domain.id);
        expect(res.header['x-interceptor-user']).toBe(user.id);
        done();
      });

      describe('with intercepts', () => {
        let intercept: Intercept;
        let condition: Condition;
        let responseA: Response;
        let responseB: Response;

        beforeEach(() => {
          intercept = InterceptService.create('intercept');
          condition = ConditionService.create(ConditionType.Url,  { method: 'POST' });
          responseA = ResponseService.create('response-a', 200, {
            'content-type': 'application/json',
            'x-test-header': 'foo',
          }, { response: 'A' }, 0);
          responseB = ResponseService.create('response-b', 200, {
            'content-type': 'application/json',
          }, { response: 'B' }, 0);

          intercept.addCondition(condition.id);
          intercept.addResponse(responseA.id);
          intercept.addResponse(responseB.id);
          domain.addIntercept(intercept.id);
        });

        it('appends the matched intercept header', async (done) => {
          const res = await call(user.data.key, domain.data.key, 'posts');
          expect(res.header['x-interceptor-intercept']).toBe(intercept.id);
          done();
        });

        it('continues to pass through with no response set', async (done) => {
          const res = await call(user.data.key, domain.data.key, 'posts');
          expect(res.body.passedThrough).toBeTruthy();
          done();
        });

        it('appends the matched response header', async (done) => {
          user.data.intercepts[intercept.id] = responseA.id;

          const res = await call(user.data.key, domain.data.key, 'posts');
          expect(res.header['x-interceptor-response']).toBe(responseA.id);
          done();
        });

        it('sets the response source to user if the response is selected by the user', async (done) => {
          user.data.intercepts[intercept.id] = responseA.id;

          const res = await call(user.data.key, domain.data.key, 'posts');
          expect(res.header['x-interceptor-response-source']).toBe('user');
          done();
        });

        it('returns the Response header', async (done) => {
          user.data.intercepts[intercept.id] = responseA.id;

          const res = await call(user.data.key, domain.data.key, 'posts');
          expect(res.header['x-test-header']).toBe('foo');
          done();
        });

        it('returns the Response body', async (done) => {
          user.data.intercepts[intercept.id] = responseA.id;

          const res = await call(user.data.key, domain.data.key, 'posts');

          expect(res.body).toEqual(responseA.data.body);
          done();
        });

        it('allows a second user to select a different response', async (done) => {
          const userB = UserService.create('user-b');
          user.data.intercepts[intercept.id] = responseA.id;
          userB.data.intercepts[intercept.id] = responseB.id;

          const resA = await call(user.data.key, domain.data.key, 'posts');
          const resB = await call(userB.data.key, domain.data.key, 'posts');

          expect(resA.body).toEqual(responseA.data.body);
          expect(resB.body).toEqual(responseB.data.body);

          done();
        });
      });
    });
  });
});
