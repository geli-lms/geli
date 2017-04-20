
exports.getUser = function (req, res) {
  let userId = req.params.userid;

  if(userId) {
    User.findOne({'_id': userId}).exec(function (err, users) {
      if(err) {
        res.send(err);
      }
      res.json(users);
    });
  }
  else {
    User.find({}).exec(function (err, users) {
      if(err) {
        res.send(err);
      }
      res.json(users);
    });
  }
};

exports.getRoles = function (req, res) {
  res.json(User.schema.path('role').enumValues);
};

exports.updateUser = function (req, res) {
  User.find({'role': 'admin'}).exec(function (err, users) {
    if(err) {
      res.send(err);
    }

    if(users.length === 1) {
      return res.status(400).send('There are no other accounts with admin privileges.');
    }
    else {
      User.findByIdAndUpdate(req.body._id, req.body, { new: true }, function (err, user) {
        if (err) {
          return handleError(err);
        }
        res.send(user);
      });
    }
  });
};
