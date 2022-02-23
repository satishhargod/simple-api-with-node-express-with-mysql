// exports.allAccess = (req, res) => {
//   res.status(200).send("Public Content.");
// };

// exports.userList = (req, res) => {
//   res.status(200).send("User Content.");
// };

// exports.adminBoard = (req, res) => {
//   res.status(200).send("Admin Content.");
// };

// exports.moderatorBoard = (req, res) => {
//   res.status(200).send("Moderator Content.");
// };


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
 * User List
 * @param {Object} reqBody
 * @returns {Promise<User>}
 */
const userList = catchAsync(async (req, res) => {
    let userfilter = {};
    let only_admin = req.body.only_admin;
    let options = {page:req.body.page, row_limit:req.body.row_limit}
    const users = await userService.findUsersByFilter(userfilter, only_admin, options);

    res.status(httpStatus.OK).send(new ResponseObject(httpStatus.OK, await prepareMessageHelper.prepareMessage(MessageFilePath, "userDisplaySuccess"), users));
});

/**
 * User update
 * @param {Object} reqBody
 * @returns {Promise<User>}
 */
 const userUpdate = catchAsync(async (req, res) => {
  let filter = {id:req.body.id};
  let bodydata = req.body
  const users = await userService.updateUserByFilter(filter, bodydata);

  res.status(httpStatus.OK).send(new ResponseObject(httpStatus.OK, await prepareMessageHelper.prepareMessage(MessageFilePath, "userUpdateSuccess"), users));
});

/**
 * User details
 * @param {Object} reqBody
 * @returns {Promise<User>}
 */
const getUserDetails = catchAsync(async (req, res) => {
    let filter = {id:req.params.id};
    const users = await userService.findOneUserDetailsByFilter(filter);
    res.status(httpStatus.OK).send(new ResponseObject(httpStatus.OK, await prepareMessageHelper.prepareMessage(MessageFilePath, "userDisplaySuccess"), users));
});

/**
 * User Delete
 * @param {Object} reqBody
 * @returns {Promise<User>}
 */
const userDelete = catchAsync(async (req, res) => {
    const users = await userService.userDeleteUsingId(req.params.id);
    res.status(httpStatus.OK).send(new ResponseObject(httpStatus.OK, await prepareMessageHelper.prepareMessage(MessageFilePath, "userDeleteSuccess"), users));
});

module.exports = {
  userList,
  userUpdate,
  getUserDetails,
  userDelete
};

