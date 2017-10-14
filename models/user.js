module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("User", {
    user_ID: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  User.associate = function(models) {
    User.hasMany(models.Todo, {
      onDelete: "CASCADE"
    });
  }

  return User;
}