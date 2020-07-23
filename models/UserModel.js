"use strict";

const model = require("../models");

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

    email: {
      type: DataTypes.STRING,
    },
  });

  User.associate = (db) => {
    console.log("association ran");
    // db.User.hasMany(db.Fire, { foreignKey: "userId", onDelete: "CASCADE" });
    db.Fire.belongsTo(db.User, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
  };

  return User;
};
