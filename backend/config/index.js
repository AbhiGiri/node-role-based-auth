require('dotenv').config();

module.exports = {
    DB: process.env.Dev_Env_DB,
    PORT: process.env.PORT || process.env.App_Port,
    SECRET: process.env.App_Secret
}