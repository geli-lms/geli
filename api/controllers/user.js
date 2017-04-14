/**
 * Created by Steffen on 14.04.2017.
 */
const User = require('../models/user');

exports.getUser = function (req, res) {
  var userId = req.params.userid;

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
}