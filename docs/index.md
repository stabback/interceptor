# Interceptor

Docs Home | [Understanding](./understanding) | [Tutorial](./tutorial)

## What is Interceptor?

Interceptor is a tool to help intercept network requests to return desired responses.

For more on what this means, read the [Understanding](./understanding) section.

## Requirements

A running MongoDB instance

MongoDB can be running locally or remotely.

If you're not sure how to run locally or want to get going quickly, try using [MongoDB Atlas](https://www.mongodb.com/try) in the cloud for free.

## Quickstart

### With Docker:

```sh
docker run \
  --publish 8080:8080 \
  --env INTERCEPTOR_MONGO_CONNECTION_URL=YOUR_CONNECTION_STRING \
  stabback/interceptor
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

## Starting with Docker Compose

Take a look at the sample [Docker Compose file](../docker/docker-compose.yml).  From the projects root, you can start this with

```sh
docker-compose \
  --file docker/docker-compose.yml \
  up
```

Make sure you have setup your environment variable correctly, or pass in your connection string over the command line