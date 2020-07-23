const model = require("../models");
const sequelize = require("sequelize");
const util = require("../utils/Crypto");

const firebase = require("firebase-admin");

const fireService = () => {
  const sendNotification = (data, token) => {
    return new Promise((resolve, reject) => {
      data.click_action = "FLUTTER_NOTIFICATION_CLICK";

      //notificaiton to send
      const payload = {
        notification: data,
      };

      const options = {
        priority: "high",
        timeToLive: 60 * 60 * 24, // 1 day
      };

      firebase
        .messaging()
        .sendToDevice(token, payload, options)
        .then((data) => {
          console.log(data);
          resolve(200);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  };

  const getFireInfo = async (userId) => {
    const fireInfo = await model.Fire.findAll({
      where: { userId: userId },
      attributes: [
        "userId",
        "lat",
        "long",
        [
          sequelize.fn("date_format", sequelize.col("createdAt"), "%Y-%m-%d"),
          "date",
        ],
        [
          sequelize.fn("date_format", sequelize.col("createdAt"), "%h:%m:%s"),
          "time",
        ],
      ],
      raw: true,
    });

    return fireInfo;
  };

  const getAllFireInfo = async () => {
    const fireInfo = await model.Fire.findAll({
      attributes: [
        "userId",
        "lat",
        "long",
        [
          sequelize.fn("date_format", sequelize.col("createdAt"), "%Y-%m-%d"),
          "date",
        ],
        [
          sequelize.fn("date_format", sequelize.col("createdAt"), "%h:%m:%s"),
          "time",
        ],
      ],
      raw: true,
      order: [["createdAt", "DESC"]],
    });

    return fireInfo;
  };

  const createFire = async (profile) => {
    profile.userId = profile.id;
    delete profile.id;
    delete profile.createdAt;
    delete profile.updatedAt;

    console.log(profile);
    const result = await model.Fire.create(profile);
    return result;
  };

  return {
    sendNotification,
    getFireInfo,
    getAllFireInfo,
    createFire,
  };
};

module.exports = fireService;
