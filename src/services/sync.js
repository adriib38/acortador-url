const sequelize = require("./db");


async function syncDatabase() {
    await sequelize.sync({ force: true });
    console.log('Database sincronized succesfull');
}  


syncDatabase();