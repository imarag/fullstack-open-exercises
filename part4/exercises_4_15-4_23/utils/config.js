require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI =
    process.env.NODE_ENV === 'test'
        ? process.env.TEST_MONGODB_URI
        : process.env.MONGODB_URI
const SECRET = process.env.SECRET

const TOKEN_EXPIRE_SEC = 3600
const SALT_ROUNDS = 10

module.exports = {
    MONGODB_URI,
    PORT,
    SECRET,
    TOKEN_EXPIRE_SEC,
    SALT_ROUNDS,
}
