module.exports = (sequelize, DataTypes) => {
    const Purchase = sequelize.define(
        "Purchase",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users",
                    key: "id",
                },
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "products",
                    key: "id",
                },
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            timestamps: false, // 🔹 Desactiva createdAt y updatedAt
            tableName: "purchases",
        }
    );

    Purchase.associate = (models) => {
        Purchase.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user",
        });
        Purchase.belongsTo(models.Product, {
            foreignKey: "product_id",
            as: "product",
        });
    };

    return Purchase;
};
