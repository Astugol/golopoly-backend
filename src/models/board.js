const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Board extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Game, {
        foreignKey: 'game_id',
      });
      this.hasMany(models.Fortune, {
        foreignKey: 'id',
      });
      this.hasMany(models.Property, {
        foreignKey: 'id',
      });
    }
  }
  Board.init({
    game_id: DataTypes.INTEGER,
    dice: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Board',
  });
  return Board;
};
