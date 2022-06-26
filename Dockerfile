FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

RUN chmod +x ./bot.deploy_commands.sh
RUN chmod +x ./backend.deploy_commands.sh
