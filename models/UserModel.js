"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("User", {
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    salt: {
      type: DataTypes.STRING,
    },
    fcmToken: {
      type: DataTypes.STRING,
    },
    lat: {
      type: DataTypes.FLOAT,
    },
    long: {
      type: DataTypes.FLOAT,
    },
    verification: {
      type: DataTypes.BOOLEAN,
    },
    email: {
      type: DataTypes.STRING,
    },
  });

  User.associate = (models) => {
    // models.User.hasMany(models.Post);
  };

  return User;
};
