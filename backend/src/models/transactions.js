module.exports = (sequelize, DataTypes) => {
    const Transactions = sequelize.define("Transactions", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users", 
                key: "id"
            }
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        level: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        tableName: "transactions",
        timestamps: true,
        underscored: true
    });

    Transactions.associate = (models) => {
        Transactions.belongsTo(models.User, {
            foreignKey: "user_id",
            as: "user"
        });
    };

    return Transactions;
};
