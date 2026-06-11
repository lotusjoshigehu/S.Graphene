const { v4: uuidv4 } = require("uuid");
const User = require("../models/users");




async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const request = await ForgotPasswordRequest.create({
      id: uuidv4(),
      UserId: user.id,
      isActive: true
    });

    await sendResetMail(email);

    res.json({ message: "Reset email sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Forgot password failed" });
  }
}

module.exports = {
  forgotPassword
};
