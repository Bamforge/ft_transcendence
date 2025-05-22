FROM node

WORKDIR /app

COPY ../../Game/*json ./
COPY ../../Game/db ./db
COPY ../../Game/public ./public
COPY ../../Game/src ./src
COPY ../../Game/tailwindcss ./tailwindcss

COPY ../../Game/config ./config

RUN useradd -m appuser

RUN chown -R appuser:appuser /app
RUN chown -R appuser:appuser ./

USER appuser

RUN npm install


EXPOSE 3000
