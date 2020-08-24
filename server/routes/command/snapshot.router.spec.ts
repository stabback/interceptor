import app from '@server/app';
import { Condition, ConditionService, ConditionType } from '@server/resources/condition';
import { Domain, DomainService } from '@server/resources/domain';
import { ApiError, ErrorService } from '@server/resources/error';
import { Intercept, InterceptService } from '@server/resources/intercept';
import { Response, ResponseService } from '@server/resources/response';
import { Snapshot, SnapshotService } from '@server/resources/snapshot';
import { User, UserService } from '@server/resources/user';
import supertest from 'supertest';

const request = supertest(app);

const currentState = () => {

    const resources = {
        condition: ConditionService.items,
        domain: DomainService.items,
        error: ErrorService.items,
        intercept: InterceptService.items,
        response: ResponseService.items,
        user: UserService.items,
    };

    return Object.entries(resources).reduce((acc: any, [key, items]) => {
        return {
            ...acc,
            [key]: Object.values(items).map((item) => item.asResponse),
        };
    }, {});

};

describe('snapshot route', () => {
    beforeEach(() => {
        SnapshotService.items = [];
        UserService.items = [];
        DomainService.items = [];
        InterceptService.items = [];
        ConditionService.items = [];
        ResponseService.items = [];
        ErrorService.items = [];

        const user = {
            A: UserService.create('usera'),
            B: UserService.create('userb'),
        };

        const domain = {
            A: DomainService.create('domaina', 'http://example.com/a', 'Domain A'),
            B: DomainService.create('domainb', 'http://example.com/b', 'Domain B'),
        };

        const intercept = {
            A: InterceptService.create('interceptA'),
            B: InterceptService.create('interceptB'),
        };

        const condition = {
            A: ConditionService.create(ConditionType.Method, { method: 'GET' }),
            B: ConditionService.create(ConditionType.Method, { method: 'POST' }),
        };

        const response = {
            A: ResponseService.create('responseA', 200, {}, 'Response A', 200),
            B: ResponseService.create('responseB', 200, {}, 'Response B', 200),
        };

        const error = {};

        domain.A.addIntercept(intercept.A.id);
        domain.B.addIntercept(intercept.B.id);

        intercept.A.addCondition(condition.A.id);
        intercept.B.addCondition(condition.B.id);

        intercept.A.addResponse(response.A.id);
        intercept.B.addResponse(response.B.id);

    });

    describe('GET /snapshot', () => {
        it('returns a 200', async (done) => {
            const res = await request.get('/command/snapshot');
            expect(res.status).toBe(200);
            done();
        });

        it('returns a list of items', async (done) => {
            const res = await request.get('/command/snapshot');
            expect(res.body.items).toBeInstanceOf(Array);
            done();
        });

        it('returns a number of items equal to the number of snapshots', async (done) => {
            SnapshotService.create('foo');
            SnapshotService.create('bar');

            const res = await request.get('/command/snapshot');
            expect(res.body.items.length).toBe(2);
            done();
        });

        it('returns no items if there are no snapshots', async (done) => {
            const res = await request.get('/command/snapshot');
            expect(res.body.items.length).toBe(0);
            done();
        });
    });

    describe('POST /snapshot', () => {
        it('returns the created snapshot', async (done) => {
            const res = await request
                .post('/command/snapshot')
                .send({
                    title: 'foo',
                });

            expect(res.body.data.meta.title).toBe('foo');
            expect(res.status).toBe(201);

            expect(res.body.data.model).toEqual(currentState());
            done();
        });
    });

    describe('GET /snapshot/:snapshot', () => {
        it('404s if the snapshot is not found', async (done) => {
            const res = await request.get('/command/snapshot/foo');
            expect(res.status).toBe(404);
            done();
        });

        it('returns the snapshot if found', async (done) => {
            const foo = SnapshotService.create('foo');

            const res = await request.get(`/command/snapshot/${foo.id}`);
            expect(res.body.id).toEqual(foo.id);
            done();
        });
    });

    describe('DELETE /snapshot/:snapshot', () => {
        let foo: Snapshot;
        beforeEach(() => {
            foo = SnapshotService.create('foo');
        });
        afterEach(() => {
            // Sanity check to make sure other items aren't being deleted
            expect(
                SnapshotService.get(foo.id),
            ).toEqual(foo);
        });

        it('404s if snapshot is not found', async (done) => {
            const res = await request.delete('/command/snapshot/bar');
            expect(res.status).toBe(404);
            done();
        });

        it('deletes the snapshot', async (done) => {
            const bar = SnapshotService.create('bar');
            const res = await request.delete(`/command/snapshot/${bar.id}`);
            expect(res.status).toBe(204);
            expect(
                (await request.get(`/command/snapshot/${bar.id}`)).status,
            ).toBe(404);
            done();
        });
    });

    describe('POST /snapshot/:snapshot/restore', () => {
        let foo: Snapshot;
        beforeEach(() => {
            foo = SnapshotService.create('foo');
        });

        it('404s if snapshot is not found', async (done) => {
            const res = await request.post(`/command/snapshot/foobar/restore`);
            expect(res.status).toBe(404);
            done();
        });

        it('returns a 204 on success', async (done) => {
            const res = await request.post(`/command/snapshot/${foo.id}/restore`);

            expect(res.status).toBe(204);
            done();
        });

        it('restores the state', async (done) => {
            const initialSnapshot = await request.get(`/command/snapshot/${foo.id}`);
            expect(initialSnapshot.body.data.model).toEqual(currentState());

            DomainService.remove(
                (DomainService.getByDataKey('name', 'domainb') as Domain).id,
            );

            expect(initialSnapshot.body.data.model).not.toEqual(currentState());

            await request.post(`/command/snapshot/${foo.id}/restore`);

            expect(initialSnapshot.body.data.model).toEqual(currentState());

            done();
        });
    });
});
