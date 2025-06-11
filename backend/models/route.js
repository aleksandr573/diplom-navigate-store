module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Route', {
    storeName: DataTypes.STRING,
    date: DataTypes.DATE,
  });
};
