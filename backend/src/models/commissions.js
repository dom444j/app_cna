module.exports = (sequelize, DataTypes) => {
    const Commission = sequelize.define("Commission", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("pending", "approved"),
        defaultValue: "pending",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    }, {
      tableName: "commissions",
      timestamps: false,
    });
  
    Commission.associate = (models) => {
      Commission.belongsTo(models.User, { foreignKey: "user_id" });
    };
  
    return Commission;
  };
  