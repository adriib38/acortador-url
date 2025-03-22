const sequelize = require("./db");

const { Url, AccessUrls } = require("../Models/models.js");

async function syncDatabase() {
    await sequelize.sync({ force: true });
    console.log('Database sincronized succesfull');
}  


syncDatabase();