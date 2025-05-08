const { DataTypes } = require('sequelize');
const sequelize = require('../services/db.js');
const Url = require('./Url');

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

Url.hasMany(AccessUrls, { foreignKey: 'shortUrl', sourceKey: 'short', onDelete: 'CASCADE' });
AccessUrls.belongsTo(Url, { foreignKey: 'shortUrl', targetKey: 'short' }); 

module.exports = AccessUrls;