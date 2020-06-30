const Sequelieze    = require('sequelize');
const sequelieze    = require('../util/database');

const User          = sequelieze.define('user',{
    id: {
        type: Sequelieze.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelieze.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelieze.STRING,
        allowNull: false
    }
});

module.exports = User;