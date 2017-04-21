import {authenticate} from 'passport';

export default authenticate('jwt', { session: false });
