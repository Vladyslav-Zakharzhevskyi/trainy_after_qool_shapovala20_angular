FROM node:14 AS node-builder

COPY . /user/vlad/app/angular/
WORKDIR /user/vlad/app/angular/

RUN npm i
RUN $(npm bin)/ng build

FROM nginx:1.19
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node-builder /user/vlad/app/angular/dist/angularclient /usr/share/nginx/html/
