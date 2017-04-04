const mongoose = require('mongoose'),
      Schema = mongoose.Schema;

//================================
// User Schema
//================================
const UnitSchema = new Schema({
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    children: {
      type: String,
      required: true
    },
    media: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model('Unit', UnitSchema);
