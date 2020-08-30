import app from '@server/app';
import { ConditionService, ConditionDocument } from '@server/resources/condition';
import {DomainService, DomainDocument } from '@server/resources/domain';
import { InterceptService, InterceptDocument } from '@server/resources/intercept';
import { ResponseService, ResponseDocument } from '@server/resources/response';
import supertest from 'supertest';
import TestDB from '@server/test.db';
import { Types } from 'mongoose';

const request = supertest(app);

describe('intercept route', () => {
    beforeAll(async () => await TestDB.connect());
    afterEach(async () => await TestDB.clearDatabase());
    afterAll(async () => await TestDB.closeDatabase());

    describe('GET /intercept', () => {
        it('returns a 200', async (done) => {
            const res = await request.get('/command/intercept');
            expect(res.status).toBe(200);
            done();
        });

        it('returns a list of items', async (done) => {
            const res = await request.get('/command/intercept');
            expect(res.body.items).toBeInstanceOf(Array);
            done();
        });

        it('returns a number of items equal to the number of intercepts', async (done) => {
            await InterceptService.create('foo');
            await InterceptService.create('bar');

            const res = await request.get('/command/intercept');
            expect(res.body.items.length).toBe(2);
            done();
        });

        it('returns no items if there are no intercepts', async (done) => {
            const res = await request.get('/command/intercept');
            expect(res.body.items.length).toBe(0);
            done();
        });
    });

    describe('POST /intercept', () => {
        it('returns an error if the domain is not valid', async (done) => {
            await DomainService.create('foo', 'http://example.com', 'foo');

            const res = await request
                .post('/command/intercept')
                .send({
                    domain: 'bar',
                    name: 'baz',
                });

            expect(res.status).toBe(400);
            done();
        });

        it('returns an error if the name param is not present', async (done) => {
            await DomainService.create('foo', 'http://example.com', 'foo');

            request
                .post('/command/intercept')
                .send({
                    domain: 'foo',
                })
                .expect(400, done)

        });

        it('returns an error if the intercept name is not unique', async (done) => {
            const domain = await DomainService.create('foo', 'http://example.com', 'foo');

            await request
                .post('/command/intercept')
                .send({
                    domain: domain.id,
                    name: 'bar',
                });

            const res = await request
                .post('/command/intercept')
                .send({
                    domain: domain.id,
                    name: 'bar',
                });

            expect(res.status).toBe(400);
            done();
        });

        it('returns the created intercept', async (done) => {
            const domain = await DomainService.create('foo', 'http://example.com', 'foo');
            const res = await request
                .post('/command/intercept')
                .send({
                    conditions: [],
                    domain: domain.id,
                    name: 'bar',
                    responses: [],
                });
            

            expect(res.body.data.name).toBe('bar');
            expect(res.status).toBe(201);
            done();
        });

        it('adds the intercept to the domain', async (done) => {
            const domain = await DomainService.create('foo', 'http://example.com', 'foo');

            const res = await request
                .post('/command/intercept')
                .send({
                    conditions: [Types.ObjectId('aaaaaaaaaaaa'), Types.ObjectId('bbbbbbbbbbbb')],
                    domain: domain.id,
                    name: 'bar',
                    responses: [Types.ObjectId('xxxxxxxxxxxx'), Types.ObjectId('yyyyyyyyyyyy')],
                });

            const updatedDomain = await DomainService.getByIdentifier(domain.id) as DomainDocument;

            expect(updatedDomain.intercepts.includes(res.body.id)).toBeTruthy();
            done();
        });
    });

    describe('GET /intercept/:intercept', () => {
        it('404s if the intercept is not found', async (done) => {
            const res = await request.get('/command/intercept/foo');
            expect(res.status).toBe(404);
            done();
        });

        it('returns the intercept if found', async (done) => {
            const foo = await InterceptService.create('foo');

            const res = await request.get(`/command/intercept/${foo.id}`);
            expect(res.body.id).toEqual(foo.id);
            done();
        });
    });

    describe('DELETE /intercept/:intercept', () => {
        let foo: InterceptDocument;
        beforeEach(async () => {
            foo = await InterceptService.create('foo');
        });
        afterEach(async () => {
            // Sanity check to make sure other items aren't being deleted
            const item = await InterceptService.get(foo.id) as InterceptDocument;
            expect(item.id).toEqual(foo.id);
        });

        it('204s if intercept is not found', async (done) => {
            const res = await request.delete('/command/intercept/bar');
            expect(res.status).toBe(204);
            done();
        });

        it('deletes the intercept', async (done) => {
            const bar = await InterceptService.create('bar');
            const res = await request.delete(`/command/intercept/${bar.id}`);
            expect(res.status).toBe(204);
            expect(
                (await request.get(`/command/intercept/${bar.id}`)).status,
            ).toBe(404);
            done();
        });
        it('removes the intercept from all domains', async (done) => {
            const bar = await InterceptService.create('bar');
            const domain = await DomainService.create('domain', 'http://example.com', 'domain');
            await domain.addIntercept(bar.id);

            const res = await request.delete(`/command/intercept/${bar.id}`);
            expect(res.status).toBe(204);

            const updatedDomain = await DomainService.getByIdentifier(domain.id) as DomainDocument;
            expect(updatedDomain.intercepts.includes(bar.id)).toBeFalsy();

            done();
        });
    });

    describe('PATCH /intercept/:intercept', () => {
        let foo: InterceptDocument;
        beforeEach(async () => {
            foo = await InterceptService.create('foo');
        });

        it('404s if intercept is not found', async (done) => {
            request
                .patch('/command/' + Types.ObjectId() + '/bar')
                .expect(404, done);
        });

        it('updates an intercept', async (done) => {

            const before = await request.get(`/command/intercept/${foo.id}`);
            expect(before.body.locked).toBeFalsy();

            await request
                .patch(`/command/intercept/${foo.id}`)
                .send({ updates: [{ path: '/locked', op: 'replace', value: true }] });

            const after = await request.get(`/command/intercept/${foo.id}`);

            expect(after.body.data.locked).toBeTruthy();
            done();
        });

        it('returns the updated intercept in the response', async (done) => {
            const res = await request
                .patch(`/command/intercept/${foo.id}`)
                .send({ updates: [{ path: '/locked', op: 'replace', value: true }] });

            expect(res.status).toBe(200);
            expect(res.body.id).toBe(foo.id);
            done();
        });

        it('errors if not an array of patch operations', async (done) => {
            const res = await request
                .patch(`/command/intercept/${foo.id}`)
                .send('foobar');

            expect(res.status).toBe(400);
            done();
        });

    });

    describe('GET /intercept/:intercept/condition', () => {
        let foo: InterceptDocument;
        let bar: InterceptDocument;

        let conditionA: ConditionDocument;
        let conditionB: ConditionDocument;
        let conditionC: ConditionDocument;

        beforeEach(async () => {
            foo = await InterceptService.create('foo');
            bar = await InterceptService.create('bar');

            conditionA = await ConditionService.create('method', { method: 'GET' });
            conditionB = await ConditionService.create('method', { method: 'POST' });
            conditionC = await ConditionService.create('method', { method: 'PATCH' });

            await foo.addCondition(conditionA.id);
            await foo.addCondition(conditionB.id);
            await bar.addCondition(conditionC.id);
        });

        it('404s if intercept is not found', async (done) => {
            const res = await request.get('/command/intercept/foobar/condition');
            expect(res.status).toBe(404);
            done();
        });

        it('returns all condition for an intercept', async (done) => {
            const res = await request.get(`/command/intercept/${foo.id}/condition`);
            expect(res.body.items.length).toBe(2);
            expect(res.body.items[0].id).toBe(conditionA.id);
            expect(res.body.items[1].id).toBe(conditionB.id);
            done();
        });
        it('does not return conditions that do not belong to an intercept', async (done) => {
            const res = await request.get(`/command/intercept/${foo.id}/condition`);
            expect(
                res.body.items.find((condition: any) => condition.id === conditionC.id),
            ).toBeFalsy();
            done();
        });
    });

    describe('GET /intercept/:intercept/response', () => {
        let foo: InterceptDocument;
        let bar: InterceptDocument;

        let responseA: ResponseDocument;
        let responseB: ResponseDocument;
        let responseC: ResponseDocument;

        beforeEach(async () => {
            foo = await InterceptService.create('foo');
            bar = await InterceptService.create('bar');

            responseA = await ResponseService.create('foo', 'foo', [], 200, 200);
            responseB = await ResponseService.create('bar', 'bar', [], 200, 200);
            responseC = await ResponseService.create('baz', 'baz', [], 200, 200);


            await foo.addResponse(responseA.id);
            await foo.addResponse(responseB.id);

            await bar.addResponse(responseC.id);

        });

        it('404s if intercept is not found here', async (done) => {
            const res = await request.get('/command/intercept/abc123456def/response');
            expect(res.status).toBe(404);
            done();
        });

        it('returns all response for an intercept', async (done) => {
            const res = await request.get(`/command/intercept/${foo.id}/response`);
            expect(res.body.items.length).toBe(2);
            expect(res.body.items[0].id).toBe(responseA.id);
            expect(res.body.items[1].id).toBe(responseB.id);
            done();
        });

        it('does not return responses that do not belong to an intercept', async (done) => {
            const res = await request.get(`/command/intercept/${foo.id}/response`);
            expect(
                res.body.items.find((response: any) => response.id === responseC.id),
            ).toBeFalsy();
            done();
        });
    });

});
