const express = require('express');
const router = express.Router();
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

// All student routes require valid JWT authentication
router.use(protect);

// Read routes: Accessible to both Admin and Student
router.get('/', getStudents);
router.get('/:id', getStudentById);

// Write routes: Accessible to Admin only
router.post('/', authorize('admin'), createStudent);
router.put('/:id', authorize('admin'), updateStudent);
router.delete('/:id', authorize('admin'), deleteStudent);

module.exports = router;
