FROM node:12.13.0-alpine AS build
WORKDIR /app/
COPY . /app/
RUN npm i
ARG CONFIGURATION=docker-local
RUN $(npm bin)/ng build --configuration=$CONFIGURATION

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/angularclient /usr/share/nginx/html
