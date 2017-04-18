const Course = require('../models/course');


exports.getCourse = function (req, res) {

  var courseId = req.params.courseid;

  if (courseId) {
    Course.findOne({'_id': courseId}).exec(function (err, courses) {
      if (err) {
        res.send(err)
      }
      res.json(courses);
    });
  } else {

    Course.find({}).exec(function (err, courses) {
      if (err) {
        res.send(err)
      }
      res.json(courses);
    });
  }
};

exports.addCourse = function (req, res) {
  console.log(req);
  var newCourse = new Course({
    name: req.body.name,
    description: req.body.description,
    courseAdmin: req.user
  });

  newCourse.save(function (err, test) {
    if (err) console.log(err);
    else res.json(test);
  })
}


exports.updateCourse = function (req, res) {
  console.log('update course');

  Course.findByIdAndUpdate(req.body._id, req.body, { new: true }, function (err, course) {
    if (err) return handleError(err);
    res.send(course);
  });

}

exports.addLecture = function (req, res) {
  Course.findById(req.body._id, function (err, course) {
    console.log(course);

  })
  res.send('try adding...');
}

exports.enrollStudent = function (req, res) {
  console.log(req.user);
  Course.findById(req.body._id, function (err, course) {
    console.log(course);
  })
}