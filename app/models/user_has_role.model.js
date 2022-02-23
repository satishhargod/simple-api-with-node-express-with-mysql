const { NULL } = require("mysql2/lib/constants/types");
//type: DataTypes.BOOLEAN,
module.exports = (sequelize, Sequelize, DataTypes) => {
  const UserHasRole = sequelize.define(
    "user_has_roles", // Model name
    {
      // Attributes
      role_id: {
        type: DataTypes.INTEGER
      },
      user_id: {
        type: DataTypes.UUID
      }
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return UserHasRole;
};
