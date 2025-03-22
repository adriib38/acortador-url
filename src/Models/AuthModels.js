const { DataTypes } = require('sequelize');
const sequelize = require('../services/db.js');
const bcrypt = require('bcrypt');

require("dotenv").config();

const User = sequelize.define('User',{
    uuid: { 
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        
    }

}, {
    hooks: {
        beforeCreate: async (user) => {
            const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
            user.password = bcrypt.hashSync(user.password, saltRounds)
        },
    }
})


module.exports = {
    User
};
