const nodemailer = require('nodemailer');
require('dotenv').config();

const mailUser = process.env.MAIL_USER;
const mailPassword = process.env.MAIL_PASS;
const PORT = process.env.PORT || 3000;

async function sendConfirmationEmail(username, email, uniqueKey, password, premium_status) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: mailUser,
            pass: mailPassword,
        },
    });

    const mailOptions = {
        from: mailUser,
        to: email,
        subject: 'Confirm Registration',
        html: `
        <div style="background-color: #FFF5C2; text-align: center; padding: 20px;">
            <h1 style="color: #3498db;">Hi, ${username}!</h1>
            <p style="color: #333; font-size: 18px;">Click the button below to confirm your registration to the FootballScore website:</p>
            <form action="http://localhost:${PORT}/confirmation" method="POST" style="margin-top: 20px; display: flex; flex-direction: column; align-items: center;">
                <input type="hidden" name="uniqueKey" value="${uniqueKey}" style="display: none;">
                <input type="hidden" name="username" value="${username}" style="display: none;">
                <input type="hidden" name="email" value="${email}" style="display: none;">
                <input type="hidden" name="password" value="${password}" style="display: none;">
                <input type="hidden" name="premiumStatus" value="${premium_status}" style="display: none;">
              
                <button type="submit" style="padding: 10px 20px; background-color: #3498db; color: #fff; border: none; cursor: pointer;
                 font-size: 16px; margin-top: 10px; margin-left: auto; margin-right: auto;">Confirm Registration</button>
            </form>
            <p style="color: #333; font-size: 14px;"> This link will expire in 20 minutes</p>
        </div>`,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject('Error sending confirmation email');
            } else {
                resolve();
            }
        });
    });
    
}

module.exports = {
    sendConfirmationEmail,
};

