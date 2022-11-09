const config = {
    application: {
        cors: {
            server: [
                {
                    origin: "127.0.0.1:3000",
                    credentials: true
                }
            ]
        }
}
}

module.exports =  config;