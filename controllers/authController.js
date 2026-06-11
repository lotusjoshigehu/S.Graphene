const bcrypt = require("bcrypt");
const User = require("../models/users");

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json("User already exists");

    const hash = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hash,
      isPremium: false,
      totalExpense: 0
    });

    res.json("Signup successful");
  } catch {
    res.status(500).json("Signup failed");
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json("User not found");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json("Wrong password");

    res.json({ email: user.email, isPremium: user.isPremium });
  } catch {
    res.status(500).json("Login failed");
  }
}

async function userStatus(req, res) {
  const user = await User.findOne({ where: { email: req.params.email } });
  res.json({ isPremium: user ? user.isPremium : false });
}

module.exports = {
  signup,
  login,
  userStatus
};
