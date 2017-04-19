import {authenticate} from "passport";

export default authenticate('local', { session: false });
