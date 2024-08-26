FROM node:20-bookworm

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install dotenv-cli

CMD ["npx", "dotenv", "npm", "run", "start:dev"]