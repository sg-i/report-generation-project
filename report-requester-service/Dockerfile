FROM node:20-bookworm

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install prisma --save-dev

COPY . .

RUN npm install dotenv-cli

RUN npm install -g ts-node nodemon 

CMD  npx prisma migrate reset --force && npx prisma migrate dev --name init && npx prisma generate && npx dotenv npm run dev  