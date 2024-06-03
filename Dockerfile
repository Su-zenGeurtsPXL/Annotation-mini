FROM node:19.2.0-alpine3.17 as build-stage

ARG BUILD_DEVELOPMENT

# based on build mode argument either build for production server or for test server
ENV NODE_ENV=${BUILD_DEVELOPMENT:+dev}
ENV NODE_ENV=${NODE_ENV:-prod}

# install simple http server for serving static content
RUN npm install -g http-server

# install python
RUN apk add --no-cache python3 py3-pip

# install make
RUN apk add --update make

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

RUN npm rebuild node-sass

# build app for production with minification
RUN npm run build:${NODE_ENV}

FROM nginx:1.19.1-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 8080
CMD [ "nginx", "-g", "daemon off;" ]