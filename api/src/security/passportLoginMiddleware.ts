import {authenticate} from 'passport';
import {cat} from 'shelljs';

export default function passportLoginMiddleware(req: any, res: any, next: (err: any) => any) {
  const username = req.body.email;
  const password = req.body.password;
  const authFunction = authenticate('local', {session: false});
  debugger;
  authFunction(req, res, (err: any) => {
    if (err) {
      if (!ldapAuthenticate(username, password)) {
        res.status(401).json(err); // set status and json body, does not get set automatically
        return next(err); // pass error to further error handling functions
      }
    }
    return next(null);
  });
}

export function ldapAuthenticate(username: string, password: string) {
  try {
    const ldap = require('ldapjs');

    const OPTS = {
      url: 'ldap://ldap-rr.fbi.h-da.de:389',
      searchBase: 'ou=people,ou=Students,dc=fbi,dc=h-da,dc=de',
      searchFilter: '(uid={{username}})'
    };
    const dn = 'cn=' + username;
    const client = ldap.createClien(OPTS);

    client.bind(dn, password, function (err: object) {
      client.unbind();
      if (err) {
        return false;
      } else {
        return true;
      }
    });
  } catch (Ex) {
    console.log(Ex);
  }
}
