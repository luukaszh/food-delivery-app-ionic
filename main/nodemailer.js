const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lukkasz.h@gmail.com',
        pass: 'hrhurhvkmczhlivd',
    },
});

const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: 'lukkasz.h@gmail.com',
        to,
        subject,
        text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return { success: true, info };
      } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
      }
};

module.exports = sendEmail;
