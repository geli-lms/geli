import {ExtractJwt, JwtFromRequestFunction, Strategy as JwtStrategy, StrategyOptions, VerifiedCallback} from 'passport-jwt';
import {UnauthorizedError} from 'routing-controllers';
import config from '../config/main';
import {errorCodes} from '../config/errorCodes';
import {User} from '../models/User';
import * as cookie from 'cookie';

interface PassportJwtStrategyFactoryOptions {
  name?: String;
  forbidMediaTokens?: Boolean;
  extractJwtFromCookie?: Boolean;
  extractJwtFromAuthHeaderWithScheme?: Boolean;
  extractJwtFromUrlQueryParameter?: Boolean;
}

function passportJwtStrategyFactory({
  name = 'jwt',
  forbidMediaTokens = true,
  extractJwtFromCookie = true,
  extractJwtFromAuthHeaderWithScheme = true,
  extractJwtFromUrlQueryParameter = false,
}: PassportJwtStrategyFactoryOptions = {}) {
  const jwtFromRequestLayers: JwtFromRequestFunction[] = [];
  if (extractJwtFromCookie) {
    // ATM this is the only usage of the 'cookie' package, we could write specialized code alternatively.
    jwtFromRequestLayers.push((req) =>
      req &&
      typeof req.headers.cookie === 'string' &&
      cookie.parse(req.headers.cookie).token
    );
  }
  if (extractJwtFromAuthHeaderWithScheme) {
    // Telling Passport to check authorization headers for JWT
    // TODO: Replace with bearer method to be compliant to RFC 6750
    jwtFromRequestLayers.push(ExtractJwt.fromAuthHeaderWithScheme('jwt'));
  }
  if (extractJwtFromUrlQueryParameter) {
    jwtFromRequestLayers.push(ExtractJwt.fromUrlQueryParameter('jwt'));
  }
  const jwtFromRequest: JwtFromRequestFunction = (request) => {
    let token = null;
    for (const layer of jwtFromRequestLayers) {
      token = layer(request);
      if (token) {
        break;
      }
    }
    return token;
  };

  const opts: StrategyOptions = {
    jwtFromRequest,
    secretOrKey: config.secret  // Telling Passport where to find the secret
  };
  const verify: VerifiedCallback = async (payload, done) => {
    if (forbidMediaTokens && payload.isMediaToken) {
      done(new UnauthorizedError(errorCodes.misc.mediaTokenInsufficient.code), false);
    }
    try {
      if (await User.findById(payload._id)) {
        done(null, {tokenPayload: payload});
      } else {
        done(null, false);
      }
    } catch (error) {
      done(error);
    }
  };

  const jwtStrategy = new JwtStrategy(opts, verify);
  (jwtStrategy as any).name =
      name;  // Set the name property which is used by passport.
  return jwtStrategy;
}

export default passportJwtStrategyFactory;
