FROM node:20-bookworm

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# RUN npm install -g @nestjs/cli nodemon
 
CMD ["npm", "run", "start:dev"]