const mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  User = require('./user'),
  Lecture = require('./lecture');
//================================
// User Schema
//================================
const CourseSchema = new Schema({
    name: {
      type: String,
      unique: true,
      required: true
    },
    active: {
      type: Boolean
    },
    description: {
      type: String
    },
    courseAdmin: [
      {
        type: Schema.Types.ObjectId,
        ref: User
      }
    ],
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: User
      }
    ],
    lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: Lecture
      }
    ],
  }, {
    timestamps: true
  }
);

module.exports = mongoose.model('Course', CourseSchema);
