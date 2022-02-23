const db = require("../models");
const User = db.user;
const Role = db.role;
const UserHasRole = db.userhasrole;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/config");
const {getPagination, paginate} = require("../helpers/CustomPagination");

/**
 * find one by filter
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
 const findUsersByFilter = async (filter, only_admin, options) => {
      let {page, row_limit} = options;
      User.hasOne(UserHasRole, {foreignKey: 'user_id'})
      UserHasRole.belongsTo(Role, {foreignKey: 'role_id'})
      let filter_data = filter;
      let adminfilter = {};
      if(only_admin == true){
        adminfilter = {name:'admin'}
      }
      if(only_admin == false){
        adminfilter = {name:'user'}
      }
      const { limit, offset } = getPagination(page, row_limit);
     
      let data =  await User.findAndCountAll({
          filter,
          include: [
              {
                  model: UserHasRole, 
                  as: 'user_has_role',
                  required: true,
                  include: [{
                    where: adminfilter,                    
                    model: Role,
                    as: 'role',                
                  }] 
              }
          ],
          limit, 
          offset
      });

      let result = paginate(data, page, limit)

      return result;
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (reqBody) => {

    let userdata =  await User.create({
        first_name: reqBody.first_name,
        last_name: reqBody.last_name,
        email: reqBody.email,
        password: bcrypt.hashSync(reqBody.password, 8)
    });
    return userdata;
};

/**
 * Add a role
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
 const addUserRole = async (reqBody) => {
    let userrole =  await UserHasRole.create({
        role_id: reqBody.role_id,
        user_id: reqBody.user_id
    });
    return userrole;
};

/**
 * find one by filter
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const findOneUserByFilter = async (filter) => {
    User.hasOne(UserHasRole, {foreignKey: 'user_id'})
    UserHasRole.belongsTo(Role, {foreignKey: 'role_id'})
    let userdata = await User.findOne({
        where:filter,
        include: [
            {
                model: UserHasRole, 
                as: 'user_has_role',
                include: [{
                  model: Role,
                  as: 'role',                
                }] 
            }
        ]
    });
    return userdata;
};

/**
 * find one by filter
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
 const findOneUserDetailsByFilter = async (filter) => {
  User.hasOne(UserHasRole, {foreignKey: 'user_id'})
  UserHasRole.belongsTo(Role, {foreignKey: 'role_id'})
  let userdata = await User.findAll({
      where:filter,
      include: [
          {
              model: UserHasRole, 
              as: 'user_has_role',
              include: [{
                model: Role,
                as: 'role',                
              }] 
          }
      ]
  });
  return userdata;
};

/**
 * find one user by filter
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
 const generateToken = async (user) => {

      let token = jwt.sign({ id: user.id }, config.auth.secret, {
        expiresIn: 86400 // 24 hours
      });
  
      let authorities = [];
      return await user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
  
        return {
          roles: {authorities},
          token: {accessToken:token}
        };
      });
    
};

/**
 * find one by filter
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const updateUserByFilter = async (filter, bodyData) => {
    User.update(bodyData, {
      where: filter
    })
};

/**
 * delete user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const userDeleteUsingId = async (id) => {
  let bodyData = {deleted_at: new Date(), first_name:"new"};
    User.update(bodyData, {
      where: {id:id}
    })  
};

module.exports = {
    findUsersByFilter,
    createUser,
    findOneUserByFilter,
    findOneUserDetailsByFilter,
    generateToken,
    addUserRole,
    updateUserByFilter,
    userDeleteUsingId
};

// const db = require("../models");
// const User = db.user;

// /**
//  * Create a user
//  * @param {Object} userBody
//  * @returns {Promise<User>}
//  */
//  const createUser = async (reqBody) => {

//     let userdata =  await User.create({
//         first_name: reqBody.first_name,
//         last_name: reqBody.last_name,
//         email: reqBody.email,
//         password: bcrypt.hashSync(reqBody.password, 8)
//       })
//         .then(user => {
//           if (reqBody.roles) {
//             Role.findAll({
//               where: {
//                 name: {
//                   [Op.or]: reqBody.roles
//                 }
//               }
//             }).then(roles => {
//               user.setRoles(roles).then(() => {
//                 res.send({ message: "User was registered successfully!" });
//               });
//             });
//           } else {
//             // User role 1
//             user.setRoles([1]).then(() => {
//               res.send({ message: "User was registered successfully!" });
//             });
//           }
//         })
//         .catch(err => {
//           res.status(500).send({ message: err.message });
//         });
//   };

// module.exports = {
//     createUser,
// };