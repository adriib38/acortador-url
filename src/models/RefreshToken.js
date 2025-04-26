const { DataTypes } = require('sequelize');
const sequelize = require('../services/db.js');
const User = require('./User');

const RefreshToken = sequelize.define('RefreshToken', {
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    jti: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    userUuid: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'uuid',
        },
    },
});

module.exports = RefreshToken;