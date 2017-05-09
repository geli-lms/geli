import * as nodemailer from 'nodemailer';

import {IUserModel, User} from '../models/User';
import config from '../config/main';
import {Transporter} from 'nodemailer';

class EmailService {

  readonly transporter: Transporter = nodemailer.createTransport(
    {
      // define endpoint and login-credentials for smtp server
      service: config.mailProvider,
      auth: config.mailAuth,
      debug: false // include SMTP traffic in the logs
    }, {
      // default message fields
      // sender info
      from: 'GELI <' + config.mailSender + '>'
    }
  );

  constructor() {

  };

  sendActivation (user: IUserModel) {
      if (!user) {
        throw new Error('user not defined');
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
          `<a href='http://localhost:4200/activate/` + encodeURIComponent(user.authenticationToken) +
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
};

export default new EmailService();
