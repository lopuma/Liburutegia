FROM node:18-alpine3.15

WORKDIR /app

COPY . .

RUN npm install

RUN npm install pm2 -g

EXPOSE 3000

CMD ["npm", "run", "prod"]