FROM node:12.0-stretch-slim

WORKDIR /opt/app

COPY package.json package-lock.json ./

RUN npm ci

COPY . /opt/app

CMD npm run start
