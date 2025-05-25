import nodemailer from 'nodemailer';

export const sendResetEmail = async (email, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // your Gmail
      pass: process.env.EMAIL_PASS  // app password, NOT your real Gmail password
    }
  });

  const mailOptions = {
    from: `"Reset Password" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Link',
    html: `
      <p>Hi,</p>
      <p>You requested to reset your password.</p>
      <p>Click the link below to reset it:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};
