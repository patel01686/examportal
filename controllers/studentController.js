const Exam = require('../models/Exam');
const Question = require('../models/Question');
const Result = require('../models/Result');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// 📌 Get all available exams
exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find().select('title duration totalQuestions marksPerQuestion password');
    res.json(exams);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// 📌 Start exam – returns exam details + all questions (no answers)
exports.startExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ msg: 'Exam not found' });

    const questions = await Question.find({ examId }).select('-correctAnswer');
    res.json({ exam, questions });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// 📌 Verify exam password
exports.verifyExamPassword = async (req, res) => {
  try {
    const { examId } = req.params;
    const { password } = req.body;
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ msg: 'Exam not found' });

    // If password is set, check it
    if (exam.password && exam.password !== password) {
      return res.status(401).json({ msg: 'Invalid password' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// 📌 Submit exam – expects answers array: [{ questionId, selected }]
exports.submitExam = async (req, res) => {
  try {
    const { examId } = req.params;
    const { answers } = req.body;
    const studentId = req.user.userId;

    const exam = await Exam.findById(examId);
    const questions = await Question.find({ examId });

    let correct = 0, wrong = 0, skipped = 0;
    const detailedAnswers = [];

    // Build a map of correct answers
    const correctMap = {};
    questions.forEach(q => { correctMap[q._id] = q.correctAnswer; });

    answers.forEach(ans => {
      const question = questions.find(q => q._id.toString() === ans.questionId);
      if (!question) return;

      const selected = ans.selected || 'skip';
      const isCorrect = (selected === correctMap[ans.questionId]);

      if (selected === 'skip') {
        skipped++;
      } else if (isCorrect) {
        correct++;
      } else {
        wrong++;
      }

      detailedAnswers.push({
        question: question.question,
        selected: selected,
        correct: correctMap[ans.questionId],
        options: {
          A: question.optionA,
          B: question.optionB,
          C: question.optionC,
          D: question.optionD
        }
      });
    });

    const totalQuestions = questions.length;
    const score = (correct / totalQuestions) * 100;

    const result = new Result({
      studentId,
      examId,
      correct,
      wrong,
      skipped,
      score,
      answers: detailedAnswers
    });
    await result.save();

    res.json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// 📌 Get result by examId
exports.getResult = async (req, res) => {
  try {
    const { examId } = req.params;
    const studentId = req.user.userId;
    const result = await Result.findOne({ studentId, examId });
    if (!result) return res.status(404).json({ msg: 'Result not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// 📌 Get exam review (detailed answers)
exports.getExamReview = async (req, res) => {
  try {
    const { examId } = req.params;
    const studentId = req.user.userId;

    const result = await Result.findOne({ studentId, examId });
    if (!result) return res.status(404).json({ msg: 'Result not found' });

    res.json({ answers: result.answers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// 📌 Get student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user.userId).select('-password');
    res.json(student);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// 📌 Update student profile (name and password)
exports.updateProfile = async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const student = await User.findById(req.user.userId);
    if (!student) return res.status(404).json({ msg: 'User not found' });

    if (name) student.name = name;

    if (currentPassword && newPassword) {
      const isMatch = await student.comparePassword(currentPassword);
      if (!isMatch) return res.status(400).json({ msg: 'Current password is incorrect' });
      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash(newPassword, salt);
    }

    await student.save();
    res.json({ msg: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// 📌 Get student exam history
exports.getHistory = async (req, res) => {
  try {
    const results = await Result.find({ studentId: req.user.userId })
      .populate('examId', 'title')
      .sort('-createdAt');
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};