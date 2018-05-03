import 'reflect-metadata';
import {createExpressServer} from 'routing-controllers';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import * as winston from 'winston';
import * as passport from 'passport';
import {Express} from 'express';
import * as Raven from 'raven';
import config from './config/main';
import passportLoginStrategy from './security/passportLoginStrategy';
import passportJwtStrategy from './security/passportJwtStrategy';
import {RoleAuthorization} from './security/RoleAuthorization';
import {CurrentUserDecorator} from './security/CurrentUserDecorator';
import './utilities/FilterErrorHandler';
import ChatServer from './Chatserver';

if (config.sentryDsn) {
  Raven.config(config.sentryDsn, {
    environment: 'api',
    release: '$TRAVIS_COMMIT',
  }).install();
}

/**
 * Root class of your node server.
 * Can be used for basic configurations, for instance starting up the server or registering middleware.
 */
export class Server {

  public app: Express;

  static setupPassport() {
    passport.use(passportLoginStrategy);
    passport.use(passportJwtStrategy);
  }

  constructor() {
    // Do not use mpromise
    (<any>mongoose).Promise = global.Promise;

    // mongoose.set('debug', true);

    this.app = createExpressServer({
      routePrefix: '/api',
      controllers: [__dirname + '/controllers/*.js'], // register all controller's routes
      authorizationChecker: RoleAuthorization.checkAuthorization,
      currentUserChecker: CurrentUserDecorator.checkCurrentUser,
    });

    if (config.sentryDsn) {
      // The request handler must be the first middleware on the app
      this.app.use(Raven.requestHandler());
      // The error handler must be before any other error middleware
      this.app.use(Raven.errorHandler());
    }

    // TODO: Needs authentication in the future
    this.app.use('/api/uploads', express.static('uploads'));

    Server.setupPassport();
    this.app.use(passport.initialize());
  }

  start() {
    mongoose.connect(config.database);

    // Request logger
    this.app.use(morgan('combined'));

    const server = this.app.listen(config.port, () => {
      winston.log('info', '--> Server successfully started at port %d', config.port);
    });

    const chatServer = new ChatServer(server);
    chatServer.init();
  }
}

/**
 * For testing mocha will start express itself
 */
if (process.env.NODE_ENV !== 'test') {
  new Server().start();
}
