const path = require('path');
console.log("2-", process.env.NODE_ENV)
if (process.env.NODE_ENV !== 'production'){
	require('dotenv').config({
		path: path.resolve(__dirname, '../env/.env')
	});
    console.log("DEV ===> ", process.env.DB_HOST)    
    console.log("DEV ===> ", process.env.DB_DATABASE)    
    console.log("DEV ===> ", process.env.DB_USER)    
    console.log("DEV ===> ", process.env.DB_PORT)    
    console.log("DEV ===> ", process.env.DB_PASS)    
    console.log("DEV ===> ", process.env.MYSQL_ROOT_PASSWORD)    
    console.log("DEV ===> ", process.env.NODE_ENV)   
} else{
    require('dotenv').config();
    console.log("PROD ===> MYSQL_HOST ", process.env.MYSQL_HOST)    
    console.log("PROD ===> MYSQL_DATABASE ", process.env.MYSQL_DATABASE)    
    console.log("PROD ===> MYSQL_USER", process.env.MYSQL_USER)    
    console.log("PROD ===> MYSQL_PORT ", process.env.MYSQL_PORT)    
    console.log("PROD ===> MYSQL_PASSWORD ", process.env.MYSQL_PASSWORD)    
    console.log("PROD ===> MYSQL_ROOT_PASSWORD ", process.env.MYSQL_ROOT_PASSWORD)    
    console.log("PROD ===> NODE_ENV ", process.env.NODE_ENV)    
}
module.exports = {
    database: {
        connectionLimit: 100,
        multipleStatements: true,
        host: process.env.DB_HOST || process.env.MYSQL_HOST,
        // port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || process.env.MYSQL_USER,
        password: process.env.DB_PASS || process.env.MYSQL_ROOT_PASSWORD,
        database: process.env.DB_DATABASE || process.env.MYSQL_DATABASE
    }
};

