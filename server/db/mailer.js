const nodemailer = require('nodemailer');

nodemailer.createTestAccount((err, account) => {

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'sourcesoft.developer@gmail.com', // generated ethereal user
            pass: '!!#$124><RTTq1' // generated ethereal password
        },

    });
    module.exports={transporter};
