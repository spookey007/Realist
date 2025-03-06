const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Invite extends Model {}

  Invite.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      invite_link: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        defaultValue: () => `INV-${Math.random().toString(36).substr(2, 9)}`,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // 1 = Sent, 2 = Joined
      },      
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Invite",
      tableName: "Invites",
      timestamps: true,
      underscored: true,
    }
  );

  return Invite;
};
