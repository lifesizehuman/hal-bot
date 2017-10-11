module.exports = function(sequelize, DataTypes) {
  var Todo = sequelize.define("Todo", {
    task: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [1, 160]
      }
    },
    complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });

  Todo.associate = function(models) {
    Todo.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  }

  return Todo;
}