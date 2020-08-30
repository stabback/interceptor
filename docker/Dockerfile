# Builds the official Interceptor image.  Will start Interceptor when run.

FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn lint

RUN yarn build

EXPOSE 8080

CMD ["yarn", "start"]