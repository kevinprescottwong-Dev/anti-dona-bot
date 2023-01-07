# syntax=docker/dockerfile:1

FROM node:19

RUN apt-get -y update &&  apt-get -y install sox && apt-get -y install sox libsox-fmt-mp3 && apt-get -y install ffmpeg

ENV NODE_ENV=production

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install --production

COPY . .
CMD [ "node", "./index.js" ]