const express = require('express');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
const {
  getAllStudents,
  updateStudent,
  deleteStudent,
  getAllResults,
  getStudentResults   // ✅ function to get results for a specific student
} = require('../controllers/adminController');

const router = express.Router();

// All routes below require authentication and admin role
router.use(auth);
router.use(role(['admin']));

// Routes
router.get('/students', getAllStudents);                      // Get all students
router.put('/students/:id', updateStudent);                    // Update student
router.delete('/students/:id', deleteStudent);                 // Delete student
router.get('/results', getAllResults);                         // Get all exam results
router.get('/students/:studentId/results', getStudentResults); // Get results for one student

module.exports = router;