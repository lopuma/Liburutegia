const config = require('../../src/config');
module.exports = {
    s3Database: {
        apiVersion: config.API_VERSION,
        region: config.AWS_REGION,
        credentials: {
            accessKeyId: config.AWS_ACCESS_KEY_ID,
            secretAccessKey: config.AWS_SECRET_ACCESS_KEY
        }
    }
};