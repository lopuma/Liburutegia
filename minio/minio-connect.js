const Minio = require('minio');
const config = require('../src/config');
const { minioDatabase } = require('./minio-keys');
const minioClient = new Minio.Client(
    minioDatabase
);

module.exports = minioClient;
