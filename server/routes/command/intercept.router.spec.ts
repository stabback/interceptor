import app from '@server/app';
import { Condition, ConditionService, ConditionType } from '@server/resources/condition';
import {DomainService } from '@server/resources/domain';
import { Intercept, InterceptService } from '@server/resources/intercept';
import { Response, ResponseService } from '@server/resources/response';
import supertest from 'supertest';

const request = supertest(app);

describe('intercept route', () => {
    beforeEach(() => {
        InterceptService.items = [];
        DomainService.items = [];
    });

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
            InterceptService.create('foo');
            InterceptService.create('bar');

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
            DomainService.create('foo', 'http://example.com', 'foo');

            const res = await request
                .post('/command/intercept')
                .send({
                    domain: 'bar',
                    name: 'baz',
                });

            expect(res.status).toBe(404);
            done();
        });

        it('returns an error if the name param is not present', async (done) => {
            DomainService.create('foo', 'http://example.com', 'foo');

            const res = await request
                .post('/command/intercept')
                .send({
                    domain: 'foo',
                });

            expect(res.status).toBe(400);
            done();
        });

        it('returns an error if the intercept name is not unique', async (done) => {
            const domain = DomainService.create('foo', 'http://example.com', 'foo');

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
            const domain = DomainService.create('foo', 'http://example.com', 'foo');

            const res = await request
                .post('/command/intercept')
                .send({
                    conditions: ['a', 'b', 'c'],
                    domain: domain.id,
                    name: 'bar',
                    responses: ['x', 'y', 'z'],
                });

            expect(res.body.data.name).toBe('bar');
            expect(res.body.data.conditions).toEqual(['a', 'b', 'c']);
            expect(res.body.data.responses).toEqual(['x', 'y', 'z']);
            expect(res.status).toBe(201);
            done();
        });

        it('adds the intercept to the domain', async (done) => {
            const domain = DomainService.create('foo', 'http://example.com', 'foo');

            const res = await request
                .post('/command/intercept')
                .send({
                    conditions: ['a', 'b', 'c'],
                    domain: domain.id,
                    name: 'bar',
                    responses: ['x', 'y', 'z'],
                });

            expect(domain.data.intercepts.includes(res.body.id)).toBeTruthy();
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
            const foo = InterceptService.create('foo');

            const res = await request.get(`/command/intercept/${foo.id}`);
            expect(res.body.id).toEqual(foo.id);
            done();
        });
    });

    describe('DELETE /intercept/:intercept', () => {
        let foo: Intercept;
        beforeEach(() => {
            foo = InterceptService.create('foo');
        });
        afterEach(() => {
            // Sanity check to make sure other items aren't being deleted
            expect(
                InterceptService.get(foo.id),
            ).toEqual(foo);
        });

        it('404s if intercept is not found', async (done) => {
            const res = await request.delete('/command/intercept/bar');
            expect(res.status).toBe(404);
            done();
        });

        it('deletes the intercept', async (done) => {
            const bar = InterceptService.create('bar');
            const res = await request.delete(`/command/intercept/${bar.id}`);
            expect(res.status).toBe(204);
            expect(
                (await request.get(`/command/intercept/${bar.id}`)).status,
            ).toBe(404);
            done();
        });
        it('removes the intercept from all domains', async (done) => {
            const bar = InterceptService.create('bar');
            const domain = DomainService.create('domain', 'http://example.com', 'domain');
            domain.addIntercept(bar.id);

            const res = await request.delete(`/command/intercept/${bar.id}`);
            expect(res.status).toBe(204);
            expect(domain.data.intercepts.includes(bar.id)).toBeFalsy();

            done();
        });
    });

    describe('PATCH /intercept/:intercept', () => {
        let foo: Intercept;
        beforeEach(() => {
            foo = InterceptService.create('foo');
        });

        it('404s if intercept is not found', async (done) => {
            const res = await request.patch('/command/intercept/bar');
            expect(res.status).toBe(404);
            done();
        });

        it('updates an intercept', async (done) => {

            const before = await request.get(`/command/intercept/${foo.id}`);
            expect(before.body.data.locked).toBeFalsy();

            await request
                .patch(`/command/intercept/${foo.id}`)
                .send([{path: '/data/locked', op: 'replace', value: true}]);

            const after = await request.get(`/command/intercept/${foo.id}`);
            expect(after.body.data.locked).toBeTruthy();
            done();
        });

        it('returns the updated intercept in the response', async (done) => {
            const res = await request
                .patch(`/command/intercept/${foo.id}`)
                .send([{path: '/data/locked', op: 'replace', value: true}]);

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
        let foo: Intercept;
        let bar: Intercept;

        let conditionA: Condition;
        let conditionB: Condition;
        let conditionC: Condition;

        beforeEach(() => {
            foo = InterceptService.create('foo');
            bar = InterceptService.create('bar');

            conditionA = ConditionService.create(ConditionType.Method, { method: 'GET' });
            conditionB = ConditionService.create(ConditionType.Method, { method: 'POST' });
            conditionC = ConditionService.create(ConditionType.Method, { method: 'PATCH' });

            foo.addCondition(conditionA.id);
            foo.addCondition(conditionB.id);
            bar.addCondition(conditionC.id);
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
        let foo: Intercept;
        let bar: Intercept;

        let responseA: Response;
        let responseB: Response;
        let responseC: Response;

        beforeEach(() => {
            foo = InterceptService.create('foo');
            bar = InterceptService.create('bar');

            responseA = ResponseService.create('foo', 200, {}, 'foo', 200);
            responseB = ResponseService.create('bar', 200, {}, 'bar', 200);
            responseC = ResponseService.create('baz', 200, {}, 'baz', 200);

            foo.addResponse(responseA.id);
            foo.addResponse(responseB.id);
            bar.addResponse(responseC.id);
        });

        it('404s if intercept is not found', async (done) => {
            const res = await request.get('/command/intercept/foobar/response');
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
