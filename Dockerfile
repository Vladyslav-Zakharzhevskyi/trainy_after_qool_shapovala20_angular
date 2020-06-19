FROM node:12.13.0-alpine AS build
WORKDIR /app

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

COPY package*.json ./
RUN npm install

COPY angular.json .
COPY tsconfig*.json ./
#TODO copy only src folder instead
COPY . .
ARG CONFIGURATION=docker-local
ENV CONFIGURATION=$CONFIGURATION
RUN $(npm bin)/ng build --configuration=$CONFIGURATION

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/angularclient /usr/share/nginx/html
