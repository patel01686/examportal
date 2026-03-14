const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: Number, required: true }, // minutes
  totalQuestions: { type: Number, required: true },
  marksPerQuestion: { type: Number, required: true },
  password: { type: String, default: null }
});

module.exports = mongoose.model('Exam', examSchema);