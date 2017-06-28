import * as nodemailer from 'nodemailer';

import {IUserModel} from '../models/User';
import config from '../config/main';
import {Transporter} from 'nodemailer';

class EmailService {

  private transporter: Transporter = null;
  private mailTransportConfig: any = {
    debug: false // include SMTP traffic in the logs
  };
  private mailDefaultConfig: any = {
    // default message fields
    // sender info
    from: 'GELI <' + config.mailSender + '>'
  };

  constructor() {

    // define endpoint and login-credentials for smtp server
    if (config.mailSMTPServer === undefined) {
      this.mailTransportConfig.service = config.mailProvider;
    } else {
      this.mailTransportConfig.host = config.mailSMTPServer;
      this.mailTransportConfig.port = config.mailSMTPPort;
    }

    if (config.mailAuth.user === undefined) {
      this.mailTransportConfig.tls = { rejectUnauthorized: false };
    } else {
      this.mailTransportConfig.auth = config.mailAuth;
    }

    this.transporter = nodemailer.createTransport(this.mailTransportConfig, this.mailDefaultConfig);

  };

  sendActivation(user: IUserModel) {
    if (!user) {
      throw new Error('user not defined');
    }
    if (!user.authenticationToken) {
      throw new Error('this user has no authenticationToken defined');
    }

    const message = {
      // Comma separated list of recipients
      to: user.profile.firstName + ' ' + user.profile.lastName + '<' + user.email + '>',

      // Subject of the message
      subject: 'Welcome to GELI :)', //

      // plaintext body
      text: 'Hello ' + user.profile.firstName + ', \n\n' +
      'your account was successfully created. Please use the following link to verify your E-Mail: \n' +
      config.baseurl + '/activate/' + encodeURIComponent(user.authenticationToken) + '\n\n' +
      'Your GELI Team.',

      // html body
      html: '<p>Hello ' + user.profile.firstName + ',</p><br>' +
      '<p>your account was successfully created. Please use the following link to verify your E-Mail: \n' +
      `<a href='` + config.baseurl + '/activate/' + encodeURIComponent(user.authenticationToken) +
      `'>` + config.baseurl + '/activate/' + encodeURIComponent(user.authenticationToken) + '</a></p><br>' +
      '<p>Your GELI Team.</p>'
    };

    this.transporter.sendMail(message, (error: any, info: any) => {
      if (error) {
        console.log('Error occurred');
        console.log(error.message);
      }
    });
  }
}
;

export default new EmailService();
