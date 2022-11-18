const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const HASH_KEYWORD = process.env.HASH_KEYWORD;
const DEFAULT_USER_DATA = {
    email: TEST_USER_EMAIL,
    username: "Admin",
    fullname: "Admin",
    rol: "admin",
    _ss: 0
};

const sql = `SELECT IF( EXISTS(SELECT * FROM users WHERE email='${TEST_USER_EMAIL}'), 1, 0) AS response`;
const sqlInsert = "INSERT INTO users SET ?";

module.exports = { HASH_KEYWORD, DEFAULT_USER_DATA, sql, sqlInsert };
