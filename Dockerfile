FROM node:latest AS node-builder

COPY . /user/vlad/app/angular/
WORKDIR /user/vlad/app/angular/

RUN npm i
RUN $(npm bin)/ng build

FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node-builder /user/vlad/app/angular/dist/angularclient /usr/share/nginx/html/
