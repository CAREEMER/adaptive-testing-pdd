FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

RUN chmod +x ./bot.deploy_commands.sh
RUN chmod +x ./api.deploy_commands.sh
