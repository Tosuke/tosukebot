# build env
FROM mhart/alpine-node:latest AS build
RUN apk update && apk add --no-cache alpine-sdk openssl

# build
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY tsconfig.json tsconfig.json
COPY .env.example .env.example
COPY src src
RUN yarn install && yarn build

# run env
FROM mhart/alpine-node:10.6
RUN apk update && apk add --no-cache openssl
RUN yarn global add forever

ENV NODE_ENV=production

COPY --from=build /package.json package.json
COPY --from=build /yarn.lock yarn.lock
COPY --from=build /.env.example .env.example
COPY --from=build /dist dist
RUN yarn install

CMD forever -f dist/index.js
