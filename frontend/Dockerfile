FROM node:13-alpine

RUN mkdir -p /opt/linsci

WORKDIR /opt/linsci
COPY ./frontend ./src

WORKDIR /opt/linsci/src
# fixes issue explained in https://github.com/yarnpkg/yarn/issues/6617
RUN npm config set scripts-prepend-node-path true
RUN yarn start

EXPOSE 3000

