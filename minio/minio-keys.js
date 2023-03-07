const config = require('../src/config');

module.exports = {
    minioDatabase: {
        endPoint: config.MINIO_HOST,
        port: 9000,
        useSSL: false,
        accessKey: config.MINIO_ROOT_USER,
        secretKey: config.MINIO_ROOT_PASSWORD
    }
};