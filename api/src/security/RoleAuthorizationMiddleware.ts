// import {Middleware, MiddlewareInterface} from "routing-controllers";
// import {User} from "../models/User"
//
// @Middleware()
// export class RoleAuthorizationMiddleware implements MiddlewareInterface {
//
//     use(req: any, res: any, next?: (err?: any) => any): any {
//         const user = req.user;
//
//         User.findById(user.courseId, function(err, foundUser) {
//             if (err) {
//                 res.status(422).json({ error: 'No user was found.' });
//                 return next(err);
//             }
//
//             // If user is found, check role.
//             if ( roles.indexOf(foundUser.role) != -1 ) {
//                 return next();
//             }
//
//             res.status(401).json({ error: 'You are not authorized to view this content.' });
//             return next('Unauthorized request');
//         })
//     }
//
// }
