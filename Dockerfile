FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install typescript

COPY . .

ARG TG_TOKEN
ARG DATABASE_URL

ENV DATABASE_URL="${DATABASE_URL}"
ENV TG_TOKEN="${TG_TOKEN}"

RUN npx tsc

CMD [ "node", "./dist/src/ingex.js" ]
