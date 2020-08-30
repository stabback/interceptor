import ServerErrorService from './server-error.service';
import TestDB from '@server/test.db';
import { ServerError, ServerErrorDocument } from './server-error.model';


describe('server-error service', () => {

    beforeAll(async () => await TestDB.connect());
    afterEach(async () => await TestDB.clearDatabase());
    afterAll(async () => await TestDB.closeDatabase());

    describe('create', () => {

        it('returns the created item', async () => {
            const bar = await ServerErrorService.create('bar', 'message');
            expect(bar).toBeInstanceOf(ServerError);
        });

        it('Saves the model in the database', async () => {
            const bar = await ServerErrorService.create('bar', 'message');
            const retrieved = await ServerError.findById(bar.id) as ServerErrorDocument

            expect(retrieved.id).toEqual(bar.id)
        });
    });
});
