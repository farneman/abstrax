# Abstrax
=========

A simple wrapper on top of jQuery.ajax to reduce redundancy

## Usage

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
