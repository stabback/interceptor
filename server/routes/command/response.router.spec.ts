import app from '@server/app';
import { InterceptService, InterceptDocument } from '@server/resources/intercept';
import { ResponseService, ResponseDocument } from '@server/resources/response';
import supertest from 'supertest';
import TestDB from '@server/test.db';

const request = supertest(app);

describe('response route', () => {
    beforeAll(async () => await TestDB.connect());
    afterEach(async () => await TestDB.clearDatabase());
    afterAll(async () => await TestDB.closeDatabase());

    describe('GET /response', () => {
        it('returns a 200', async (done) => {
            const res = await request.get('/command/response');
            expect(res.status).toBe(200);
            done();
        });

        it('returns a list of items', async (done) => {
            const res = await request.get('/command/response');
            expect(res.body.items).toBeInstanceOf(Array);
            done();
        });

        it('returns a number of items equal to the number of responses', async (done) => {
            await ResponseService.create('foo', 'foo', [], 200, 200);
            await ResponseService.create('bar', 'bar', [], 200, 200);

            const res = await request.get('/command/response');
            expect(res.body.items.length).toBe(2);
            done();
        });

        it('returns no items if there are no responses', async (done) => {
            const res = await request.get('/command/response');
            expect(res.body.items.length).toBe(0);
            done();
        });
    });

    describe('POST /response', () => {
        let intercept: InterceptDocument;

        beforeEach(async () => {
            intercept = await InterceptService.create('foo');
        });

        it('returns an error if the intercept param is not present', (done) => {
            request
                .post('/command/response')
                .send({
                    name: 'bar',
                })
                .expect(400, done)
        });

        it('returns an error if the name param is not present', async (done) => {
            const res = await request
                .post('/command/response')
                .send({
                    intercept: intercept.id,
                });

            expect(res.status).toBe(400);
            done();
        });

        it('returns an error if the response name is not unique', async (done) => {
            await request
                .post('/command/response')
                .send({
                    intercept: intercept.id,
                    name: 'bar',
                });

            const res = await request
                .post('/command/response')
                .send({
                    intercept: intercept.id,
                    name: 'bar',
                });

            expect(res.status).toBe(400);
            done();
        });

        it('returns the created response', async (done) => {
            const res = await request
                .post('/command/response')
                .send({
                    intercept: intercept.id,
                    name: 'bar',
                });
        

            expect(res.body.data.name).toBe('bar');
            expect(res.status).toBe(201);
            done();
        });

        it('adds the response to the intercept', async (done) => {
            const res = await request
                .post('/command/response')
                .send({
                    intercept: intercept.id,
                    name: 'bar',
                });
            
            const updatedIntercept = await InterceptService.get(intercept.id) as InterceptDocument

            expect(updatedIntercept.responses.includes(res.body.id)).toBeTruthy();
            done();
        });
    });

    describe('GET /response/:response', () => {
        it('404s if the response is not found', async (done) => {
            const res = await request.get('/command/response/foo');
            expect(res.status).toBe(404);
            done();
        });

        it('returns the response if found', async (done) => {
            const foo = await ResponseService.create('foo', 'foo', [], 200, 200);

            const res = await request.get(`/command/response/${foo.id}`);
            expect(res.body.id).toEqual(foo.id);
            done();
        });
    });

    describe('DELETE /response/:response', () => {
        let foo: ResponseDocument;
        beforeEach(async () => {
            foo = await ResponseService.create('foo', 'foo', [], 200, 200);
        });
        afterEach(async () => {
            // Sanity check to make sure other items aren't being deleted
            expect(
                (await ResponseService.get(foo.id) as ResponseDocument).id,
            ).toEqual(foo.id);
        });

        it('204s if response is not found', async (done) => {
            const res = await request.delete('/command/response/bar');
            expect(res.status).toBe(204);
            done();
        });

        it('deletes the response', async (done) => {
            const bar = await ResponseService.create('bar', 'bar', [], 200, 200);
            const res = await request.delete(`/command/response/${bar.id}`);
            expect(res.status).toBe(204);

            const missingBar = await request.get(`/command/response/${bar.id}`);
            expect(missingBar.status).toBe(404);
            done();
        });

        it('removes the response from all domains', async (done) => {
            const bar = await ResponseService.create('bar', 'bar', [], 200, 200);
            const intercept = await InterceptService.create('foo');
            await intercept.addResponse(bar.id);

            const res = await request.delete(`/command/response/${bar.id}`);
            expect(res.status).toBe(204);

            const updatedIntercept = await InterceptService.get(intercept.id) as InterceptDocument;
            expect(updatedIntercept.responses.includes(bar.id)).toBeFalsy();

            done();
        });
    });
});
