export default {
    // Secret key for JWT signing and encryption
    secret: process.env.SECRET || 'notSoSecret234oi23o423ooqnafsnaaslfj',

    // Database connection information
    database: `mongodb://${process.env.DB_HOST || 'localhost'}:27017`,

    // Setting port for server
    port: process.env.PORT || 3030,

    // Email configuration
    // for provider see https://nodemailer.com/smtp/well-known/
    // Use either Provider or SMTPServer/Port
    mailProvider: process.env.MAILPROVIDER || 'debugmail',
    // mailSMTPServer: process.env.MAILSMTPSERVER || 'undefined',
    // mailSMTPPort: process.env.MAILSMTPPORT || 25,
    mailAuth: {
      user: process.env.MAILUSER || 'hasenbank.ken@gmail.com',
      pass: process.env.MAILPASS || '72759eb0-1e99-11e7-b8ac-59cc35386e58'
    },
    mailSender: process.env.MAILSENDER || 'no-reply@geli.edu'
};
