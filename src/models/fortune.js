const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Fortune extends Model {
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
  Fortune.init({
    board_id: DataTypes.INTEGER,
    token_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    value: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Fortune',
  });
  return Fortune;
};
