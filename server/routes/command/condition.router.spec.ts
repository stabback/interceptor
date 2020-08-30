import app from '@server/app';
import { ConditionService, ConditionDocument } from '@server/resources/condition';
import { InterceptService, InterceptDocument } from '@server/resources/intercept';
import supertest from 'supertest';
import TestDB from '@server/test.db';

const request = supertest(app);

describe('condition route', () => {
    beforeAll(async () => await TestDB.connect());
    afterEach(async () => await TestDB.clearDatabase());
    afterAll(async () => await TestDB.closeDatabase());

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
            ConditionService.create('method', { method: 'GET' });
            ConditionService.create('method', { method: 'POST' });

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
        let intercept: InterceptDocument;

        beforeEach(async () => {
            intercept = await InterceptService.create('foo');
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
            request
                .post('/command/condition')
                .send({
                    intercept: intercept.id,
                    rule: 'GET',
                })
                .expect(400, done)
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
                    rule: {
                        method: 'GET'
                    },
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
                    rule: {
                        method: 'GET'
                    },
                    conditionType: 'method',
                });

            expect(res.body.data.rule).toStrictEqual({ method: 'GET' });
            expect(res.body.data.conditionType).toBe('method');
            expect(res.status).toBe(201);
            done();
        });

        it('adds the condition to the intercept', async (done) => {
            const res = await request
                .post('/command/condition')
                .send({
                    intercept: intercept.id,
                    rule: {
                        method: 'GET'
                    },
                    conditionType: 'method',
                });
            
            const updatedIntercept = await InterceptService.get(intercept.id) as InterceptDocument;
            expect(updatedIntercept.conditions.includes(res.body.id)).toBeTruthy();
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
            const foo = await ConditionService.create('method', { method: 'GET' });

            const res = await request.get(`/command/condition/${foo.id}`);
            expect(res.body.id).toEqual(foo.id);
            done();
        });
    });

    describe('DELETE /condition/:condition', () => {
        let foo: ConditionDocument;

        beforeEach(async () => {
            foo = await ConditionService.create('method', { method: 'GET' });
        });
        afterEach(async () => {
            // Sanity check to make sure other items aren't being deleted
            const item = await ConditionService.get(foo.id) as ConditionDocument;
            expect(item.id).toEqual(foo.id);
        });

        it('204s if condition is not found', async (done) => {
            request
                .delete('/command/condition/abc123def456')
                .expect(204, done)
        });

        it('deletes the condition', async (done) => {
            const bar = await ConditionService.create('method', { method: 'POST' });
            const res = await request.delete(`/command/condition/${bar.id}`);
            expect(res.status).toBe(204);

            const missingCondition = await request.get(`/command/condition/${bar.id}`)
            expect(missingCondition.status).toBe(404);
            done();
        });

        it('removes the condition from all domains', async (done) => {
            const bar = await ConditionService.create('method', { method: 'POST' });
            const intercept: InterceptDocument = await InterceptService.create('foo');
            await intercept.addCondition(bar.id);

            const res = await request.delete(`/command/condition/${bar.id}`);

            const updatedIntercept = await InterceptService.get(intercept.id) as InterceptDocument;
            expect(res.status).toBe(204);
            expect(updatedIntercept.conditions.includes(bar.id)).toBeFalsy();

            done();
        });
    });
});
