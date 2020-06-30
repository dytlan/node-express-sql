const Sequelize = require('sequelize');
const sequelize = new Sequelize('node','root','',{
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;

// // Using Pure MySQL
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node',
//     password: ''
// });

// module.exports = pool.promise();

