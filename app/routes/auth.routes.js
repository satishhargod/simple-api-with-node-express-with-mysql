const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const validate = require('../middlewares/validate');
const authValidation = require('../validations/auth.validation');


module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );

    next();
  });

  //admin
    app.post("/api/auth/signinadmin", authValidation.signInAdmin, controller.signInAdmin);

  //common admin and user
    app.post("/api/auth/signup", authValidation.signup, controller.signup);
};
