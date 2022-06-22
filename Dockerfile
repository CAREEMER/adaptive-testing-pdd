FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install typescript

COPY . .

RUN echo ${DATABASE_URL}

RUN npx prisma db push

RUN npx tsc

RUN node ./dist/db/fill-db.js