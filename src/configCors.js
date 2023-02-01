const config = require('./config');

const NODE_PORT = config.NODE_PORT;

console.log("CORS PORT ", NODE_PORT)
const configCors = {
    application: {
        cors: {
            server: [
                {
                    origin: `127.0.0.1:${NODE_PORT}`,
                    credentials: true
                }
            ]
        }
}
}

module.exports = configCors;