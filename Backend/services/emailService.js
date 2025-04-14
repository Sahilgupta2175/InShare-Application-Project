// const nodemailer = require('nodemailer');
// console.log("SMTP_HOST", process.env.SMTP_HOST);
// async function sendMail({ from, to, subject, text, html}) {
//     let transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: process.env.SMTP_PORT,
//         secure: false,
//         requireTLS: true,
//         service: process.env.SMTP_SERVICE,
//         auth: {
//             user: process.env.MAIL_USER,
//             pass: process.env.MAIL_PASS
//         },
//         debug: false,
//         logger: true
//     });

//     let info = await transporter.sendMail({
//         from: `InShare <${from}>`,
//         to,
//         subject,
//         text,
//         html
//     });

//     console.log(info);
// }

// module.exports = sendMail;


const nodemailer = require('nodemailer');

async function sendMail({ from, to, subject, text, html }) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER, 
            pass: process.env.MAIL_PASS
        }
    });

    let info = await transporter.sendMail({
        from: `InShare <${from}>`,
        to,
        subject,
        text,
        html
    });

    console.log("Email sent:", info.messageId);
}

module.exports = sendMail;
