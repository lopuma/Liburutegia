const { createClient } = require('redis');
const { redisDatabase } = require('./redis-keys');
const config = require('../../src/config');
const redisClient = createClient(
    redisDatabase
    );
redisClient.connect().catch(console.error);
redisClient.on('connect', function() {
    console.info(`The Redis is connected on the PORT: ${config.REDIS_PORT}`);
});

module.exports = redisClient;
