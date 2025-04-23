const { DataTypes } = require('sequelize');
const sequelize = require('../services/db.js');
const User = require("./authModels.js");

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
    user: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'uuid',
        },
    },
});


const AccessUrls = sequelize.define('accessUrls', {
    uuid: { 
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    shortUrl: { 
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Url,
            key: 'short',
        },
    },
    navigatorLanguage: DataTypes.STRING,
    navigatorAgent: DataTypes.STRING,
    ip: DataTypes.STRING,
    createdAt: DataTypes.DATE,
});

User.hasMany(Url, { foreignKey: 'user', sourceKey: 'uuid' });
Url.belongsTo(User, { foreignKey: 'user', targetKey: 'uuid' });

Url.hasMany(AccessUrls, { foreignKey: 'shortUrl', sourceKey: 'short' });
AccessUrls.belongsTo(Url, { foreignKey: 'shortUrl', targetKey: 'short' });

module.exports = {
    Url,
    AccessUrls,
    User,
};