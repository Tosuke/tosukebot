# build env
FROM node:10.6
RUN echo 'deb http://deb.debian.org/debian experimental main contrib' >> /etc/apt/sources.list \
 && echo 'deb http://deb.debian.org/debian unstable main contrib' >> /etc/apt/sources.list
RUN apt-get update -y \
  && apt-get -t experimental install --no-install-recommends -y -q \
    librsvg2-dev librsvg2-common librsvg2-2 gir1.2-rsvg-2.0 \
    libcairo2 libcairo2-dev \
    libfontconfig1 libfontconfig1-dev \
    libpango-1.0-0 libpangocairo-1.0-0 libpangoft2-1.0-0 \
    libc6-dev \
  && apt-get install --no-install-recommends -y -q fonts-noto-cjk

# build
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn install
COPY tsconfig.json tsconfig.json
COPY .env.example .env.example
COPY src src
RUN yarn build

ENV NODE_ENV=production
RUN yarn global add forever
CMD forever -f dist/index.js