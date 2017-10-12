# Development configuration

This guide will show some development specific configuration options. For a full list of all 
available options see [here](../configuration.md).


## E-mail

When you whish to use the mailing service while developing we recommend using the Debugmail.io 
service.

It acts as an dummy SMTP Server and in it's online "inbox" you see which Mails would have been 
submitted on an actual SMTP server.

A big advantage is that you dont have to use real (not even valid) addresses and it works just fine 
with our fixture users.

To do so just [sign-up](https://debugmail.io/sign-up), create a new project and pass the shown 
credentials to the API by overwriting the following environment variables:

    MAILPROVIDER=debugmail
    MAILUSER=yourUsername
    MAILPASS=someValidPassword

You don't have to explicitly set the mailprovider when using debugmail since it is the default 
setting.

If you dont wan't to use debugmail you can use any service compatible with the npm package 
[Nodemailer](https://nodemailer.com/) or just use plain SMTP and set the following variables:

    MAILSMTPSERVER=smtp.yourserver.domain
    MAILSMTPPORT=25
    MAILUSER=yourUsername
    MAILPASS=someValidPassword

Manual configuration of smtp server and port will overwrite the settings from mailprovider.
