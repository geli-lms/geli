# Configuration

## API

The API can be configured using the following environment variables.

| Variable | Description | Example value |
| --- | --- | --- |
| `BASEURL` | The URL you are hosting the web frontend at. This is used inside of e-mails. | `https://geli.fbi.h-da.de` |
| `DB_HOST` | The host your MongoDB instance is running on | `localhost` |
| `DB_PORT` | The port your MongoDB instance is listening on | `27017` |
| `MAILPROVIDER` | Use this when you are not using SMTP. Available providers are listed [here](https://nodemailer.com/smtp/well-known/)  | `DebugMail` |
| `MAILSMTPSERVER` | The host your SMTP server is running on | `localhost` |
| `MAILSMTPPORT` | The port your SMTP server is listening on | `25` |
| `MAILUSER` | The username for your e-mail service | - |
| `MAILPASS` | The password for your e-mail service | - |
| `MAILSENDER` | The sender e-mail address the API should use | `no-reply@geli.edu` |
| `PORT` | The port the API instance should listen on | `80` |
| `SECRET` | Secret key for JWT signing and encryption | - |
| `TEACHER_MAIL_REGEX` | Regular expression that has to match for people registering for *teacher* role | `@h-da.de$` |

Variables that might be missing from this documentation can be found [here](../api/src/config/main.ts).
