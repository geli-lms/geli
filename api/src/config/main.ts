export default {
  // Secret key for JWT signing and encryption
  secret: process.env.SECRET || 'notSoSecret234oi23o423ooqnafsnaaslfj',

  // BaseUrl for Webfrontend
  baseurl: process.env.BASEURL || 'http://localhost:4200',

  // Database connection information
  database: `mongodb://${process.env.DB_HOST || 'docker-ip'}:27017`,

  // Setting port for server
  port: process.env.PORT || 3030,

  // Email configuration
  // for provider see https://nodemailer.com/smtp/well-known/
  // Use either Provider or SMTPServer/Port
  mailProvider: process.env.MAILPROVIDER || 'debugmail',
  // mailSMTPServer: process.env.MAILSMTPSERVER || 'undefined',
  // mailSMTPPort: process.env.MAILSMTPPORT || 25,
  mailAuth: {
    user: process.env.MAILUSER || '',
    pass: process.env.MAILPASS || ''
  },
  mailSender: process.env.MAILSENDER || 'no-reply@geli.edu'
};
