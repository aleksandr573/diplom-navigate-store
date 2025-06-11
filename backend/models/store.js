module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Store', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
  });
};
