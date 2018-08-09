import * as nodemailer from 'nodemailer';

import {IUserModel} from '../models/User';
import config from '../config/main';
import {SendMailOptions, Transporter} from 'nodemailer';
import {IUser} from '../../../shared/models/IUser';

const markdown = require('nodemailer-markdown').markdown;

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
    if (process.env.NODE_ENV && process.env.NODE_ENV.includes('test')) {
      this.mailTransportConfig.streamTransport = true;
    }

    // define endpoint and login-credentials for smtp server
    if (config.mailSMTPServer === undefined) {
      this.mailTransportConfig.service = config.mailProvider;
    } else {
      this.mailTransportConfig.host = config.mailSMTPServer;
      this.mailTransportConfig.port = config.mailSMTPPort;
    }

    if (config.mailAuth.user === undefined) {
      this.mailTransportConfig.tls = {rejectUnauthorized: false};
    } else {
      this.mailTransportConfig.auth = config.mailAuth;
    }

    this.transporter = nodemailer.createTransport(this.mailTransportConfig, this.mailDefaultConfig);
    this.transporter.use('compile', markdown());
  }

  public sendActivation(user: IUserModel) {
    if (!user) {
      throw new Error('user not defined');
    }
    if (!user.authenticationToken) {
      throw new Error('this user has no authenticationToken defined');
    }

    const message: SendMailOptions = {};

    message.to = user.profile.firstName + ' ' + user.profile.lastName + '<' + user.email + '>';
    message.subject = 'Welcome to GELI :)';
    message.text = 'Hello ' + user.profile.firstName + ', \n\n' +
      'your account was successfully created. Please use the following link to verify your E-Mail:\n' +
      config.baseurl + '/activate/' + encodeURIComponent(user.authenticationToken) + '\n\n' +
      'Your GELI Team.';
    message.html = '<p>Hello ' + user.profile.firstName + ',</p><br>' +
      '<p>your account was successfully created. Please use the following link to verify your E-Mail:' +
      `<a href='` + config.baseurl + '/activate/' + encodeURIComponent(user.authenticationToken) +
      `'>` + config.baseurl + '/activate/' + encodeURIComponent(user.authenticationToken) + '</a></p><br>' +
      '<p>Your GELI Team.</p>';

    return this.sendMail(message);
  }

  public resendActivation(user: IUserModel) {
    if (!user) {
      throw new Error('user not defined');
    }
    if (!user.authenticationToken) {
      throw new Error('this user has no authenticationToken defined');
    }

    const message: SendMailOptions = {};

    message.to = user.profile.firstName + ' ' + user.profile.lastName + '<' + user.email + '>';
    message.subject = 'Welcome again to GELI :)';
    message.text = 'Hello ' + user.profile.firstName + ', \n\n' +
      'you requested a new email verification. Your previous email verification link is invalid from now on.\n' +
      'Please use the following link to verify your E-Mail:\n' +
      config.baseurl + '/activate/' + encodeURIComponent(user.authenticationToken) + '\n\n' +
      'Your GELI Team.';
    message.html = '<p>Hello ' + user.profile.firstName + ',</p><br>' +
      '<p>you requested a new email verification. Your previous email verification link is invalid from now on.<br>' +
      'Please use the following link to verify your E-Mail:<br>' +
      `<a href='` + config.baseurl + '/activate/' + encodeURIComponent(user.authenticationToken) +
      `'>` + config.baseurl + '/activate/' + encodeURIComponent(user.authenticationToken) + '</a></p><br>' +
      '<p>Your GELI Team.</p>';

    return this.sendMail(message);
  }

  public sendPasswordReset(user: IUserModel) {
    if (!user) {
      throw new Error('user not defined');
    }
    if (!user.resetPasswordToken) {
      throw new Error('this user has no resetPasswordToken defined');
    }

    const message: SendMailOptions = {};

    message.to = user.profile.firstName + ' ' + user.profile.lastName + '<' + user.email + '>';
    message.subject = 'A password reset for your GELI account was requested';
    message.text = 'Hello ' + user.profile.firstName + ', \n\n' +
      'you requested a password reset for your GELI account. ' +
      'You can use the following link within the next 24h to set a new password:\n' +
      config.baseurl + '/reset/' + encodeURIComponent(user.resetPasswordToken) + '\n\n' +
      'If you didn\'t requested this reset just login with your current credentials to automatically dismiss this process\n\n' +
      'Your GELI Team.';
    message.html = '<p>Hello ' + user.profile.firstName + ',</p><br>' +
      '<p>you requested a password reset for your GELI account. ' +
      'You can use the following link within the next 24h to set a new password:' +
      `<a href='` + config.baseurl + '/reset/' + encodeURIComponent(user.resetPasswordToken) +
      `'>` + config.baseurl + '/reset/' + encodeURIComponent(user.resetPasswordToken) + '</a></p>' +
      '<p>If you didn\'t requested this reset just login with your current credentials to automatically dismiss this process<br>' +
      '<p>Your GELI Team.</p>';

    return this.sendMail(message);
  }

  public sendDeleteRequest(forUser: IUser, toAdmin: IUser) {
    const message: SendMailOptions = {};

    if (toAdmin.role !== 'admin') {
      throw new Error('Receiver of delete request is not an admin!');
    }

    message.to = toAdmin.profile.firstName + ' ' + toAdmin.profile.lastName + '<' + toAdmin.email + '>';
    message.subject = 'User delete request';
    message.text = `Hello  ${toAdmin.profile.firstName}, \n\n` +
      `the user "${forUser.profile.firstName} ${forUser.profile.lastName}" (${forUser.email})` +
      `requested to delete all of his / her personal data. \n \n` +
      `Please login in GELI and use ${config.baseurl}/admin/users/delete/${forUser._id} to delete the user. \n \n` +
      `Your GELI team.`;

    message.html = `<p>Hello ${toAdmin.profile.firstName},</p> <br>` +
      `<p>the user <b>"${forUser.profile.firstName} ${forUser.profile.lastName}" (${forUser.email})</b> ` +
      `requested to delete all of his / her personal data.</p><br>` +
      `<p>Please login in GELI and use <a href="${config.baseurl}/admin/users/delete/${forUser._id}">` +
      `${config.baseurl}/admin/users/delete/${forUser._id}</a> ` +
      `to delete the user.</p><br>` +
      `<p>Your GELI Team.</p>`;

    return this.sendMail(message);
  }

  public sendFreeFormMail(mailData: any) {
    return this.sendMail(mailData);
  }

  private sendMail(message: SendMailOptions) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(message, (error: any, info: any) => {
        if (error) {
          reject({error: error, info: info});
        } else {
          resolve(info);
        }
      });
    });
  }
}

export default new EmailService();
