import { BaseModel } from './model';
import BaseService from './service';

interface MockModelData {
    name: string;
}
class MockModel extends BaseModel<MockModelData> {
    constructor(
        public data: MockModelData,
        id?: string,
    ) { super(data, 'domain', id); }
}

// tslint:disable-next-line: max-classes-per-file
class MockConstructor extends BaseService< MockModel > {
    constructor() {
        super('domain', MockModel);
    }
}

describe('base service', () => {
    let service: MockConstructor;

    const foo = new MockModel({name: 'foo'}, 'foo');
    const bar = new MockModel({name: 'bar'}, 'bar');
    const baz = new MockModel({name: 'baz'}, 'baz');

    beforeEach(() => {
        service = new MockConstructor();

        service.items = [
            foo,
            bar,
            baz,
        ];
    });

    it('stores items', () => {
        expect(service.items.length).toBe(3);
    });

    it('Retrieves by ID', () => {
        expect(service.get('foo')).toEqual(foo);
    });

    it('removes by ID', () => {
        service.remove('foo');
        expect(service.get('foo')).toBeUndefined();
    });

    it('overrides items on save', () => {
        service._items = [foo];
        service.save();
        expect(service.items.length).toBe(1);
    });

    describe('buildPayload', () => {
        it('returns an array of items', () => {
            expect(service.buildPayload([foo, bar, baz]).items.length).toBe(3);
        });

        it('uses the model to serialze itself', () => {
            const asResponseMock = jest.fn();

            const model = new MockModel({name: 'foo'}, 'foo');

            Object.defineProperty(model, 'asResponse', {
                get: asResponseMock,
            });

            service.buildPayload([model]);

            expect(asResponseMock).toBeCalled();
        });
    });

});
