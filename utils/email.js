const nodemailer = require('nodemailer');

// Create a new transporter object
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'yourstruelysaisandeep@gmail.com',
        pass: 'qscb ymtw qnuw zryl',
    }
});

// Send an email
const send = ({ email, subject, message }) => {
    console.log("sending email", email, subject, message);

    return new Promise((resolve, reject) => {
        transporter.sendMail({
            from: 'yourstruelysaisandeep@gmail.com',
            to: email,
            subject: subject,
            text: "This is a plain text version of your message.", // Plain text version
            html: `
            <div style="background-color: #f4f4f4; padding: 20px; font-family: Arial, sans-serif;">

            <img src="https://play-lh.googleusercontent.com/MjrPI6DZ82LTP0Gt6MtJrAruaAUIa4mj029OJDOpwiyNC4HLcqljzDVohqjDWEhoNl0" alt="Logo" style="width:auto; height:auto;">
            
                <h2 style="color: #333;">${subject}</h2>
                <p style="font-size: 16px; color: #0000FF;">${message} valid for 10 minutes</p>
                <p style="font-size: 14px; color: #777;">Thanks for using our service!</p>
            </div>
        `

        }, (err, info) => {
            if (err) {
                console.log("error", err);
                reject(new Error("email error"));
            } else {
                console.log("okay sent");
                resolve("success");
            }
        });
    });
};

module.exports = send;

