const { DataTypes } = require('sequelize');
const sequelize = require('../services/db.js');
const User = require('./User');

const Url = sequelize.define('Url', {
    uuid: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    long: DataTypes.STRING,
    short: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    qrFileName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    user: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'uuid',
        },
    },
});

User.hasMany(Url, { foreignKey: 'user', sourceKey: 'uuid' });
Url.belongsTo(User, { foreignKey: 'user', targetKey: 'uuid' });

module.exports = Url;