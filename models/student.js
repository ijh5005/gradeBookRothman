const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  name: { type: String, required: true },
  testscore1: { type: String },
  testscore2: { type: String },
  testscore3: { type: String },
  img: { type: String },
  date: { type: Date, default: Date.now() }
})

module.exports = student = mongoose.model('students', StudentSchema);
