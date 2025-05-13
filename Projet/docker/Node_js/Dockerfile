FROM node

WORKDIR /app

COPY ../../Game/*json ./
COPY ../../Game/db ./db
COPY ../../Game/public ./public
COPY ../../Game/src ./src
COPY ../../Game/tailwindcss ./tailwindcss

COPY ../../Game/.babelrc ./.babelrc
COPY ../../Game/.prettierrc ./.prettierrc
COPY ../../Game/eslint.config.mjs ./eslint.config.mjs

RUN useradd -m appuser

RUN chown -R appuser:appuser /app
RUN chown -R appuser:appuser ./

USER appuser

RUN npm install


EXPOSE 3000
