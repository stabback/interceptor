import { Domain } from './domain.model';

describe('Domain model', () => {
    let domain: Domain;

    beforeEach(() => {
        domain = new Domain({
            intercepts: ['intercept1', 'intercept2'],
            key: 'key',
            name: 'foo',
            url: 'foo.com',
        }, 'id');
    });

    it('adds intercepts', () => {
        domain.addIntercept('intercept3');
        expect(domain.data.intercepts.length).toBe(3);
    });

    it('removes intercepts', () => {
        domain.removeIntercept('intercept1');
        expect(domain.data.intercepts.length).toBe(1);
    });
});
