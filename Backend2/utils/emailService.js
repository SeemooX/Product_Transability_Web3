const transporter = require("../config/mailer");

const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    await transporter.sendMail({
      from: `Tracability <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;