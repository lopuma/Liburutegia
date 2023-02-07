const config = require('./config');

const PORT = config.PORT;

const configCors = {
    application: {
        cors: {
            server: [
                {
                    origin: `0.0.0.0:${PORT}`,
                    credentials: true
                }
            ]
        }
}
}

module.exports = configCors;
