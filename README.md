# Interceptor

Interceptor is a Node + Vue service for intercepting network requests.  With Interceptor you can intercept individual network requests and return static data, or proxy the requests to where they need to go.

## Quickstart

### Installation

Clone the repository and run with `yarn`.

```bash
git clone ssh://git@github.com:stabback/interceptor.git
yarn
yarn build
```

### Usage

The application can be started with
```bash
yarn start
```

Once started, you can manage the system at http://localhost:8080/ui.  Network requests should be pointed to http://localhost:8080/call.

## Understanding

Interceptor is built in two parts - a [client](./client) and a [server](./server).  Documentation specific to these parts can be found in their folders.  Configuration on how they work together can be handled with [interceptor.config.ts](./interceptor.config.ts), but the defaults should work fine most of the time.

### High level guide

Interceptor is a tool which sits between your application and the apis your application calls.  Interceptor allows you to setup intercepts which will return mock data back to your application.  If no intercepts are matched it will instead proxy the call to its destination.

By passing calls through Interceptor you gain the following advantages:
1. The ability to reliably test how your application responds to unexpected or edge-case api responses
2. The ability to work ahead of API delivery by intercepting requests to non-complete endpoints
3. Protection from unreliable or slow APIs slowing down development cycles
4. Increased confidence in E2E tests when dealing with APIs out of your teams control.

It is inspired by the network interception included with [Cypress](https://www.cypress.io/) and [ng-apimock](https://github.com/ng-apimock/core).

Interceptor is interacted with in three ways:

1. *UI*.  When started, Interceptor provides a browser based interface at `/ui`.  From this UI, you can manage the entire system.
2. *Command API*.  Interceptor provides full control via a RESTful interface at `/command`.  The UI uses this interface behind the scenes.  
3. *Call API*.  The meat and potatoes of the tool.  API calls to `/call/:user/:service` are either intercepted with canned responses or proxied to where they need to go.


### Terminology

Term | Description
---|---
Domain | A domain name (http://example.com) that your application interacts with.  Interceptor requires these to be set so that it knows where to proxy requests to.
Intercept | A group of conditions and scenarios.  An intercept is triggered if all of its conditions are met, and will return the scenario that is selected.
Condition | A test that is applied to a network request to see if an intercept will be triggerd.  Example conditions: "Verb is GET" or "URL is /users/123".
Response | A canned response that can be returned for an intercept.
User | Intercept supports multiple users.  A user selects which response they want an intercept to return.

A Domain has multiple Intercepts.  An Intercept has multiple Conditions and Scenarios.  A User chooses which scenario they would like a Intercept to respond with.

## Build and deploy

Intercept is meant to be deployed so that multiple users can interact with it at the same time.  Full build and deploy docs to come.  I'm unfamiliar with best practices for running a node server, however the UI should be straightforward, just an SPA.  Next steps are to get Devops and BE input on this.

### Security

For now, Interceptor should be deployed so that it can only be accessed when on our VPN.

## Tutorial

This guide will run you through getting started and setup some intercepts.  It will demonstrate the software along the way.  The goal of this tutorial is to be able to intercept an API call to get a list of posts.

1. Install and start

    ```
    yarn && yarn build && yarn start
    ```

    This may take some time.  When done, you will be presented with a message in the console stating the app is running.

2. Visit the UI at `http://localhost:8080/ui`.  You will be presented with a list of users and an option to create a new one.  As this is your first time running, there will be no users.

3. Create a new user
   1. Click on `new`
   2. Enter the user `foo` into the prompt
   3. Click submit

4. Click on that user.  You have now selected your user, which will allow it to keep track of your choices.  You will now be presented with a list of all domains, and the option to create a new one.  As this is your first time running, there will be no domains.

5. Create a new domain
   1. Click on `new`
   2. Enter the name `JSON Placeholder`
   3. Enter the key `jsp`
   4. Enter the URL `https://jsonplaceholder.typicode.com`
   5. Click submit

    JSON Placeholder is a service which just returns static mock data.  We will use it to simulate an actual endpoint.  If you make a GET request to https://jsonplaceholder.typicode.com/posts, you will see that it returns a static set of posts.

    The proxy for this domain is also now setup.  If you make a GET request to `http://localhost:8080/call/foo/jsp/posts`, Interceptor will proxy it to `https://jsonplaceholder.typicode.com/posts`.

    Note that when calling through the proxy, two additional headers are set - `X-Interceptor-Domain` and `X-Interceptor-User`.  These identify the domain and user id.

    You should now be presented with a list of Intercepts for this Domain.  As expected, as there are none created yet, the list is empty.

6. Create a new intercept
   1. Click on `new`
   2. Enter the name `posts`
   3. Click create

    You will now be presented with a single intercept in the intercept table.  It has no conditions or responses, and needs to be setup.

7. Click `Show Details` on the new intercept.

8. Add a condition to the intercept to tell Interceptor when this intercept should be triggered
   1. Click `new` in the Conditions section
   2. Click URL pattern
   3. Enter `posts`
   4. Click `submit`

9. Lock the intercept by pressing `Lock` and confirming.

    Locking an intercept freezes it, preventing any conditions from being added or removed in the future.  This is important as other users or E2E tests may rely on intercepts having a consistent set of conditions.

10.  Make a GET request to the same URL from earlier - `http://localhost:8080/call/foo/jsp/posts`.  The response is the same, except now there is a new header - `X-Interceptor-Intercept` with the ID of the triggered intercept.  

11. Add a response to the Intercept.
    1.  Click on `New` in the responses section
    2.  Add the name `Empty array`
    3.  Set the body to be `[]`.
    4.  Press `submit`

12. Activate the response by pressing the `Activate` button beside the response, or by choosing it in the dropdown in the Activated Response column.

13. Make that same GET request again to `http://localhost:8080/call/foo/jsp/posts`.

    Note that the response now matches the response you created.  Additionally, the headers `X-Interceptor-Response` and `X-Interceptor-Response-Source` are set.  There are a few other headers - these are set by Express automatically, but can be overridden.

14. Set the activated response to `Pass through`.  Make the request again.  The response will be the default posts again from JSON placeholder.

15. Click on `Change` in the User section.  Create a new user with the username `bar`.

16. Click on the user name.

17. Click on the domain `jsp`.

18. Activate the response `Empty array`.  Make a GET request to `http://localhost:8080/call/bar/jsp/posts` instead (notice the URL change to the user bar), and note that you receive the empty array response.

19. Without changing anything in the UI, make a GET request to ``http://localhost:8080/call/foo/jsp/posts` (notice the URL change to the user foo) and notice that the `foo` user receives the passthrough response.
