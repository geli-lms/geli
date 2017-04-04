const AuthenticationController = require('./controllers/authentication'),
      express = require('express'),
      passportService = require('./config/passport'),
      passport = require('passport'),
      CourseController = require('./controllers/course');


// Middleware to require login/auth
const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });


module.exports = function(app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
        userRoutes = express.Router(),
        courseRoutes = express.Router();


  /*
  User Routes
   */
  apiRoutes.use('/user', userRoutes);
  userRoutes.post('/register', AuthenticationController.register);
  userRoutes.post('/login', requireLogin, AuthenticationController.login);


  /*
  *  Course Routes
  */
  apiRoutes.use('/courses', courseRoutes);
  courseRoutes.get('/', requireAuth, CourseController.getCourse);//requireAuth, AuthenticationController.roleAuthorization(['student','teacher','admin']), CourseController.getCourse);
  courseRoutes.get('/:courseid', requireAuth, CourseController.getCourse);//requireAuth, AuthenticationController.roleAuthorization(['student','teacher','admin']), CourseController.getCourse);
  courseRoutes.post('/', requireAuth, AuthenticationController.roleAuthorization(['teacher','admin']), CourseController.addCourse)
  courseRoutes.put('/:courseid', requireAuth, AuthenticationController.roleAuthorization(['teacher','admin']), CourseController.updateCourse);
  courseRoutes.put('/:courseid/enroll', requireAuth, AuthenticationController.roleAuthorization(['student', 'teacher','admin']), CourseController.enrollStudent);



  app.use('/api', apiRoutes);
};