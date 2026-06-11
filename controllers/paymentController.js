const User = require("../models/users");
const Order = require("../models/orders");
const { createOrder } = require("../services/cashfreeservices");

async function createPremiumOrder(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const orderData = await createOrder(user.id, email);

    await Order.create({
      orderId: orderData.order_id,
      paymentStatus: "PENDING",
      UserId: user.id
    });

    res.json(orderData);
  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Payment order failed" });
  }
}


async function paymentSuccess(req, res) {
  try {
    const { order_id } = req.query;

    if (!order_id) {
      return res.redirect("/expense.html");
    }

    const order = await Order.findOne({ where: { orderId: order_id } });
    if (!order) {
      return res.redirect("/expense.html");
    }

    const user = await User.findByPk(order.UserId);
    if (!user) {
      return res.redirect("/expense.html");
    }

    user.isPremium = true;
    order.paymentStatus = "SUCCESS";

    await user.save();
    await order.save();

    res.redirect("/expense.html");
  } catch (err) {
    console.error("Payment success error:", err);
    res.redirect("/expense.html");
  }
}

module.exports = {
  createPremiumOrder,
  paymentSuccess
};
