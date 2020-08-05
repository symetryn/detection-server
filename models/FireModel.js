"use strict";

module.exports = (sequelize, DataTypes) => {
  const Fire = sequelize.define("Fire", {
    lat: { type: DataTypes.FLOAT, allowNull: true },
    long: { type: DataTypes.FLOAT, allowNull: true },
  });

  return Fire;
};
