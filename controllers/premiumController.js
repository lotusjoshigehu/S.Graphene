const User = require("../models/users");
const Expense = require("../models/expense");


async function showLeaderboard(req, res) {
  const users = await User.findAll({
    attributes: ["name", "totalExpense"],
    order: [["totalExpense", "DESC"]]
  });

  res.json(users);
}

async function downloadExpenses(req, res) {
    try {
        const email = req.params.email;

        const user = await User.findOne({
            where: { email }
        });

        if (!user || !user.isPremium) {
            return res.status(401).json({
                message: "Premium required"
            });
        }

        const expenses = await Expense.findAll({
            where: { UserId: user.id }
        });

        let csv = "Amount,Category,Date,Note\n";

        expenses.forEach(e => {
            csv += `"${e.amount}","${e.category}","${e.date}","${e.note || ""}"\n`;
        });

        res.setHeader(
            "Content-Type",
            "text/csv"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=expenses.csv`
        );

        res.send(csv);

    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: err.message
        });
    }
}

module.exports = {
  showLeaderboard,
  downloadExpenses
};
