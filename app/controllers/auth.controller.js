const config = require("../config/config");
const {
  userService,
} = require('../services');
const catchAsync = require('../utils/catchAsync');
const ResponseObject = require('../utils/ResponseObject');
const prepareMessageHelper = require('../helpers/GetMessage');
const MessageFilePath = config.project_path + '/app/messages/SuccessMessage.json';
const httpStatus = require('http-status');
const bcrypt = require("bcryptjs");

/**
 * register function
 * @param {Object} reqBody
 * @returns {Promise<User>}
 */
const signup = catchAsync(async (req, res) => {
    let userfilter = {
      email: req.body.email
    };
    const userexist = await userService.findOneUserByFilter(userfilter);
    
    if (userexist) {
      return res.status(httpStatus.CONFLICT).send(new ResponseObject(httpStatus.CONFLICT, await prepareMessageHelper.prepareMessage(MessageFilePath, "userAlreadyExist"), {}));
    }
    const user = await userService.createUser(req.body);
    
    if(user){
      await userService.addUserRole({user_id:user.id, role_id:req.body.role_id})
    }

    res.status(httpStatus.OK).send(new ResponseObject(httpStatus.OK, await prepareMessageHelper.prepareMessage(MessageFilePath, "registered"), user));
});

const signInAdmin = catchAsync(async (req, res) => {

    if(req.body.type != 'admin'){
      return res.status(httpStatus.NOT_FOUND).send(new ResponseObject(httpStatus.NOT_FOUND, await prepareMessageHelper.prepareMessage(MessageFilePath, "userNotFound"), {}));
    }

    let userfilter = {
      email: req.body.email
    };

    const user = await userService.findOneUserByFilter(userfilter);   

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).send(new ResponseObject(httpStatus.NOT_FOUND, await prepareMessageHelper.prepareMessage(MessageFilePath, "userNotFound"), {}));
    }

    if (user) {
      if(user.user_has_role.role.name != 'admin'){
        return res.status(httpStatus.NOT_FOUND).send(new ResponseObject(httpStatus.NOT_FOUND, await prepareMessageHelper.prepareMessage(MessageFilePath, "userNotFound"), {}));
      }
    }

    
    let passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(httpStatus.UNAUTHORIZED).send(new ResponseObject(httpStatus.UNAUTHORIZED, await prepareMessageHelper.prepareMessage(MessageFilePath, "invalidPassword"), {}));
    }

    const token = await userService.generateToken(user)

    res.status(httpStatus.OK).send(new ResponseObject(httpStatus.OK, await prepareMessageHelper.prepareMessage(MessageFilePath, "registered"), {
      user,
      ...token
    }));
});

module.exports = {
  signup,
  signInAdmin
};
