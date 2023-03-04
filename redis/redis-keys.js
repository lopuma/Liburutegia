const config = require('../src/config');
module.exports = {
    redisDatabase: {
        legacyMode: true,
        url: `redis://:${config.REDIS_PASSWORD}@${config.REDIS_HOST}:${config.REDIS_PORT}`
    }
};