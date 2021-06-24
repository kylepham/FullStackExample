FROM node:16-slim

WORKDIR /app

COPY ./package.json ./
COPY ./package-lock.json ./

RUN yarn install

COPY . .

EXPOSE 5000

CMD [ "npm", "run", "dev" ]