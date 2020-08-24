import app from '@server/app';
import { Condition, ConditionService, ConditionType } from '@server/resources/condition';
import { Intercept, InterceptService } from '@server/resources/intercept';
import supertest from 'supertest';

const request = supertest(app);

describe('condition route', () => {
    beforeEach(() => {
        ConditionService.items = [];
    });

    describe('GET /condition', () => {
        it('returns a 200', async (done) => {
            const res = await request.get('/command/condition');
            expect(res.status).toBe(200);
            done();
        });

        it('returns a list of items', async (done) => {
            const res = await request.get('/command/condition');
            expect(res.body.items).toBeInstanceOf(Array);
            done();
        });

        it('returns a number of items equal to the number of conditions', async (done) => {
            ConditionService.create(ConditionType.Method,  { method: 'GET' });
            ConditionService.create(ConditionType.Method,  { method: 'POST' });

            const res = await request.get('/command/condition');
            expect(res.body.items.length).toBe(2);
            done();
        });

        it('returns no items if there are no conditions', async (done) => {
            const res = await request.get('/command/condition');
            expect(res.body.items.length).toBe(0);
            done();
        });
    });

    describe('POST /condition', () => {
        let intercept: Intercept;

        beforeEach(() => {
            intercept = InterceptService.create('foo');
        });

        it('returns an error if the intercept param is not present', async (done) => {
            const res = await request
                .post('/command/condition')
                .send({
                    rule: 'GET',
                    type: 'method',
                });

            expect(res.status).toBe(400);
            done();
        });

        it('returns an error if the type param is not present', async (done) => {
            const res = await request
                .post('/command/condition')
                .send({
                    intercept: intercept.id,
                    rule: 'GET',
                });

            expect(res.status).toBe(400);
            done();
        });

        it('returns an error if the rule param is not present', async (done) => {
            const res = await request
                .post('/command/condition')
                .send({
                    intercept: intercept.id,
                    rule: 'GET',
                });

            expect(res.status).toBe(400);
            done();
        });

        it('returns an error if the intercept is locked', async (done) => {
            intercept.lock();

            const res = await request
                .post('/command/condition')
                .send({
                    intercept: intercept.id,
                    rule: 'GET',
                    type: 'method',
                });

            expect(res.status).toBe(400);
            done();
        });

        it('returns the created condition', async (done) => {
            const res = await request
                .post('/command/condition')
                .send({
                    intercept: intercept.id,
                    rule: 'GET',
                    type: 'method',
                });

            expect(res.body.data.rule).toBe('GET');
            expect(res.body.data.type).toBe('method');
            expect(res.status).toBe(201);
            done();
        });

        it('adds the condition to the intercept', async (done) => {
            const res = await request
                .post('/command/condition')
                .send({
                    intercept: intercept.id,
                    rule: 'GET',
                    type: 'method',
                });

            expect(intercept.data.conditions.includes(res.body.id)).toBeTruthy();
            done();
        });
    });

    describe('GET /condition/:condition', () => {
        it('404s if the condition is not found', async (done) => {
            const res = await request.get('/command/condition/foo');
            expect(res.status).toBe(404);
            done();
        });

        it('returns the condition if found', async (done) => {
            const foo = ConditionService.create(ConditionType.Method, { method: 'GET' });

            const res = await request.get(`/command/condition/${foo.id}`);
            expect(res.body.id).toEqual(foo.id);
            done();
        });
    });

    describe('DELETE /condition/:condition', () => {
        let foo: Condition;
        beforeEach(() => {
            foo = ConditionService.create(ConditionType.Method, { method: 'GET' });
        });
        afterEach(() => {
            // Sanity check to make sure other items aren't being deleted
            expect(
                ConditionService.get(foo.id),
            ).toEqual(foo);
        });

        it('404s if condition is not found', async (done) => {
            const res = await request.delete('/command/condition/bar');
            expect(res.status).toBe(404);
            done();
        });

        it('deletes the condition', async (done) => {
            const bar = ConditionService.create(ConditionType.Method, { method: 'POST' });
            const res = await request.delete(`/command/condition/${bar.id}`);
            expect(res.status).toBe(204);
            expect(
                (await request.get(`/command/condition/${bar.id}`)).status,
            ).toBe(404);
            done();
        });

        it('removes the condition from all domains', async (done) => {
            const bar = ConditionService.create(ConditionType.Method, { method: 'POST' });
            const intercept = InterceptService.create('foo');
            intercept.addCondition(bar.id);

            const res = await request.delete(`/command/condition/${bar.id}`);
            expect(res.status).toBe(204);
            expect(intercept.data.conditions.includes(bar.id)).toBeFalsy();

            done();
        });
    });
});
