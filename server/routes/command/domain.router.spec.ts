import app from '@server/app';
import { Domain, DomainService } from '@server/resources/domain';
import { Intercept, InterceptService } from '@server/resources/intercept';
import supertest from 'supertest';

const request = supertest(app);

describe('domain route', () => {
    beforeEach(() => {
        DomainService.items = [];
    });

    describe('GET /domain', () => {
        it('returns a 200', async (done) => {
            const res = await request.get('/command/domain');
            expect(res.status).toBe(200);
            done();
        });

        it('returns a list of items', async (done) => {
            const res = await request.get('/command/domain');
            expect(res.body.items).toBeInstanceOf(Array);
            done();
        });

        it('returns a number of items equal to the number of domains', async (done) => {
            DomainService.create('foo', 'foo', 'foo');
            DomainService.create('bar', 'bar', 'bar');

            const res = await request.get('/command/domain');
            expect(res.body.items.length).toBe(2);
            done();
        });

        it('returns no items if there are no domains', async (done) => {
            const res = await request.get('/command/domain');
            expect(res.body.items.length).toBe(0);
            done();
        });
    });

    describe('POST /domain', () => {
        it('returns an error if the name param is not present', async (done) => {
            DomainService.create('foo', 'http://example.com', 'foo');

            const res = await request
                .post('/command/domain')
                .send({
                    key: 'bar',
                    url: 'bar',
                });

            expect(res.status).toBe(400);
            done();
        });

        it('returns an error if the key param is not present', async (done) => {
            DomainService.create('foo', 'http://example.com', 'foo');

            const res = await request
                .post('/command/domain')
                .send({
                    name: 'bar',
                    url: 'bar',
                });

            expect(res.status).toBe(400);
            done();
        });

        it('returns an error if the url param is not present', async (done) => {
            DomainService.create('foo', 'http://example.com', 'foo');

            const res = await request
                .post('/command/domain')
                .send({
                    key: 'bar',
                    name: 'bar',
                });

            expect(res.status).toBe(400);
            done();
        });

        it('returns an error if the domain key is not unique', async (done) => {
            await request
                .post('/command/domain')
                .send({
                    key: 'bar',
                    name: 'bar',
                    url: 'bar',
                });

            const res = await request
                .post('/command/domain')
                .send({
                    key: 'bar',
                    name: 'bar',
                    url: 'bar',
                });

            expect(res.status).toBe(400);
            done();
        });

        it('returns the created domain', async (done) => {
            const res = await request
                .post('/command/domain')
                .send({
                    key: 'bar',
                    name: 'bar',
                    url: 'bar',
                });

            expect(res.body.data.key).toBe('bar');
            expect(res.body.data.name).toBe('bar');
            expect(res.body.data.url).toBe('bar');
            expect(res.status).toBe(201);
            done();
        });
    });

    describe('GET /domain/:domain', () => {
        it('404s if the domain is not found', async (done) => {
            const res = await request.get('/command/domain/foo');
            expect(res.status).toBe(404);
            done();
        });

        it('returns the domain if found', async (done) => {
            const foo = DomainService.create('foo', 'foo', 'foo');

            const res = await request.get(`/command/domain/${foo.id}`);
            expect(res.body.id).toEqual(foo.id);
            done();
        });
    });

    describe('DELETE /domain/:domain', () => {
        let foo: Domain;
        beforeEach(() => {
            foo = DomainService.create('foo', 'foo', 'foo');
        });
        afterEach(() => {
            // Sanity check to make sure other items aren't being deleted
            expect(
                DomainService.get(foo.id),
            ).toEqual(foo);
        });

        it('404s if domain is not found', async (done) => {
            const res = await request.delete('/command/domain/bar');
            expect(res.status).toBe(404);
            done();
        });

        it('deletes the domain', async (done) => {
            const bar = DomainService.create('bar', 'bar', 'bar');
            const res = await request.delete(`/command/domain/${bar.id}`);
            expect(res.status).toBe(204);
            expect(
                (await request.get(`/command/domain/${bar.id}`)).status,
            ).toBe(404);
            done();
        });
    });

    describe('PATCH /domain/:domain', () => {
        let foo: Domain;
        beforeEach(() => {
            foo = DomainService.create('foo', 'foo', 'foo');
        });

        it('404s if domain is not found', async (done) => {
            const res = await request.patch('/command/domain/bar');
            expect(res.status).toBe(404);
            done();
        });

        it('updates an domain', async (done) => {

            const before = await request.get(`/command/domain/${foo.id}`);
            expect(before.body.data.locked).toBeFalsy();

            await request
                .patch(`/command/domain/${foo.id}`)
                .send([{path: '/data/locked', op: 'replace', value: true}]);

            const after = await request.get(`/command/domain/${foo.id}`);
            expect(after.body.data.locked).toBeTruthy();
            done();
        });

        it('returns the updated domain in the response', async (done) => {
            const res = await request
                .patch(`/command/domain/${foo.id}`)
                .send([{path: '/data/url', op: 'replace', value: 'FOO'}]);

            expect(res.status).toBe(200);
            expect(res.body.data.url).toBe('FOO');
            done();
        });

        it('errors if not an array of patch operations', async (done) => {
            const res = await request
                .patch(`/command/domain/${foo.id}`)
                .send('foobar');

            expect(res.status).toBe(400);
            done();
        });

    });

    describe('GET /domain/:domain/intercept', () => {
        let foo: Domain;
        let bar: Domain;

        let interceptA: Intercept;
        let interceptB: Intercept;
        let interceptC: Intercept;

        beforeEach(() => {
            foo = DomainService.create('foo', 'foo', 'foo');
            bar = DomainService.create('bar', 'bar', 'bar');

            interceptA = InterceptService.create('a');
            interceptB = InterceptService.create('b');
            interceptC = InterceptService.create('c');

            foo.addIntercept(interceptA.id);
            foo.addIntercept(interceptB.id);
            bar.addIntercept(interceptC.id);
        });

        it('404s if domain is not found', async (done) => {
            const res = await request.get('/command/domain/foobar/intercept');
            expect(res.status).toBe(404);
            done();
        });

        it('returns all intercept for an domain', async (done) => {
            const res = await request.get(`/command/domain/${foo.id}/intercept`);
            expect(res.body.items.length).toBe(2);
            expect(res.body.items[0].id).toBe(interceptA.id);
            expect(res.body.items[1].id).toBe(interceptB.id);
            done();
        });
        it('does not return intercepts that do not belong to an domain', async (done) => {
            const res = await request.get(`/command/domain/${foo.id}/intercept`);
            expect(
                res.body.items.find((intercept: any) => intercept.id === interceptC.id),
            ).toBeFalsy();
            done();
        });
    });

});
