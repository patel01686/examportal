const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const { 
  getExams, 
  startExam, 
  submitExam, 
  getResult,
  getExamReview,
  verifyExamPassword,   // 👈 Add this line
  getProfile,
  updateProfile,
  getHistory
} = require('../controllers/studentController');

const router = express.Router();

router.use(auth);
router.use(role(['student']));

router.get('/exams', getExams);
router.get('/exam/:examId/start', startExam);
router.post('/exam/:examId/submit', submitExam);
router.get('/result/:examId', getResult);
router.get('/exam/:examId/review', getExamReview);
router.post('/exam/:examId/verify-password', verifyExamPassword);  // 👈 This line now works
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/history', getHistory);

module.exports = router;