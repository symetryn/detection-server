"use strict";

const model = require("../models");

const fireService = require("../services/FireService");
const userService = require("../services/UserService");

const FireController = () => {
  const warnFire = async (req, res, next) => {
    try {
      const fcmToken = await userService().getFcmToken(req.userId);
      console.log("--------------------------------------");
      console.log(fcmToken);
      const fcmFireToken = await userService().getFireTokens();

      if (fcmFireToken.length > 0 && fcmToken)
        await fireService().sendNotification(req.body, [
          fcmToken,
          ...fcmFireToken,
        ]);
      else if (fcmToken) {
        await fireService().sendNotification(req.body, fcmToken);
      }
      // const userData = {
      //   name: req.body.name,
      //   avatar: !req.file ? null : req.file.location,
      // }
      // console.log(result.results);
      // console.log(res.r);
      // await model.User.update(userData, { where: { id: req.userId } })

      const profile = await userService().getUserProfile(req.userId);

      let result = await fireService().createFire(profile);
      // console.log(result);
      return res.r(result);
    } catch (error) {
      console.log(error.results);
      return next(error);
    }
  };

  const getFireData = async (req, res, next) => {
    const fireData = await fireService().getFireInfo(req.userId);
    // console.log(fireData);

    return res.json(fireData);
  };

  const getAllFireData = async (req, res, next) => {
    const fireData = await fireService().getAllFireInfo(req.userId);
    // console.log(fireData);

    return res.json(fireData);
  };

  return {
    warnFire,
    getFireData,
    getAllFireData,
  };
};

module.exports = FireController;
