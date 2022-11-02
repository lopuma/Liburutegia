const connection = require("../../../database/db");
const bscryptjs = require("bcryptjs");
const { HASH_KEYWORD, DEFAULT_USER_DATA, sql, sqlInsert } = require("../../../env/dataUserDefault")

async function defaultUser() {
    const passwordHash = await bscryptjs.hash(`${HASH_KEYWORD}`, 8);
    const userDefault = {...DEFAULT_USER_DATA, pass: passwordHash};
    connection.query(sql, async (error, results) => {
        if (error) throw error;
        exists = await results[0].response;
        if(exists !== 1){
            connection.query(sqlInsert, userDefault)
            console.log(`Usuario inicial creado : ${userDefault.username}`)
        }else{
            console.log(`Usuario ${userDefault.username}, ya esta creado!!`);
        }
    });
}

module.exports = defaultUser;