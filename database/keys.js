const path = require('path');
if (process.env.NODE_ENV !== 'production'){
	require('dotenv').config({
		path: path.resolve(__dirname, '../env/.env')
	});
} else{
    require('dotenv').config();  
}
module.exports = {
    database: {
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        multipleStatements: true,
        host: process.env.DB_HOST || process.env.MYSQL_HOST,
        // port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || process.env.MYSQL_USER,
        password: process.env.DB_PASS || process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.DB_DATABASE || process.env.MYSQL_DATABASE
    }
};

