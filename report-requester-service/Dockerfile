FROM node:20-bookworm

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install dotenv-cli

RUN npm install -g ts-node nodemon 

CMD ["npx", "dotenv", "npm", "run", "dev"]