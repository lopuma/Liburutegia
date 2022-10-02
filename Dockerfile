FROM node:18-alpine3.15

WORKDIR /app

COPY . .

RUN npm install

RUN npm install pm2 -g

EXPOSE 3000

CMD ["pm2-runtime", "src/app.js"]