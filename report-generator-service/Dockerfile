FROM node:20-bookworm

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm install dotenv-cli

CMD npx prisma migrate reset --force && npx prisma migrate dev --name init && npx prisma generate && npx dotenv npm run start:dev  
# CMD ["npx", "dotenv", "npm", "run", "start:dev"]