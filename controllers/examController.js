const Exam = require('../models/Exam');
const Question = require('../models/Question');

// Create exam
exports.createExam = async (req, res) => {
  try {
    const { title, duration, totalQuestions, marksPerQuestion } = req.body;
    const exam = new Exam({ title, duration, totalQuestions, marksPerQuestion });
    await exam.save();
    res.status(201).json({ msg: 'Exam created', examId: exam._id });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Add question to exam
exports.addQuestion = async (req, res) => {
  try {
    const { examId } = req.params;
    const { question, optionA, optionB, optionC, optionD, correctAnswer } = req.body;
    const newQuestion = new Question({
      examId,
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer
    });
    await newQuestion.save();
    res.status(201).json({ msg: 'Question added' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all exams (for admin)
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find().select('-__v');
    res.json(exams);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete exam and its questions
exports.deleteExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findByIdAndDelete(examId);
    if (!exam) return res.status(404).json({ msg: 'Exam not found' });
    await Question.deleteMany({ examId });
    res.json({ msg: 'Exam and its questions deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update exam details
exports.updateExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { title, duration, totalQuestions, marksPerQuestion } = req.body;
    const exam = await Exam.findByIdAndUpdate(
      examId,
      { title, duration, totalQuestions, marksPerQuestion },
      { new: true }
    );
    if (!exam) return res.status(404).json({ msg: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};