describe('abstrax', function () {
    var myModel = null;

    beforeEach(function () {
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
                    url: '/api/users/${userId}',
                },
                updateUser: {
                    url: '/api/users/${userId}',
                    method: 'PATCH',
                }
            },
            defaults: {
                headers: {
                    'Fake-Header': 'foo'
                },
            }
        });
    });

    it('loads the function', function () {
        expect(abstrax).toBeDefined();
    });

    it('defines the request methods', function () {
        expect(myModel.getThings).toBeDefined();
        expect(myModel.getUsers).toBeDefined();
        expect(myModel.createUser).toBeDefined();
        expect(myModel.getUser).toBeDefined();
        expect(myModel.updateUser).toBeDefined();
    });

    it('requires a url for each request definition', function () {
        var badModel = abstrax({
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
    })

    describe('calling a request method', function () {
        beforeEach(function() {
            var responseData = {
                'status': 200,
                'contentType': 'application/json',
                'responseText': 'JSON user list'
            };

            spyOn($, 'ajax').and.callFake(function (req) {
                var d = $.Deferred();

                d.resolve(responseData.responseText, responseData.status, responseData);

                return d.promise();
            });
        });

        it('uses the global default settings', function () {
            var request = myModel.getUsers.fulfill();
                mostRecentArgs = $.ajax.calls.mostRecent().args[0];

            expect(mostRecentArgs.headers['Fake-Header']).toEqual('foo');
        });

        it('overrides the global settings with settings defined per request', function () {
            var request = myModel.getThings.fulfill();
                mostRecentArgs = $.ajax.calls.mostRecent().args[0];

            expect(mostRecentArgs.headers['Fake-Header']).toEqual('bar');
        });

        it('returns the ajax request object', function (done) {
            var request = myModel.getUsers.fulfill();
                mostRecentArgs = $.ajax.calls.mostRecent().args[0];

            expect(mostRecentArgs.url).toEqual('/api/users');
            expect(mostRecentArgs.method).toEqual('GET');
            request.then(function (data) {
                expect(data).toEqual('JSON user list');
                done();
            });
        });

        describe('with a payload', function () {
            it('calls $.ajax with the correct data value', function () {
                var payload = {
                        email: 'john@example.com',
                        password: 'abcd1234'
                    },
                    request = myModel.createUser.with(payload).fulfill(),
                    mostRecentArgs = $.ajax.calls.mostRecent().args[0];

                expect(mostRecentArgs.url).toEqual('/api/users');
                expect(mostRecentArgs.method).toEqual('POST');
                expect(mostRecentArgs.data).toEqual(payload);
            });
        });

        describe('with url keys', function () {
            it('calls $.ajax with the correct data value', function () {
                var request = myModel.getUser.for({ userId: '123'}).fulfill(),
                    mostRecentArgs = $.ajax.calls.mostRecent().args[0];

                    expect(mostRecentArgs.url).toEqual('/api/users/123');
                    expect(mostRecentArgs.method).toEqual('GET');
            });
        });

        describe('with url keys and payload', function () {
            it('calls $.ajax with the correct data value', function () {
                var payload = {
                        email: 'john@example.com',
                        password: 'abcd1234'
                    },
                    request = myModel.updateUser.for({ userId: '123'}).with(payload).fulfill(),
                    mostRecentArgs = $.ajax.calls.mostRecent().args[0];

                expect(mostRecentArgs.url).toEqual('/api/users/123');
                expect(mostRecentArgs.method).toEqual('PATCH');
                expect(mostRecentArgs.data).toEqual(payload);
            });
        });
    });
});
