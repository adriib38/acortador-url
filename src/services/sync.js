const sequelize = require("./db");
const auth = require("../models/authModels")
const models = require("../models/models")
const User = require("../models/authModels")

async function syncDatabase() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing the database:', error);
    }
} 



syncDatabase();