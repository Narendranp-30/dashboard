const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nprasanth372@gmail.com', // Replace with your Gmail
    pass: 'bagd bxdh zotm ytuq'     // Replace with your app password
  }
});

const sendEmail = async (receiverEmail, subject, message) => {
  try {
    const mailOptions = {
      from: 'nprasanth372@gmail.com', // Replace with your Gmail
      to: receiverEmail,
      subject: subject,
      html: message
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail }; 