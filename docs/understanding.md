# Interceptor

[Docs Home](./index.md) | Understanding

## Understanding

Interceptor is a tool to help intercept network requests to return desired responses.  

### Problem being solved

Applications that make network requests rely on the responses from those requests.  You may want to display a list of items fetched over API, display feedback if an error is encountered, redirect to login if there's an auth issue or retry your request if there is a network failure.

As application developers, we do not always have control over the systems which our application talks to.  We will want to see how our application responds to a 500 error, but have no way to force the system to respond with a 500.

Instead, we may add special instructions to simulate a 500 error or build and maintain expensive mock servers to have a bit more control.  These solutions are usually fragile and don't work well in staging environments.  They do not instill confidence that the application will work correctly once they are removed. 

### Interceptor's solution

Interceptor allows you to altogether remove mocking logic from your application without needing control of any servers.

Interceptor is a deployed service that acts as a proxy to the services your application talks to.  Users can configure Interceptor to intercept requests which match a pattern and instead return a static response.

### An example

Let's say you are creating an application that returns a list of posts from a server.  You'd like to ensure your application can handle a 500 error, displays correctly with no results found, and displays correctly with a full list of items.

Your application calls http://example.com/posts to retrieve the list of posts, but you do not have control over this server at all.

You'd spin up an instance of Interceptor that would live for the duration of the project.  Using Interceptors UI, you'd then configure Interceptor to allow calls to http://example.com.  Finally, you'd tell Interceptor that calls that match /posts should be intercepted and describe the responses you'd like to support.

Next time you spin up your application, instead of calling example.com, call the deployed Interceptor instance.  You can use Interceptor's UI to instruct Interceptor which of the responses you've described you'd like to receive back.
