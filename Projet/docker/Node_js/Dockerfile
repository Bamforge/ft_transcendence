FROM node:20

WORKDIR /app

COPY ./docker/Node_js/config_json/ ./

RUN npm install

COPY ../../Game/. ./

EXPOSE 3000
