"use strict";

const util = require("../utils/Crypto");
const model = require("../models");

const authService = require("../services/AuthService");
const userService = require("../services/UserService");

const UserController = () => {
  const signup = async (req, res, next) => {
    let result;

    try {
      const { pw, salt } = util.doCipher(req.body.password);
      const verification = req.body.role == "user";

      const userData = {
        phone: req.body.phone,
        name: req.body.name,
        password: pw,
        lat: req.body.lat,
        long: req.body.long,
        salt: salt,
        fcmToken: req.body.fcmtoken,
        role: "user",
        verification,
        email: req.body.email,
      };

      await userService().isUsedPhone(userData.phone);
      const user = await userService().signUp(userData);

      const token = authService().issue({ id: user.id, role: user.role });

      result = {
        profile: {
          id: user.id,
          phone: user.phone,
          name: user.name,
        },
        token,
      };
    } catch (error) {
      if (error == 1401)
        return res
          .status(400)
          .json({ isSuccess: false, message: "Phone number already exists" });
      return next(error);
    }

    return res.status(200).json(result);
  };

  const signin = async (req, res, next) => {
    let result;

    try {
      const salt = await userService().getSalt(req.body.email);

      const userData = {
        email: req.body.email,
        pw: util.doCipher(req.body.password, salt).pw,
        fcmToken: req.body.fcmToken,
      };
      console.log("tokens to be set", req.body.fcmToken);
      const user = await userService().signIn(userData);
      if (!user)
        return res
          .status(401)
          .json({ message: "invalid username or password" });
      if (userData.fcmToken) await userService().updateFcmToken(userData);

      const token = authService().issue({ id: user.id, role: user.role });

      result = {
        isSuccess: true,
        message: "signin success",
        token,
        role: user.role,
      };
    } catch (error) {
      console.log(error);

      return next(500);
    }

    return res.status(200).json(result);
  };

  const getProfile = async (req, res, next) => {
    let result;

    try {
      result = await model.User.findOne({
        where: {
          id: req.userId,
        },
        attributes: ["id", "name", "lat", "long", "fcmToken"],
      });
    } catch (error) {
      return next(error);
    }

    return res.r(result);
  };

  const editProfile = async (req, res, next) => {
    try {
      const userData = {
        name: req.body.name,
        avatar: !req.file ? null : req.file.location,
      };

      await model.User.update(userData, { where: { id: req.userId } });
    } catch (error) {
      return next(error);
    }

    return res.r();
  };

  const setLocation = async (req, res, next) => {
    try {
      const location = {
        lat: req.body.lat,
        long: req.body.long,
      };

      await model.User.update(location, { where: { id: req.userId } });
      res.r();
    } catch (error) {
      return next(error);
    }
  };

  return {
    signup,
    signin,
    setLocation,
    getProfile,
    editProfile,
  };
};

module.exports = UserController;
