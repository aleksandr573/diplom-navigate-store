module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Product', {
    name: DataTypes.STRING,
    shelf: DataTypes.STRING,
    x: DataTypes.INTEGER,
    y: DataTypes.INTEGER,
  });
};
