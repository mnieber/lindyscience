FROM node:13-alpine

RUN mkdir -p /opt/linsci
WORKDIR /opt/linsci

COPY ./frontend ./src
WORKDIR /opt/linsci/src

RUN yarn

EXPOSE 3000

