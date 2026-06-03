const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_PORT == 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'InterviewAce AI — Reset Your Password',
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #0F172A; color: #E2E8F0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #1E293B; border-radius: 16px; overflow: hidden; border: 1px solid #334155; }
    .header { background: linear-gradient(135deg, #7C3AED, #6366F1); padding: 40px 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 800; color: #fff; }
    .header p { margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px; }
    .body { padding: 40px 32px; }
    .body p { line-height: 1.7; color: #94A3B8; }
    .btn { display: inline-block; background: linear-gradient(135deg, #7C3AED, #6366F1); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 16px; margin: 24px 0; }
    .warning { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 16px; margin-top: 24px; font-size: 14px; color: #FCA5A5; }
    .footer { border-top: 1px solid #334155; padding: 24px 32px; text-align: center; font-size: 12px; color: #475569; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 InterviewAce AI</h1>
      <p>AI-Powered Interview Preparation</p>
    </div>
    <div class="body">
      <p>Hi <strong>${name}</strong>,</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <div style="text-align: center;">
        <a href="${resetUrl}" class="btn">Reset My Password</a>
      </div>
      <div class="warning">
        ⚠️ This link expires in <strong>15 minutes</strong>. If you didn't request a password reset, please ignore this email — your account is safe.
      </div>
      <p style="margin-top: 24px;">Or copy this link:<br><small style="color: #6366F1; word-break: break-all;">${resetUrl}</small></p>
    </div>
    <div class="footer">
      <p>© 2024 InterviewAce AI. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to InterviewAce AI! 🎯',
    html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: #0F172A; color: #E2E8F0; margin: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #1E293B; border-radius: 16px; border: 1px solid #334155; }
    .header { background: linear-gradient(135deg, #7C3AED, #6366F1); padding: 40px 32px; text-align: center; }
    .header h1 { margin: 0; font-size: 28px; font-weight: 800; color: #fff; }
    .body { padding: 40px 32px; }
    .body p { line-height: 1.7; color: #94A3B8; }
    .feature { display: flex; align-items: center; gap: 12px; margin: 12px 0; }
    .footer { border-top: 1px solid #334155; padding: 24px; text-align: center; font-size: 12px; color: #475569; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header"><h1>🎯 Welcome to InterviewAce AI!</h1></div>
    <div class="body">
      <p>Hi <strong>${name}</strong>, welcome aboard! 🚀</p>
      <p>You've just joined thousands of students who are acing their interviews with AI-powered preparation.</p>
      <p><strong>What you can do:</strong></p>
      <p>✅ Practice with AI Mock Interviews<br>✅ Analyze your Resume for ATS compatibility<br>✅ Get detailed AI feedback on every answer<br>✅ Track your progress with Analytics</p>
      <p style="margin-top: 24px;">Start your first interview today and boost your confidence!</p>
    </div>
    <div class="footer">© 2024 InterviewAce AI</div>
  </div>
</body>
</html>`,
  });
};

module.exports = { sendPasswordResetEmail, sendWelcomeEmail };
