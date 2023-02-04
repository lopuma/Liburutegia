FROM node:18-alpine3.15

WORKDIR /app

COPY . .

RUN npm install --save npm@latest -g

RUN npm install

RUN npm install --save uuid@latest -g

RUN npm install pm2 -g

EXPOSE ${NODE_PORT}

CMD ["npm", "run", "prod"]
