const mongoose = require('mongoose'),
  Unit = require('./unit'),
  Schema = mongoose.Schema;

//================================
// User Schema
//================================
const LectureSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    units:  [
      {
        type: Schema.Types.ObjectId,
        ref: Unit
      }
    ]
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model('Lecture', LectureSchema);
