FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install typescript

COPY . .

ENTRYPOINT [ "node", "./dist/index.js" ]
