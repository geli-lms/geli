import passportJwtMiddlewareFactory from './passportJwtMiddlewareFactory';

// This middleware uses the mediaToken via the 'jwtMedia' strategy.
// See JwtUtils.ts (generateToken function) for a description of the mediaToken's purpose.
export default passportJwtMiddlewareFactory('jwtMedia');
