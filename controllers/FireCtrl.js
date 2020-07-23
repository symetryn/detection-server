"use strict";

const model = require("../models");

const fireService = require("../services/FireService");
const userService = require("../services/UserService");

const FireController = () => {
  const warnFire = async (req, res, next) => {
    try {
      //get user token
      const fcmToken = await userService().getFcmToken(req.userId);
      //get fire department tokens
      const fcmFireToken = await userService().getFireTokens();
      //if fire department token
      if (fcmFireToken.length > 0 && fcmToken)
        //send notification
        await fireService().sendNotification(req.body, [
          fcmToken,
          ...fcmFireToken,
        ]);
      else if (fcmToken) {
        //send notification
        await fireService().sendNotification(req.body, fcmToken);
      } else {
        res
          .status(400)
          .json({ message: "Fcm token not registered", success: false });
      }

      //get user profile
      const profile = await userService().getUserProfile(req.userId);

      //store the fire instance
      let result = await fireService().createFire(profile);

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
