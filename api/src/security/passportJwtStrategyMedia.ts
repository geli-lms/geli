import passportJwtStrategyFactory from './passportJwtStrategyFactory';

export default passportJwtStrategyFactory({name: 'jwtMedia', forbidMediaTokens: false, extractJwtFromUrlQueryParameter: true});
