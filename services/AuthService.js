const jwt = require("jsonwebtoken");

const JWT_SECRET_KEY = process.env.JWT_SECRET || "secret";
const secret =
  process.env.NODE_ENV === "production" ? JWT_SECRET_KEY : "secret";

const model = require("../models");

const authService = () => {
  const issue = (payload) => jwt.sign(payload, secret, { expiresIn: "100h" });
  const verify = (token, done) => {
    jwt.verify(token, secret, {}, async (err, decoded) => {
      if (err) {
        switch (err.message) {
          case "jwt expired":
            return done(401);
          case "invalid token":
            return done(403);
          default:
            return done(err.message);
        }
      } else {
        console.log(decoded);
        return decoded.id ? done(null, decoded.id) : done(401);
      }
    });
  };

  const verifyFire = (token, done) => {
    jwt.verify(token, secret, {}, async (err, decoded) => {
      if (err) {
        switch (err.message) {
          case "jwt expired":
            return done(10401);
          case "invalid token":
            return done(10403);
          default:
            return done(err.message);
        }
      } else {
        console.log(decoded);
        return decoded.id && decoded.role === "fireUser"
          ? done(null, decoded.id)
          : done(401);
        // if (user) {
        //   return done(null, user.id);
        // } else {
        //   return done(401);
        // }
      }
    });
  };

  return {
    issue,
    verify,
    verifyFire,
  };
};

module.exports = authService;
