# Interceptor

[Docs Home](./index) | [Understanding](./understanding) | [Tutorial](./tutorial)

## Tutorial

TODO - Make a video demonstrating this

### Introduction

This tutorial with demonstrate some of Interceptors functionality.  After following this tutorial, you should have a basic understanding of how the system works.

### Prerequisites

Before starting, make sure you have a local instance of Interceptor running.  You can follow the Quickstart located on the [Docs Homepage](./index).

### Tutorial

1. Verify Interceptor is running.  Visit the UI at `http://localhost:8080/ui`.  You will be presented with a list of users and an option to create a new one.  As this is your first time running, there will be no users.

If that address cannot be reached, you may want to revisit the quickstart to make sure everything is started locally correctly.

2. Create a new user
   1. Click on `new`
   2. Enter the user `foo` into the prompt
   3. Click submit

3. Click on that user.  You have now selected your user, which will allow it to keep track of your choices.  You will now be presented with a list of all domains, and the option to create a new one.  As this is your first time running, there will be no domains.

4. Create a new domain
   1. Click on `new`
   2. Enter the name `JSON Placeholder`
   3. Enter the key `jsp`
   4. Enter the URL `https://jsonplaceholder.typicode.com`
   5. Click submit

    JSON Placeholder is a service which just returns static mock data.  We will use it to simulate an actual endpoint.  If you make a GET request to https://jsonplaceholder.typicode.com/posts, you will see that it returns a static set of posts.

    The proxy for this domain is also now setup.  If you make a GET request to `http://localhost:8080/call/foo/jsp/posts`, Interceptor will proxy it to `https://jsonplaceholder.typicode.com/posts`.

    Note that when calling through the proxy, two additional headers are set - `X-Interceptor-Domain` and `X-Interceptor-User`.  These identify the domain and user id.

    You should now be presented with a list of Intercepts for this Domain.  As expected, as there are none created yet, the list is empty.

5. Create a new intercept
   1. Click on `new`
   2. Enter the name `posts`
   3. Click create

    You will now be presented with a single intercept in the intercept table.  It has no conditions or responses, and needs to be setup.

6. Click `Show Details` on the new intercept.

7. Add a condition to the intercept to tell Interceptor when this intercept should be triggered
   1. Click `new` in the Conditions section
   2. Click URL pattern
   3. Enter `posts`
   4. Click `submit`

8. Lock the intercept by pressing `Lock` and confirming.

    Locking an intercept freezes it, preventing any conditions from being added or removed in the future.  This is important as other users or E2E tests may rely on intercepts having a consistent set of conditions.

9.   Make a GET request to the same URL from earlier - `http://localhost:8080/call/foo/jsp/posts`.  The response is the same, except now there is a new header - `X-Interceptor-Intercept` with the ID of the triggered intercept.  

10. Add a response to the Intercept.
    1.  Click on `New` in the responses section
    2.  Add the name `Empty array`
    3.  Set the body to be `[]`.
    4.  Press `submit`

11. Activate the response by pressing the `Activate` button beside the response, or by choosing it in the dropdown in the Activated Response column.

12. Make that same GET request again to `http://localhost:8080/call/foo/jsp/posts`.

    Note that the response now matches the response you created.  Additionally, the headers `X-Interceptor-Response` and `X-Interceptor-Response-Source` are set.  There are a few other headers - these are set by Express automatically, but can be overridden.

13. Set the activated response to `Pass through`.  Make the request again.  The response will be the default posts again from JSON placeholder.

14. Click on `Change` in the User section.  Create a new user with the username `bar`.

15. Click on the user name.

16. Click on the domain `jsp`.

17. Activate the response `Empty array`.  Make a GET request to `http://localhost:8080/call/bar/jsp/posts` instead (notice the URL change to the user bar), and note that you receive the empty array response.

18. Without changing anything in the UI, make a GET request to ``http://localhost:8080/call/foo/jsp/posts` (notice the URL change to the user foo) and notice that the `foo` user receives the passthrough response.
