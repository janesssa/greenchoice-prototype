FROM node:14.15.4-alpine
WORKDIR /usr/app/api
COPY package.json .
RUN yarn install --silent
COPY . .
EXPOSE 3000