import {IUser} from '../../../shared/models/IUser';
import {sign} from 'jsonwebtoken';
import config from '../config/main';

export class JwtUtils {
  static generateToken(user: IUser, isMediaToken: boolean = false) {
    const data: any = {_id: user._id.toString()};
    if (isMediaToken) {
      // This isMediaToken property signifies that the token is only meant for media access, i.e. for images, videos, PDFs and so on.
      // In the rest of the codebase (API back-end & App front-end) the special token with this property is called the mediaToken.
      // It is explicitly NOT valid for any regular user operations, like viewing pages (that require the user to be logged-in).
      // Thus, in combination with randomized unguessable filenames, URLs that have a mediaToken attached are technically sharable.
      // Since the token will also expire eventually, any accidental leak of an URL with mediaToken should be contained automatically.
      // (Unless the affected files are replicated and distributed by other means prior to the expiration of course.)
      data.isMediaToken = true;
    }
    return sign(
      data,
      config.secret,
      {
        expiresIn: 10080 // in seconds
      }
    );
  }
}
