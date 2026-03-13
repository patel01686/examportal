const User = require('../models/User');
const Result = require('../models/Result');
const Exam = require('../models/Exam');

// Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-password');
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    const student = await User.findByIdAndUpdate(id, { name, email }, { new: true }).select('-password');
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await User.findByIdAndDelete(id);
    if (!student) return res.status(404).json({ msg: 'Student not found' });
    // Optionally delete their results
    await Result.deleteMany({ studentId: id });
    res.json({ msg: 'Student deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get all results with populated student and exam
exports.getAllResults = async (req, res) => {
  try {
    const results = await Result.find()
      .populate('studentId', 'name email')
      .populate('examId', 'title')
      .sort('-createdAt');
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get results for a specific student
exports.getStudentResults = async (req, res) => {
  try {
    const { studentId } = req.params;
    const results = await Result.find({ studentId })
      .populate('examId', 'title')
      .sort('-createdAt');
    res.json(results);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};