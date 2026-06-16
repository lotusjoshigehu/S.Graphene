require("dotenv").config();

const express = require("express");
const cors = require("cors");
const compression = require("compression");
const PORT =3000;

const sequelize = require("./connection/dbconnection");
const authController = require("./controllers/authController");
const expenseController = require("./controllers/expenseController");
const premiumController = require("./controllers/premiumController");
const paymentController = require("./controllers/paymentController");



const User = require("./models/users");
const Expense = require("./models/expense");
const Order = require("./models/orders");


const app = express();

app.use(cors());
app.use(express.json());
app.use(compression());
app.use(express.static(path.join(__dirname)));


User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);


sequelize.sync()
  
app.post("/signup", authController.signup);
app.post("/login", authController.login);
app.get("/user/status/:email", authController.userStatus);

app.post("/expense",expenseController.addExpense);
app.get("/expense/:email",expenseController.getExpenses);
app.delete("/expense/:id",expenseController.deleteExpense);
app.put("/expense/:id",expenseController.updateExpense)

app.get("/premium/showleaderboard", premiumController.showLeaderboard);
app.get("/expense/download/:email", premiumController.downloadExpenses);

app.post("/create-order", paymentController.createPremiumOrder);
app.get("/payment-success", paymentController.paymentSuccess);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
