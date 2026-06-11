const sequelize = require("../connection/dbconnection");
const User = require("../models/users");
const Expense = require("../models/expense");

async function addExpense(req, res) {
    const t = await sequelize.transaction();

    try {
        const {
            email,
            amount,
            category,
            date,
            note
        } = req.body;

        const user = await User.findOne({
            where: { email },
            transaction: t
        });

        if (!user) {
            await t.rollback();
            return res.status(404).json("User not found");
        }

        const expense = await Expense.create({
            amount,
            category,
            date,
            note,
            UserId: user.id
        }, {
            transaction: t
        });

        user.totalExpense += Number(amount);

        await user.save({
            transaction: t
        });

        await t.commit();

        res.json(expense);

    } catch (err) {

        await t.rollback();

        res.status(500).json(err.message);
    }
}

async function getExpenses(req, res) {

    try {

        const user = await User.findOne({
            where: {
                email: req.params.email
            },
            include: Expense
        });

        if (!user) {
            return res.json([]);
        }

        const expenses = user.Expenses.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        res.json(expenses);

    } catch (err) {

        res.status(500).json(err.message);
    }
}

async function deleteExpense(req, res) {

    const t = await sequelize.transaction();

    try {

        const expense = await Expense.findByPk(
            req.params.id,
            { transaction: t }
        );

        if (!expense) {

            await t.rollback();

            return res.status(404).json(
                "Expense not found"
            );
        }

        const user = await User.findByPk(
            expense.UserId,
            { transaction: t }
        );

        user.totalExpense -= Number(
            expense.amount
        );

        await user.save({
            transaction: t
        });

        await expense.destroy({
            transaction: t
        });

        await t.commit();

        res.json("Deleted");

    } catch (err) {

        await t.rollback();

        res.status(500).json(
            err.message
        );
    }
}

async function updateExpense(req, res) {

    try {

        const {
            amount,
            category,
            date,
            note
        } = req.body;

        const expense =
            await Expense.findByPk(
                req.params.id
            );

        if (!expense) {

            return res.status(404).json(
                "Expense not found"
            );
        }

        expense.amount = amount;
        expense.category = category;
        expense.date = date;
        expense.note = note;

        await expense.save();

        res.json("Updated");

    } catch (err) {

        res.status(500).json(
            err.message
        );
    }
}

module.exports = {
    addExpense,
    getExpenses,
    deleteExpense,
    updateExpense
};