"use strict";

module.exports = (sequelize, DataTypes) => {
  const Fire = sequelize.define("Fire", {
    userId: DataTypes.INTEGER,
    lat: DataTypes.FLOAT,
    long: DataTypes.FLOAT,
  });

  return Fire;
};
