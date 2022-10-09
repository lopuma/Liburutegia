const TEST_USER_EMAIL = "admin@mail.com";
const HASH_KEYWORD = "admin";
const DEFAULT_USER_DATA = {
    email:'admin@mail.com',
    username:'Admin',
    fullname:'Admin',
    rol:'admin',
    _ss:0
}

const sql = `SELECT IF( EXISTS(SELECT * FROM users WHERE email='${TEST_USER_EMAIL}'), 1, 0) AS response`;
const sqlInsert = "INSERT INTO users SET ?";

module.exports = { HASH_KEYWORD, DEFAULT_USER_DATA, sql, sqlInsert }