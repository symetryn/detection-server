"use strict";

const authService = require("../services/AuthService");

/*******************
 *  Authenticate
 ********************/
const AuthMiddleware = () => {
  const auth = async (req, res, next) => {
    if (!req.headers.authorization) {
      return next(401);
    }

    authService().verify(
      req.headers.authorization.split(" ")[1],
      (err, userId) => {
        if (err) {
          return next(err);
        } else {
          req.userId = userId;

          return next();
        }
      }
    );
  };

  const authFire = async (req, res, next) => {
    if (!req.headers.authorization) {
      return next(401);
    }

    authService().verifyFire(
      req.headers.authorization.split(" ")[1],
      (err, userId) => {
        if (err) {
          return next(err);
        } else {
          req.userId = userId;

          return next();
        }
      }
    );
  };
  return { auth, authFire };
};

module.exports = AuthMiddleware;
