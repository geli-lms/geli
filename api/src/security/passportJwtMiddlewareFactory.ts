import {authenticate} from 'passport';

export default (strategy: string | string[]) => authenticate(strategy, { session: false, assignProperty: 'jwtData' });
