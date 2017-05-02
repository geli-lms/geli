import * as nodemailer from 'nodemailer';

import {IUserModel, User} from "../models/User";
import config from "../config/main";

class EmailService {
    sendActivation (user: IUserModel) {
        if (!user)
            throw "user not defined";

        let transporter = nodemailer.createTransport(
            {
                //define endpoint and login-credentials for smtp server
                service: config.mailProvider,
                auth: config.mailAuth,
                debug: false // include SMTP traffic in the logs
            }, {
                // default message fields
                // sender info
                from: "GELI <" + config.mailSender + ">"
            }
        );

        let message = {
            // Comma separated list of recipients
            to: user.firstName + " " + user.lastName + "<" + user.email + ">",

            // Subject of the message
            subject: "Welcome to GELI :)", //

            // plaintext body
            text: "Hello " + user.firstName + ", \n\n" +
            "your account was successfully created. Please use the following link to verify your E-Mail: \n" +
            "http://localhost:4200/activate/" + encodeURIComponent(user.authenticationToken) + "\n\n" +
            "Your GELI Team.",

            // html body
            html: "<p>Hello " + user.firstName + ",</p><br>" +
            "<p>your account was successfully created. Please use the following link to verify your E-Mail: \n" +
            "<a href='http://localhost:4200/activate/" + encodeURIComponent(user.authenticationToken) + "'>http://localhost:4200/activate/" + encodeURIComponent(user.authenticationToken) + "</a></p><br>" +
            "<p>Your GELI Team.</p>"
        };

        transporter.sendMail(message, (error, info) => {
            if (error) {
                console.log("Error occurred");
                console.log(error.message);
                return;
            }
            transporter.close();
        });
    }
}

export default new EmailService();
