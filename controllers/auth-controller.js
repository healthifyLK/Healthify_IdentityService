const {
  registerUserService,
  loginUserService,
  requestPasswordResetService,
  resetPasswordService,
  requestLoginCodeService,
  verifyLoginCodeService,
} = require("../services/auth-service");

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

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const result = await requestPasswordResetService({ email });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const result = await resetPasswordService({ token, newPassword });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Request Login Code
const requestLoginCode = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await requestLoginCodeService({ email });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Verify Login Code and login
const verifyLoginCode = async (req, res) => {
  try {
    const { email, code } = req.body;
    const result = await verifyLoginCodeService({ email, code });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  requestPasswordReset,
  resetPassword,
  requestLoginCode,
  verifyLoginCode,
};
