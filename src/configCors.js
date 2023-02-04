const config = require('./config');

const NODE_PORT = config.NODE_PORT;
const PORT = config.PORT;

console.log("CORS PORT ", NODE_PORT)
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
