const { sendEmail } = require("../utils/email");

// Registration Success Email
const sendRegistrationSuccessEmail = async (user) => {
  const html = `
    <h2>Welcome, ${user.username}! to Healthify</h2>
    <p>Your registration was successful. You can now log in to your account with your email and password.</p>
  `;
  await sendEmail({
    to: user.email,
    subject: "Registration Successful",
    html,
  });
};

// Password Reset Email
const sendPasswordResetEmail = async (user, resetLink) => {
  const html = `
    <p>Hello, ${user.username}!</p>
    <p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>
  `;
  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    html,
  });
};

// Login Code Email
const sendLoginCodeEmail = async (user, loginCode) => {
  const html = `
  <p>Hello, ${user.username}!</p>
  <p>Your Healthify login verification code is: <b>${loginCode}</b></p>
  <p>This code will expire in 5 minutes.</p>
`;

  await sendEmail({
    to: user.email,
    subject: " Your healthify Login Verification Code",
    html,
  });
};

// You can add more email types as needed...

module.exports = {
  sendRegistrationSuccessEmail,
  sendPasswordResetEmail,
  sendLoginCodeEmail,
};
