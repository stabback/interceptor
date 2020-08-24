import app from '@server/app';
import { Intercept, InterceptService } from '@server/resources/intercept';
import { Response, ResponseService } from '@server/resources/response';
import supertest from 'supertest';

const request = supertest(app);

describe('response route', () => {
    beforeEach(() => {
        ResponseService.items = [];
    });

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
            ResponseService.create('foo', 200, {}, 'foo', 200);
            ResponseService.create('bar', 200, {}, 'bar', 200);

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
        let intercept: Intercept;

        beforeEach(() => {
            intercept = InterceptService.create('foo');
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

            expect(intercept.data.responses.includes(res.body.id)).toBeTruthy();
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
            const foo = ResponseService.create('foo', 200, {}, 'foo', 200);

            const res = await request.get(`/command/response/${foo.id}`);
            expect(res.body.id).toEqual(foo.id);
            done();
        });
    });

    describe('DELETE /response/:response', () => {
        let foo: Response;
        beforeEach(() => {
            foo = ResponseService.create('foo', 200, {}, 'foo', 200);
        });
        afterEach(() => {
            // Sanity check to make sure other items aren't being deleted
            expect(
                ResponseService.get(foo.id),
            ).toEqual(foo);
        });

        it('404s if response is not found', async (done) => {
            const res = await request.delete('/command/response/bar');
            expect(res.status).toBe(404);
            done();
        });

        it('deletes the response', async (done) => {
            const bar = ResponseService.create('bar', 200, {}, 'bar', 200);
            const res = await request.delete(`/command/response/${bar.id}`);
            expect(res.status).toBe(204);
            expect(
                (await request.get(`/command/response/${bar.id}`)).status,
            ).toBe(404);
            done();
        });

        it('removes the response from all domains', async (done) => {
            const bar = ResponseService.create('bar', 200, {}, 'bar', 200);
            const intercept = InterceptService.create('foo');
            intercept.addResponse(bar.id);

            const res = await request.delete(`/command/response/${bar.id}`);
            expect(res.status).toBe(204);
            expect(intercept.data.responses.includes(bar.id)).toBeFalsy();

            done();
        });
    });
});
