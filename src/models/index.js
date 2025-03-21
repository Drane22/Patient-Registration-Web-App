const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config/db.js')[env];
const db = {};

async function initializeDatabase() {

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Create database if it doesn't exist
  const tempSequelize = new Sequelize('mysql', config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect
  });
  
  await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS ${config.database};`);
  await tempSequelize.close();

  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

return db;
}

module.exports = initializeDatabase();