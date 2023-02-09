const dotenv = require('dotenv');
const path = require('path');

console.log(__dirname+'/'+process.env.NODE_ENV + '.env');
dotenv.config({
    path: path.resolve(__dirname+'/'+process.env.NODE_ENV + '.env')
});

module.exports = {
    REDIS_USER: process.env.REDIS_USER || 'default',
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    REDIS_PORT: process.env.REDIS_PORT || 6379,
    REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
    NODE_ENV: process.env.NODE_ENV || 'production',
    NODE_PORT: process.env.PORT || 3000,
    PORT: process.env.PORT || 3000,
    MYSQL_HOST: process.env.MYSQL_HOST || '127.0.0.1',
    MYSQL_USER: process.env.MYSQL_USER || 'root',
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD,
    MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'sanmiguel',
    MYSQL_PORT: process.env.MYSQL_PORT || 3306,
    NGINX_HOST: process.env.NGINX_HOST || 'liburutegia-sanmiguel.com,www.liburutegia-sanmiguel.com',
    NGINX_PORT: process.env.NGINX_PORT || 80,
    NGINX_APP: process.env.NGINX_APP || 'LiburutegiaSanMiguel'
}