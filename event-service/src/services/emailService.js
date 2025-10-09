const nodemailer = require('nodemailer');

// Configure Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS  // Use app password for Gmail
  }
});

// Function to send approval email to organizer
const sendApprovalEmail = async (to, eventName) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject: `Event "${eventName}" Approved!`,
    text: `Dear Organizer,\n\nYour event "${eventName}" has been successfully approved by the admin.\n\nYou can now proceed with preparations.\n\nBest regards,\nBlood Circle Team`,
    html: `<p>Dear Organizer,</p><p>Your event <strong>"${eventName}"</strong> has been successfully approved by the admin.</p><p>You can now proceed with preparations.</p><p>Best regards,<br>Blood Circle Team</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${to}`);
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw new Error('Failed to send approval email');
  }
};

module.exports = { sendApprovalEmail };