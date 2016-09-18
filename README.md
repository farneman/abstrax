# Abstrax
=========

A simple wrapper on top of jQuery.ajax to reduce redundancy

## Installation

```
npm install --save abstrax
```

See `package.json` for available formats.

Abstrax requires `jQuery` as a peer dependency.

## Usage

Pass in a config object containing a list of `requests` and any `defaults` for
`jQuery.ajax`. `abstrax` will return an object of functions matching the keys
of your `requests` object.

Calling any of the request functions will return a jQuery promise. Data
payloads for `jQuery.ajax` can be passed as an argument to a request function.
Arguments for templated request urls can be applied by calling `.for` on a
request function object with a keyed object argument.

Example usage:

```
var myModel = abstrax({
    requests: {
        getThings: {
            url: "/api/things",
            headers: {
                'Fake-Header': 'bar'
            }
        },
        getUsers: {
            url: "/api/users"
        },
        createUser: {
            url: "/api/users",
            method: "post"
        },
        getUser: {
            url: "/api/users/${userId}",
        },
        updateUser: {
            url: "/api/users/${userId}",
            method: "patch",
        }
    },
    defaults: {
        headers: {
            "Fake-Header": 'foo'
        },
    }
});

myModel.getUsers()
    .then(success, failure);

myModel.getUser.for(urlKeys)()
    .then(success, failure);

myModel.createUser(dataPayload)
    .then(success, failure);

var getCurrentUser = myModel.getUser.for(urlKeys);
getCurrentUser()
    .then(success, failure);

myModel.updateUser.for(urlKeys)(dataPayload)
    .then(success, failure);

var updateCurrentUser = myModel.updateUser.for(urlKeys);
updateCurrentUser(dataPayload)
    .then(success, failure);
```

## License

MIT
