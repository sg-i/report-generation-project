FROM node:20-bookworm

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install -g ts-node nodemon

CMD ["npm", "run", "dev"]