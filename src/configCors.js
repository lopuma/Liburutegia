const config = require('./config');

const PORT = config.PORT;
const NGINX_HOST = config.NGINX_HOST;
const CORS_ALLOWED_ORIGINS = [
  `${NGINX_HOST}`,
  `${NGINX_HOST}:${PORT}`,
  `http://localhost:${PORT}`,
  `http://127.0.0.1:${PORT}`,
  `http://0.0.0.0:${PORT}`,
  `http://0.0.0.0`,
  `127.0.0.1:${PORT}`,
  `0.0.0.0:${PORT}`,
  `0.0.0.0`,
  `localhost:${PORT}`,
  `http://www.liburutegia-sanmiguel.com:${PORT}`,
  'http://www.liburutegia-sanmiguel.com',
];

const configCors = {
  application: {
    cors: {
      server: CORS_ALLOWED_ORIGINS.map(origin => ({
        origin,
        credentials: true
      }))
    }
  }
}

module.exports = configCors;
