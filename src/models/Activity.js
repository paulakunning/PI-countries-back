const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "activity",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      difficulty: {
        type: DataTypes.INTEGER,
        validate: {
          min:1,
          max:5
        },
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        validate: {
          min:1,
          max:24
        },
        allowNull: false
      },
      season: {
        type: DataTypes.ENUM,
        values: ["Summer", "Autumn", "Spring", "Winter"],
        allowNull: false
      },
    },
    { timestamps: false }
  );
};