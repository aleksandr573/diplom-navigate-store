const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

// Подключение к SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../db.sqlite'), // БД будет храниться в файле db.sqlite
  logging: false,
});

// Загрузка моделей
const User = require('./user')(sequelize, DataTypes);
const Store = require('./store')(sequelize, DataTypes);
const Product = require('./product')(sequelize, DataTypes);
const Route = require('./route')(sequelize, DataTypes);
const RouteItem = require('./routeItem')(sequelize, DataTypes);

// Настройка связей
User.hasMany(Route);
Route.belongsTo(User);

Store.hasMany(Product);
Product.belongsTo(Store);

Route.belongsToMany(Product, { through: RouteItem });
Product.belongsToMany(Route, { through: RouteItem });

// Экспорт
const db = {
  sequelize,
  Sequelize,
  User,
  Store,
  Product,
  Route,
  RouteItem,
};

module.exports = db;
