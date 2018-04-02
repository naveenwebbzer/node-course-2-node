const nodemailer = require('nodemailer');
var jade = require('jade');
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

    var html = jade.renderFile('/var/www/html/PocketWatcher/playground/html.jade', {username: 'testUsername'});
    let mailOptions = {
        from: '"Register 👻" <naveenk@sourcesoftsolutions.com>', // sender address
        to: 'Pawan@sourcesoftsolutions.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        html: html,
     text:'text'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    });
});
