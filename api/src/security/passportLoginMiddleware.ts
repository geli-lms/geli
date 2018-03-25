import {authenticate} from 'passport';

export default function passportLoginMiddleware(req: any, res: any, next: (err: any) => any) {
  const authFunction = authenticate('local', { session: false });
  authFunction(req, res, (err: any) => {
    if (err) {
      res.status(401).json(err); // set status and json body, does not get set automatically
      return next(err); // pass error to further error handling functions
    }
    return next(null);
  });
}
