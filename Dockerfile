FROM node:latest

WORKDIR /app

COPY . .

RUN npm install --save npm@latest -g

RUN npm install

RUN npm install --save uuid@latest -g

RUN npm install pm2 -g

RUN npm install --save mysql2

EXPOSE 3000

CMD ["npm", "run", "prod"]
