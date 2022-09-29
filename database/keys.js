const path = require('path');
console.log("2-", process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'production'){
	require('dotenv').config({
		path: path.resolve(__dirname, '../env/.env')
	});
} else{
    console.log(process.env.MYSQL_HOST)    
}
module.exports = {
    database: {
        connectionLimit: 5,
        multipleStatements: true,
        host: process.env.DB_HOST || process.env.MYSQL_HOST,
        port: process.env.DB_PORT || process.env.MYSQL_PORT,
        user: process.env.DB_USER || process.env.MYSQL_USER,
        password: process.env.DB_PASS || process.env.MYSQL_PASSWORD,
        database: process.env.DB_DATABASE || process.env.MYSQL_DB
    }
};

