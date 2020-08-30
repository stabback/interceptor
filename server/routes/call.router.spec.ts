import express from 'express';
import http from 'http';
import supertest from 'supertest';

import app from '@server/app';
import { ConditionService, ConditionDocument, CONDITION_TYPES } from '@server/resources/condition';
import { DomainService, DomainDocument } from '@server/resources/domain';
import { ServerErrorService } from '@server/resources/server-error';
import { InterceptService, InterceptDocument } from '@server/resources/intercept';
import { ResponseService, ResponseDocument } from '@server/resources/response';
import { UserService, UserDocument } from '@server/resources/user';
import TestDB from '@server/test.db';

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

  beforeAll(async () => await TestDB.connect());
  afterEach(async () => await TestDB.clearDatabase());
  afterAll(async () => await TestDB.closeDatabase());

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
    let user: UserDocument;
    beforeEach(async () => {
      user = await UserService.create('user');
    });

    it('errors if no domain is provided', async (done) => {
      const res = await call(user.key);

      expect(res.status).toBe(404);
      done();
    });
    it('errors if an invalid domain is provided', async (done) => {
      const res = await call(user.key, 'junk');

      expect(res.status).toBe(404);
      done();
    });

    describe('with a valid domain', () => {
      let domain: DomainDocument;
      beforeEach(async () => {
        domain = await DomainService.create('Foo domain', 'http://localhost:2032', 'foo');
      });

      it('passes through calls if no intercepts are available', async (done) => {
        const res = await call(user.key, domain.key, 'posts');
        expect(res.body.passedThrough).toBeTruthy();
        done();
      });

      it('appends matched user and domain information as a header', async (done) => {
        const res = await call(user.key, domain.key, 'posts');
        expect(res.header['x-interceptor-domain']).toBe(domain.id);
        expect(res.header['x-interceptor-user']).toBe(user.id);
        done();
      });

      describe('with intercepts', () => {
        let intercept: InterceptDocument;
        let condition: ConditionDocument;
        let responseA: ResponseDocument;
        let responseB: ResponseDocument;

        beforeEach(async () => {
          intercept = await InterceptService.create('intercept');
          condition = await ConditionService.create('method',  { method: 'GET' });
          responseA = await ResponseService.create(
            'response-a',
            '{ "response": "A" }',
            [
              { name: 'content-type', value: 'application/json' },
              { name: 'x-test-header', value: 'foo' }
            ],
            200,
            0
          );
          responseB = await ResponseService.create(
            'response-b',
            '{ "response": "B" }',
            [
              { name: 'content-type', value: 'application/json' },
              { name: 'x-test-header', value: 'bar' }
            ],
            200,
            0
          );

          await intercept.addCondition(condition.id);
          await intercept.addResponse(responseA.id);
          await intercept.addResponse(responseB.id);
          await domain.addIntercept(intercept.id);
        });

        it('appends the matched intercept header', async (done) => {
          const res = await call(user.key, domain.key, 'posts');
          expect(res.header['x-interceptor-intercept']).toBe(intercept.id);
          done();
        });

        it('continues to pass through with no response set', async (done) => {
          const res = await call(user.key, domain.key, 'posts');
          expect(res.body.passedThrough).toBeTruthy();
          done();
        });

        it('appends the matched response header', async (done) => {
          const res1 = await request
            .patch(`/command/user/${user.id}`)
            .send({
              updates: [{
                path: '/intercepts/' + intercept.id, op: 'replace', value: responseA.id
              }]
            });

          const res = await call(user.key, domain.key, 'posts');
          expect(res.header['x-interceptor-response']).toBe(responseA.id);
          done();
        });

        it('sets the response source to user if the response is selected by the user', async (done) => {
          await request
            .patch(`/command/user/${user.id}`)
            .send({
              updates: [{
                path: '/intercepts/' + intercept.id, op: 'replace', value: responseA.id
              }]
            });

          const res = await call(user.key, domain.key, 'posts');
          expect(res.header['x-interceptor-response-source']).toBe('user');
          done();
        });

        it('returns the Response header', async (done) => {
          await request
            .patch(`/command/user/${user.id}`)
            .send({
              updates: [{
                path: '/intercepts/' + intercept.id, op: 'replace', value: responseA.id
              }]
            });

          const res = await call(user.key, domain.key, 'posts');
          expect(res.header['x-test-header']).toBe('foo');
          done();
        });

        it('returns the Response body', async (done) => {
          await request
            .patch(`/command/user/${user.id}`)
            .send({
              updates: [{
                path: '/intercepts/' + intercept.id, op: 'replace', value: responseA.id
              }]
            });

          const res = await call(user.key, domain.key, 'posts');

          expect(res.body).toEqual(JSON.parse(responseA.body as string));
          done();
        });

        it('allows a second user to select a different response', async (done) => {
          const userB = await UserService.create('user-b');
          await request
            .patch(`/command/user/${user.id}`)
            .send({
              updates: [{
                path: '/intercepts/' + intercept.id, op: 'replace', value: responseA.id
              }]
            });
            await request
            .patch(`/command/user/${userB.id}`)
            .send({
              updates: [{
                path: '/intercepts/' + intercept.id, op: 'replace', value: responseB.id
              }]
            });

          const resA = await call(user.key, domain.key, 'posts');
          const resB = await call(userB.key, domain.key, 'posts');

          expect(resA.body).toEqual(JSON.parse(responseA.body as string));
          expect(resB.body).toEqual(JSON.parse(responseB.body as string));

          done();
        });
      });
    });
  });
});
