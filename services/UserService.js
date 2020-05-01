const model = require("../models");
const Op = require("sequelize").Op;
const util = require("../utils/Crypto");

const userService = () => {
  const getSalt = (email) => {
    console.log(email);
    return new Promise((resolve, reject) => {
      model.User.findOne({
        raw: true,
        where: {
          email,
        },
        attributes: ["salt"],
      }).then((result) => {
        console.log(result);

        result ? resolve(result.salt) : reject(1402);
      });
    });
  };

  const isUsedPhone = (phone) => {
    return new Promise((resolve, reject) => {
      model.User.findOne({
        where: {
          phone,
        },
        attributes: ["id"],
      }).then((result) => {
        result ? reject(1401, "phone already exists") : resolve(true);
      });
    });
  };

  const getUserProfile = (id) => {
    return new Promise((resolve, reject) => {
      model.User.findOne({
        where: {
          id,
        },
        raw: true,
      }).then((result) => {
        result ? resolve(result) : reject(1402);
      });
    });
  };

  const signUp = async (userData) => {
    return new Promise((resolve, reject) => {
      model.User.create(userData)
        .then((result) => resolve(result))
        .catch((error) => reject(error));
    });
  };

  const signIn = (userData) => {
    return new Promise((resolve, reject) => {
      console.log(userData);
      model.User.findOne({
        where: {
          [Op.and]: [{ email: userData.email }, { password: userData.pw }],
        },
        attributes: ["id", "name", "role"],
      }).then((result) => {
        result ? resolve(result) : reject(400);
      });
    });
  };

  const updateFcmToken = (userData) => {
    return new Promise((resolve, reject) => {
      model.User.update(
        { fcmToken: userData.fcmToken },
        {
          where: {
            [Op.and]: [{ email: userData.email }, { password: userData.pw }],
          },
        }
      )
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  };
  const getFcmToken = (id) => {
    return new Promise((resolve, reject) => {
      model.User.findOne({ where: { id } })
        .then((result) => {
          console.log(result);
          resolve(result.fcmToken);
        })
        .catch((err) => reject(err));
    });
  };

  return {
    getSalt,
    signUp,
    signIn,
    isUsedPhone,
    getUserProfile,
    updateFcmToken,
    getFcmToken,
  };
};

module.exports = userService;
