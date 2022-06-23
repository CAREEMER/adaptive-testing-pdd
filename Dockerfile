FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

RUN chmod +x ./deploy_commands.sh

ENTRYPOINT [ "./deploy_commands.sh" ]
