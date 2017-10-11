module.exports = function(sequelize, DataTypes) {
  var Search = sequelize.define("Search", {
    search_phrase: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
  
  return Search;
}