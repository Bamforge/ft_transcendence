FROM node

WORKDIR /app

COPY ../../Game/*json ./

RUN npm install

COPY ../../Game/db ./db
COPY ../../Game/public ./public
COPY ../../Game/src ./src
COPY ../../Game/tailwindcss ./tailwindcss

EXPOSE 3000
