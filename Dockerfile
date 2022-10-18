# syntax=docker/dockerfile:1

FROM node:16.14.2-alpine3.15

ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN yarn install

CMD serve -s build

# docker buildx build --platform linux/amd64,linux/arm64 --push -t joshandromidas/trakt-movie-list .