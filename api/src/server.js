"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const routing_controllers_1 = require("routing-controllers");
const mongoose = require("mongoose");
const morgan = require("morgan");
const winston = require("winston");
const passport = require("passport");
const main_1 = require("./config/main");
const passportLoginStrategy_1 = require("./security/passportLoginStrategy");
const passportJwtStrategy_1 = require("./security/passportJwtStrategy");
/**
 * Root class of your node server.
 * Can be used for basic configurations, for instance starting up the server or registering middleware.
 */
class Server {
    static setupPassport() {
        passport.use(passportLoginStrategy_1.default);
        passport.use(passportJwtStrategy_1.default);
    }
    constructor() {
        // Do not use mpromise
        mongoose.Promise = global.Promise;
        mongoose.connect(main_1.default.database);
        this.app = routing_controllers_1.createExpressServer({
            routePrefix: '/api',
            controllers: [__dirname + '/controllers/*.js'] // register all controller's routes
        });
        // Request logger
        this.app.use(morgan('combined'));
        Server.setupPassport();
        this.app.use(passport.initialize());
        this.app.listen(main_1.default.port, () => {
            winston.log('info', '--> Server successfully started at port %d', main_1.default.port);
        });
    }
}
exports.Server = Server;
new Server();
