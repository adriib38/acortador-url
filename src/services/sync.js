const sequelize = require("./db");
const auth = require("../Models/AuthModels")
const models = require("../Models/models")


async function syncDatabase() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing the database:', error);
    }
} 



syncDatabase();