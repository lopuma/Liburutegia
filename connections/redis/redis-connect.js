const { createClient } = require('redis');
const { redisDatabase } = require('./redis-keys');
const config = require('../../src/config');
const _log = require('../../src/utils');

const redisClient = createClient(
    redisDatabase
    );
redisClient.connect().catch(console.error);
redisClient.on('connect', function() {
    _log.ready(`server Redis is connected on: http://${config.REDIS_HOST}:${config.REDIS_COMMANDER_PORT}`);
});

module.exports = redisClient;
