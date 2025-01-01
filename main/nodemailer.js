const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'lukkasz.h@gmail.com',
        pass: 'hrhurhvkmczhlivd',
    },
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: 'lukkasz.h@gmail.com',
        to,
        subject,
        text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(`Error: ${error}`);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    });
};

module.exports = sendEmail;
