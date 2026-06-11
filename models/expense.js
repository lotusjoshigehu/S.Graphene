const { DataTypes } = require("sequelize");
const sequelize = require("../connection/dbconnection");

const Expense = sequelize.define("Expense", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },

    category: {
        type: DataTypes.STRING,
        allowNull: false
    },

    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    note: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Expense;

