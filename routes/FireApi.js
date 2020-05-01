"use strict";

// const imageUtils = require('../utils/ImageUtil');

const authMdwr = require("../middlewares/AuthMiddleware");
const fireCtrl = require("../controllers/FireCtrl");

module.exports = (router) => {
  //normal user guarded
  router.route("/fire/warn").post(authMdwr().auth, fireCtrl().warnFire);
  router.route("/fire").get(authMdwr().auth, fireCtrl().getFireData);

  //fire user guarded
  router.route("/fire/all").get(authMdwr().authFire, fireCtrl().getAllFireData);
  return router;
};
