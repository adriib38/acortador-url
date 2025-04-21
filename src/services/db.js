require("dotenv").config();
const { Sequelize } = require("sequelize");
const config = require("../../config/config.json")[process.env.ENVIRONMENT || "development"];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        port: config.port || 3306,
    }
);

sequelize.authenticate()
    .then(() =>  console.log("Connection has been established successfully."))
    .catch((error) => console.error("Unable to connect to the database:", error));


module.exports = sequelize;
