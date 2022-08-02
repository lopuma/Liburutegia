// config.js
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.resolve(__dirname, process.env.NODE_ENV + '.env')
});

module.exports = {

    config: {
        NODE_ENV: process.env.NODE_ENV || 'development',
        HOST: process.env.HOST || '127.0.0.1',
        PORT: process.env.PORT || 3000
    },
    database: {
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || 'Dopracau4000lopo',
        database: process.env.DB_DATABASE || 'liburutegiasanmiguel'
    }
}