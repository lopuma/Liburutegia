const Minio = require('minio');
const { minioDatabase } = require('./minio-keys');
const minioClient = new Minio.Client(
    minioDatabase
);

module.exports = minioClient;
