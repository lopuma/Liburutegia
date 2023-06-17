# Etapa de construcción
FROM node:alpine3.14 as builder
WORKDIR /app
COPY package.json .
RUN npm install --save npm@latest --localtion=global
RUN apk --no-cache add --virtual .build-deps \
    build-base \
    python3 \
    && npm install --unsafe-perm \
    && apk del .build-deps
COPY . .

# Etapa de producción
FROM node:alpine3.14
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD ["npm", "run", "start"]
