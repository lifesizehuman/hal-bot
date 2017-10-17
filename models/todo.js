module.exports = function(sequelize, DataTypes) {
  let Todo = sequelize.define("Todo", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
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
        name: "UserId"
        // allowNull: false
      }
      // targetKey: "fb_ID"
    });
  };
  return Todo;
};
