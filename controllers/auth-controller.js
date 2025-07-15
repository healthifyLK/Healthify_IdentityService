const { registerUserService } = require("../services/auth-service");

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const result = await registerUserService({
      username,
      email,
      password,
      role,
    });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
};
