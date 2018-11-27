import 'reflect-metadata';
import {createExpressServer} from 'routing-controllers';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as morgan from 'morgan';
import * as passport from 'passport';
import {Express} from 'express';
import * as Raven from 'raven';
import config from './config/main';
import passportLoginStrategy from './security/passportLoginStrategy';
import passportJwtStrategy from './security/passportJwtStrategy';
import passportJwtMiddleware from './security/passportJwtMiddleware';
import {RoleAuthorization} from './security/RoleAuthorization';
import {CurrentUserDecorator} from './security/CurrentUserDecorator';
import './utilities/FilterErrorHandler';
import ChatServer from './ChatServer';

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
    mongoose.set('useCreateIndex', true);

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

    Server.setupPassport();
    this.app.use(passport.initialize());

    // Requires authentication via the passportJwtMiddleware to accesss the static config.uploadFolder (e.g. for images).
    // That means this is not meant for truly public files accessible without login!
    this.app.use('/api/uploads', passportJwtMiddleware, express.static(config.uploadFolder));
  }

  start() {
    mongoose.connect(config.database, {useNewUrlParser: true});

    this.app.use(morgan('combined'));

    const server = this.app.listen(config.port, () => {
      process.stdout.write('Server successfully started at port ' + config.port);
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
