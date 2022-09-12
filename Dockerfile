FROM node:12.22.1-alpine3.11

RUN apk add --no-cache python2 build-base

WORKDIR /app
COPY . .
RUN npm install

CMD ["node", "/app/src/app.js"]
