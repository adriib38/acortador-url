const sequelize = require("./db");
const Url = require("../models/Url")
const User = require("../models/User")
const AccessUrls = require("../models/AccessUrls")
const RefreshToken = require("../models/RefreshToken")

async function syncDatabase() {
    try {
        await sequelize.sync({ force: true });
        console.log('Database synchronized successfully');
    } catch (error) {
        console.error('Error synchronizing the database:', error);
    }
} 



syncDatabase();