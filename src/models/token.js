const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'user_id',
      });
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
  Token.init(
    {
      user_id: DataTypes.INTEGER,
      game_id: DataTypes.INTEGER,
      color: DataTypes.STRING,
      money: DataTypes.INTEGER,
      position: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Token',
    },
  );
  return Token;
};
