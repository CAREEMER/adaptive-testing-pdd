FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

RUN npx prisma db push

RUN npx tsc

ENTRYPOINT [ "node", "./dist/index.js" ]
