const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Token, {
        foreignKey: 'token_id',
      });
      this.belongsTo(models.Board, {
        foreignKey: 'board_id',
      });
    }
  }
  Property.init(
    {
      token_id: DataTypes.INTEGER,
      board_id: DataTypes.INTEGER,
      cost: DataTypes.INTEGER,
      rent: DataTypes.INTEGER,
      mortage: DataTypes.INTEGER,
      name: DataTypes.STRING,
      position: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Property',
    },
  );
  return Property;
};
