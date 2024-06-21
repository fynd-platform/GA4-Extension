FROM node:16.20-alpine as builder
RUN apk update && apk add python3-dev make alpine-sdk gcc g++ git build-base openssh openssl bash

WORKDIR /srv/ga4
COPY ./package.json .
COPY ./package-lock.json .
RUN npm install
COPY . .

WORKDIR /srv/ga4/web
COPY ./web/package.json ./web
COPY ./web/package-lock.json ./web
RUN npm install --build-from-source
RUN npm run build
RUN rm -rf ./node_modules

FROM node:16.20-alpine
WORKDIR /srv/ga4
COPY --from=builder /srv/ga4 .
ENTRYPOINT ["node" ,"index.js"]