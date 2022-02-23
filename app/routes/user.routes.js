const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const userValidation = require('../validations/user.validation');

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  // app.get(
  //   "/api/test/mod",
  //   [authJwt.verifyToken, authJwt.isModerator],
  //   controller.moderatorBoard
  // );

  // app.get(
  //   "/api/test/admin",
  //   [authJwt.verifyToken, authJwt.isAdmin],
  //   controller.adminBoard
  // );

  app.post("/user/users", [authJwt.verifyToken], userValidation.userList, controller.userList);

  app.get("/user/user-details/:id", [authJwt.verifyToken], controller.getUserDetails);

  app.post("/user/user-update", [authJwt.verifyToken], userValidation.userUpdate, controller.userUpdate);

  app.delete("/user/user-delete/:id", [authJwt.verifyToken], controller.userDelete);


  
};
