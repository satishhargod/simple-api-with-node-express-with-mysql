const { NULL } = require("mysql2/lib/constants/types");
//type: DataTypes.BOOLEAN,
module.exports = (sequelize, Sequelize, DataTypes) => {
  const User = sequelize.define(
    "user", // Model name
    {
      // Attributes
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      first_name: {
        type: DataTypes.STRING,
        defaultValue: NULL,
      },
      last_name: {
        type: DataTypes.STRING,
        defaultValue: NULL,
      },
      email_verified_at:{
        type: DataTypes.DATE, 
        allowNull: true
      },
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      profile_photo: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
      },
      remember_token: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
    },
    {
      // Options
      timestamps: true,
      underscrored: true,
      deletedAt: "deleted_at",
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );
  return User;
};
