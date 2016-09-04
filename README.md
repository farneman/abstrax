# Abstrax
=========

A simple wrapper on top of jQuery.ajax to reduce redundancy

## Usage

```
getSomething.fulfill(payload)
getSomething.with(payload).fulfill()
getSomething.for(specific).fulfill()
getSomething.for(specific).fulfill(payload)
getSomething.for(specific).with(payload).fulfill()
  .then(doSomething);
```

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
            interpolate: true
        },
        updateUser: {
            url: "/api/users/${userId}",
            method: "patch",
            interpolate: true
        }
    },
    defaults: {
        headers: {
            "Fake-Header": 'foo'
        },
    }
});

myModel.getUsers.fulfill()
    .then(success, failure);

myModel.getUser.for(urlKeys).fulfill()
    .then(success, failure);

myModel.createUser.with(dataPayload).fulfill()
    .then(success, failure);

myModel.createUser.with(dataPayload).fulfill()
    .then(success, failure);

var getCurrentUser = myModel.getUser.for(urlKeys);
getCurrentUser.fulfill()
    .then(success, failure);

myModel.updateUser.for(urlKeys).with(dataPayload).fulfill()
    .then(success, failure);

var updateCurrentUser = myModel.updateUser.for(urlKeys);
updateCurrentUser.with(dataPayload).fulfill()
    .then(success, failure);
```
