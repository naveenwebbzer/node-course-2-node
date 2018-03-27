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

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Register 👻" <naveenk@sourcesoftsolutions.com>', // sender address
        to: 'Pawan@sourcesoftsolutions.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    });
});
