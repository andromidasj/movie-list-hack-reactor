# syntax=docker/dockerfile:1

FROM node:18.10.0-alpine3.15 as build-stage

WORKDIR /app

COPY . .

RUN yarn install
RUN yarn build

# Build import-meta-env binary for alpine linux
RUN npx pkg ./node_modules/@import-meta-env/cli/bin/import-meta-env.js -t node16-alpine -o import-meta-env


FROM nginx:1.22.0-alpine as production-stage

RUN mkdir /app

COPY --from=build-stage /app/dist /app/dist
COPY --from=build-stage /app/import-meta-env /app/import-meta-env

COPY .env.example.public /app/.env.example.public
COPY start.sh /app/start.sh
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

ENTRYPOINT [ "sh","/app/start.sh" ]

# docker buildx build --platform linux/amd64,linux/arm64 --push -t joshandromidas/movie-list .