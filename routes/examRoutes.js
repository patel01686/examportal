const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { createExam, addQuestion, getExams, deleteExam, updateExam } = require('../controllers/examController');

const router = express.Router();

// Apply authentication and admin role to all routes below
router.use(auth);
router.use(role(['admin']));

// Routes
router.post('/', createExam);               // Create exam
router.post('/:examId/questions', addQuestion); // Add question
router.get('/', getExams);                  // Get all exams
router.delete('/:examId', deleteExam);       // Delete exam
router.put('/:examId', updateExam);           // Update exam

module.exports = router;