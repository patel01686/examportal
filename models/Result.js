const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  correct: { type: Number, default: 0 },
  wrong: { type: Number, default: 0 },
  skipped: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
  answers: [{
    question: { type: String, required: true },
    selected: { type: String, enum: ['A', 'B', 'C', 'D', 'skip'], required: true },
    correct: { type: String, enum: ['A', 'B', 'C', 'D'], required: true },
    options: {
      A: String,
      B: String,
      C: String,
      D: String
    }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', resultSchema);