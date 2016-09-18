import jQuery from 'jquery';
import abstrax from '../src/index.js';

describe('abstrax', () => {
  let myModel = null;

  const ajaxArgsFromCall = () => jQuery.ajax.calls.mostRecent().args[0];
  const expectFakeHeader = (request, value) => {
    myModel[request]();

    expect(ajaxArgsFromCall().headers['Fake-Header']).toEqual(value);
  };

  beforeEach(() => {
    myModel = abstrax({
      requests: {
        getThings: {
          url: '/api/things',
          headers: {
            'Fake-Header': 'bar'
          }
        },
        getUsers: {
          url: '/api/users'
        },
        createUser: {
          url: '/api/users',
          method: 'POST'
        },
        getUser: {
          url: '/api/users/${userId}'
        },
        updateUser: {
          url: '/api/users/${userId}',
          method: 'PATCH'
        }
      },
      defaults: {
        headers: {
          'Fake-Header': 'foo'
        }
      }
    });
  });

  it('loads the function', () => expect(abstrax).toBeDefined());

  it('defines the request methods', () => {
    expect(myModel.getThings).toBeDefined();
    expect(myModel.getUsers).toBeDefined();
    expect(myModel.createUser).toBeDefined();
    expect(myModel.getUser).toBeDefined();
    expect(myModel.updateUser).toBeDefined();
  });

  it('requires a url for each request definition', () => {
    const badModel = abstrax({
      requests: {
        getSomething: {
          method: 'GET'
        },
        getElse: {
          url: '/else'
        }
      }
    });

    expect(badModel.getSomething).toBeUndefined();
    expect(typeof badModel.getElse).toBeDefined();
  });

  describe('calling a request method', () => {
    beforeEach(() => {
      const responseData = {
          status: 200,
          contentType: 'application/json',
          responseText: 'JSON user list'
        },
        ajaxFake = () => {
          const d = jQuery.Deferred();

          d.resolve(responseData.responseText, responseData.status, responseData);

          return d.promise();
        };

      spyOn(jQuery, 'ajax').and.callFake(ajaxFake);
    });

    it('uses the global default settings', () => {
      expectFakeHeader('getUsers', 'foo');
    });

    it('overrides the global settings with settings defined per request', () => {
      expectFakeHeader('getThings', 'bar');
    });

    it('returns the ajax request object', (done) => {
      const request = myModel.getUsers(),
        mostRecentArgs = ajaxArgsFromCall();

      expect(mostRecentArgs.url).toEqual('/api/users');
      expect(mostRecentArgs.method).toEqual('GET');
      request.then((data) => {
        expect(data).toEqual('JSON user list');
        done();
      });
    });

    describe('with a payload', () => {
      it('calls jQuery.ajax with the correct data value', () => {
        const payload = {
          email: 'john@example.com',
          password: 'abcd1234'
        };

        myModel.createUser(payload);

        const mostRecentArgs = ajaxArgsFromCall();

        expect(mostRecentArgs.url).toEqual('/api/users');
        expect(mostRecentArgs.method).toEqual('POST');
        expect(mostRecentArgs.data).toEqual(payload);
      });
    });

    describe('without necessary url keys', () => {
      it('throws an error', () => {
        expect(myModel.getUser).toThrow(new Error('Must supply url keys before calling fulfill'));
      });
    });

    describe('with url keys', () => {
      it('calls jQuery.ajax with the correctly keyed url', () => {
        myModel.getUser.for({userId: '123'})();

        const mostRecentArgs = ajaxArgsFromCall();

        expect(mostRecentArgs.url).toEqual('/api/users/123');
        expect(mostRecentArgs.method).toEqual('GET');
      });
    });

    describe('with unnecessary url keys', () => {
      it('calls jQuery.ajax with the correct url', () => {
        myModel.getThings.for({
          someKey: '1',
          anotherKey: 'abc'
        })();

        const mostRecentArgs = ajaxArgsFromCall();

        expect(mostRecentArgs.url).toEqual('/api/things');
        expect(mostRecentArgs.method).toEqual('GET');
      });
    });

    describe('with url keys and payload', () => {
      it('calls jQuery.ajax with the correct data value', () => {
        const payload = {
          email: 'john@example.com',
          password: 'abcd1234'
        };

        myModel.updateUser.for({ userId: '123'})(payload);

        const mostRecentArgs = ajaxArgsFromCall();

        expect(mostRecentArgs.url).toEqual('/api/users/123');
        expect(mostRecentArgs.method).toEqual('PATCH');
        expect(mostRecentArgs.data).toEqual(payload);
      });
    });
  });
});
