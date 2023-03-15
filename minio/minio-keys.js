const config = require('../src/config');
module.exports = {
    minioDatabase: {
        endPoint: config.MINIO_HOST,
        port: parseInt(config.MINIO_PORT),
        useSSL: false,
        accessKey: config.MINIO_ROOT_USER,
        secretKey: config.MINIO_ROOT_PASSWORD
    }
};