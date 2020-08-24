# Interceptor - Server

The server is one half of Interceptor.

## Quickstart

To start the server on its own, run
```
yarn && yarn start
```

This will start the server at `http://localhost:8080`.

## Routes

* `/ui/*` - Proxies requests to `http://localhost:3600`, where the Vue app will start up.  This should probably be only run in dev mode so that nginx / Apache can handle this proxy.
* `/command/:resource` - RESTful endpoints for resources.  These endpoints are used to control Interceptor and setup state.  Domains, Responses, Intercepts, etc are managed through this route.
* `/call/:user/:Domain/**` - Intercept / Proxy route.  Interceptor will watch for all requests here and compare them to known intercepts.  If no intercepts are triggered, it will proxy the request to where it is going.  If an intercept is triggered, it will either return a mock response, or proxy the request depending on what the user has selected.

## Resources

Interceptor has 6 resource types, each more or less handled the same way.  Each resource consists of:
* A model.  These are located at `/server/resources/RESOURCE/RESOURCE.model.ts`.  The model describes the resource and provides methods for interacting with an individual instance of a resource.
* A service.  These are located at `/server/resources/RESOURCE/RESOURCE.service.ts`.  The service provides methods for interacting with a resource.  This includes storing / retrieving the instances from whatever storage method is used.
* A series of controllers.  These map to `/command/:resource` endpoints.  They are located at `/server/controllers/RESOURCE/*`.

### User

A user is a person or system interacting with Interceptor.  Interceptor may be setup to intercept requests to an api that returns a list of cities.  A response could be created to return 5 cities, and another to return a 500 error.  By supporting users, Interceptor can allow different people to receive different responses to the same request based on their choices.

Users are not authenticated, and anyone can access any user.  This may change in the future, however has been left this way for simplicity.  Users do not contain any information beyond their key.  A 'be good people' policy applies.

A user is specified when using the `/call` endpoint as the first paramater.

### Domain

A Domain tracks the base url Interceptor will call through to.  A Domain consists of a key and an URL.  

If Interceptor is to proxy to `http://foo.example.com` and `http://bar.example.com`, it will need to know how to reach those urls.  These Domains are setup with a key, and that key is used in the call API as the second paramater to allow Interceptor to identify the URL.

### Intercept

An Intercept is a group of Conditions and Responses.  It will roughly map one to one with endpoints.  As an example, if you are calling `http://example.com/posts` and `http://example.com/cities`, an intercept may be created for `posts` and one for `cities`.  

An Intercept is configured to intercept a request that match **all** of its listed Conditions.  An Intercept is provided with a list of Responses that a User can choose from.  When a request is received at the `/call` api, Interceptor will check all Intercepts for a Domain and see if any have all of their Conditions met.  If they do, the Response that the User has selected will be returned.

### Condition

A Condition is a test against a request.  If the test passes, the Condition is met.  Interceptor supports the following Conditions:

#### URL Regex test

Tests if a request URL matches a regex string

#### Method test

Tests if a request method matches a set method

### Response

A Response is a full description of a mocked response to send back when an Intercept is triggered.  A Response consists of a status code, headers, body, and an optional delay.

### Error

An Error is a resource that isn't fully used.  All errors Interceptor experiences are fed into it and stored, but there is no UI or way to analyze these errors.  It has been setup to track, and that data can be looked at later.

## Data persistence

Interceptor requires a data persistence layer.  As a first pass, a filesystem storage system has been implemented.  This is setup with [kfs](https://www.npmjs.com/package/key-file-storage).  Instances of resources are persisted at `/server/store`.

In the future, it may make sense to use a DB here.
