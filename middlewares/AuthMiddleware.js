"use strict";

const authService = require("../services/AuthService");

/*******************
 *  Authenticate
 ********************/
const AuthMiddleware = () => {
  const auth = async (req, res, next) => {
    console.log(req.headers);
    if (!req.headers.authorization) {
      return next(401);
    }
    console.log("verifying");

    authService().verify(
      req.headers.authorization.split(" ")[1],
      (err, userId) => {
        if (err) {
          return next(err);
        } else {
          req.userId = userId;
          console.log(userId);
          return next();
        }
      }
    );
  };

  const authFire = async (req, res, next) => {
    console.log(req.headers);
    if (!req.headers.authorization) {
      return next(401);
    }
    console.log("verifying");

    authService().verifyFire(
      req.headers.authorization.split(" ")[1],
      (err, userId) => {
        if (err) {
          return next(err);
        } else {
          req.userId = userId;
          console.log(userId);
          return next();
        }
      }
    );
  };
  return { auth, authFire };
};

module.exports = AuthMiddleware;
