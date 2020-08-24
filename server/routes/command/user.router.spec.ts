import app from '@server/app';
import { Intercept, InterceptService } from '@server/resources/intercept';
import { User, UserService } from '@server/resources/user';
import supertest from 'supertest';

const request = supertest(app);

describe('user route', () => {
    beforeEach(() => {
        UserService.items = [];
    });

    describe('GET /user', () => {
        it('returns a 200', (done) => {
            request
                .get('/command/user')
                .expect(200, done);
        });

        it('returns a list of items', async (done) => {
            const res = await request.get('/command/user');
            expect(res.body.items).toBeInstanceOf(Array);
            done();
        });

        it('returns a number of items equal to the number of users', async (done) => {
            UserService.create('foo');
            UserService.create('bar');

            const res = await request.get('/command/user');
            expect(res.body.items.length).toBe(2);
            done();
        });

        it('returns no items if there are no users', async (done) => {
            const res = await request.get('/command/user');
            expect(res.body.items.length).toBe(0);
            done();
        });
    });

    describe('POST /user', () => {
        it('returns an error if the key param is not present', async (done) => {
            UserService.create('foo');

            const res = await request
                .post('/command/user')
                .send({});

            expect(res.status).toBe(400);
            done();
        });

        it('returns an error if the user key is not unique', async (done) => {
            await request
                .post('/command/user')
                .send({
                    key: 'bar',
                    name: 'bar',
                    url: 'bar',
                });

            const res = await request
                .post('/command/user')
                .send({
                    key: 'bar',
                    name: 'bar',
                    url: 'bar',
                });

            expect(res.status).toBe(400);
            done();
        });

        it('returns the created user', async (done) => {
            const res = await request
                .post('/command/user')
                .send({
                    key: 'bar',
                    name: 'bar',
                    url: 'bar',
                });

            expect(res.body.data.key).toBe('bar');
            expect(res.status).toBe(201);
            done();
        });
    });

    describe('GET /user/:user', () => {
        it('404s if the user is not found', async (done) => {
            const res = await request.get('/command/user/foo');
            expect(res.status).toBe(404);
            done();
        });

        it('returns the user if found', async (done) => {
            const foo = UserService.create('foo');

            const res = await request.get(`/command/user/${foo.id}`);
            expect(res.body.id).toEqual(foo.id);
            done();
        });
    });

    describe('DELETE /user/:user', () => {
        let foo: User;
        beforeEach(() => {
            foo = UserService.create('foo');
        });
        afterEach(() => {
            // Sanity check to make sure other items aren't being deleted
            expect(
                UserService.get(foo.id),
            ).toEqual(foo);
        });

        it('404s if user is not found', async (done) => {
            const res = await request.delete('/command/user/bar');
            expect(res.status).toBe(404);
            done();
        });

        it('deletes the user', async (done) => {
            const bar = UserService.create('bar');
            const res = await request.delete(`/command/user/${bar.id}`);
            expect(res.status).toBe(204);
            expect(
                (await request.get(`/command/user/${bar.id}`)).status,
            ).toBe(404);
            done();
        });
    });

    describe('PATCH /user/:user', () => {
        let foo: User;
        beforeEach(() => {
            foo = UserService.create('foo');
        });

        it('404s if user is not found', async (done) => {
            const res = await request.patch('/command/user/bar');
            expect(res.status).toBe(404);
            done();
        });

        it('updates an user', async (done) => {

            const before = await request.get(`/command/user/${foo.id}`);
            expect(before.body.data.locked).toBeFalsy();

            await request
                .patch(`/command/user/${foo.id}`)
                .send([{path: '/data/locked', op: 'replace', value: true}]);

            const after = await request.get(`/command/user/${foo.id}`);
            expect(after.body.data.locked).toBeTruthy();
            done();
        });

        it('returns the updated user in the response', async (done) => {
            const res = await request
                .patch(`/command/user/${foo.id}`)
                .send([{path: '/data/url', op: 'replace', value: 'FOO'}]);

            expect(res.status).toBe(200);
            expect(res.body.data.url).toBe('FOO');
            done();
        });

        it('errors if not an array of patch operations', async (done) => {
            const res = await request
                .patch(`/command/user/${foo.id}`)
                .send('foobar');

            expect(res.status).toBe(400);
            done();
        });
    });
});
