const config = require('../../src/config');
const isTrueSet = (String(config.USE_SSL).toLowerCase() === 'true');

module.exports = {
    minioDatabase: {
        endPoint: config.MINIO_HOST,
        port: parseInt(config.MINIO_PORT),
        useSSL: isTrueSet,
        accessKey: config.MINIO_ROOT_USER,
        secretKey: config.MINIO_ROOT_PASSWORD
    }
};

