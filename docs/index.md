# Interceptor

## What is Interceptor?

Interceptor is a tool to help intercept network requests to return desired responses.

## Purpose

When building applications that make API requests (websites, backends, whatever), you usually want to handle various responses.  You may want to ensure a 500 error displays an error correctly, your UI handles different success cases appropriately, or your network layer retries failed requests.

Interceptor allows you to develop and test these scenarios without relying on test code in your application or control of the services your application is talking to.

For more on when to use Interceptor, examples, and best practices, read the [Understanding](./understanding) section.

## Requirements

A running MongoDB instance

MongoDB can be running locally or remotely.

If you're not sure how to run locally or want to get going quickly, try using [MongoDB Atlas](https://www.mongodb.com/try) in the cloud for free.

## Quickstart

### With Docker:

```sh
docker run -p 8080:8080 -e INTERCEPTOR_MONGO_CONNECTION_URL=YOUR_CONNECTION_STRING stabback/interceptor
```

### Running manually:

_Note: Probably also works using npm_
```sh
# 1. Create an environment file from the example
cp .env.example .env

# 2. Edit .env to set your Mongo connection URL

#3. Install, build, and run
yarn && yarn build && yarn start
```

