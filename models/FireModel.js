"use strict";

module.exports = (sequelize, DataTypes) => {
  const Fire = sequelize.define("Fire", {
    lat: DataTypes.FLOAT,
    long: DataTypes.FLOAT,
  });

  return Fire;
};
