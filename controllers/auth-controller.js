const { registerUserService, loginUserService } = require("../services/auth-service");

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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUserService({ email, password });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
