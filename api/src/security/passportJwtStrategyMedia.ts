import passportJwtStrategyFactory from './passportJwtStrategyFactory';

// This strategy uses the mediaToken.
// See JwtUtils.ts (generateToken function) for a description of the mediaToken's purpose.
export default passportJwtStrategyFactory({name: 'jwtMedia', forbidMediaTokens: false, extractJwtFromUrlQueryParameter: true});
