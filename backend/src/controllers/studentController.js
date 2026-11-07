const Student = require('../models/Student');

/**
 * @desc    Create a new student record
 * @route   POST /api/students
 * @access  Private (Admin only)
 */
const createStudent = async (req, res, next) => {
  try {
    const { name, email, age, marks, city, department, roll, phone, dateOfBirth } = req.body;

    if (!name || !email || age === undefined || marks === undefined || !city || !department) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, email, age, marks, city, and department'
      });
    }

    // Check if a student with the email already exists
    const existing = await Student.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A student with this email already exists'
      });
    }

    const student = await Student.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      age: Number(age),
      marks: Number(marks),
      city: city.trim(),
      department: department.trim(),
      roll: roll ? roll.trim() : undefined,
      phone: phone ? phone.trim() : undefined,
      dateOfBirth: dateOfBirth ? dateOfBirth.trim() : undefined,
      createdBy: req.user ? req.user._id : undefined
    });

    return res.status(201).json({
      success: true,
      message: 'Student record created successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all students with search, filter, sort, and pagination
 * @route   GET /api/students
 * @access  Private (Admin & Student)
 */
const getStudents = async (req, res, next) => {
  try {
    const {
      city,
      department,
      minMarks,
      marksGreaterThan,
      minAge,
      maxAge,
      sortBy,
      order,
      sort,
      search,
      page = 1,
      limit = 10
    } = req.query;

    const query = {};

    // 1. Search by general keyword (name, email, city, department)
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { city: searchRegex },
        { department: searchRegex }
      ];
    }

    // 2. Filter by City (case-insensitive)
    if (city && city.trim() !== '') {
      query.city = new RegExp(`^${city.trim()}$`, 'i');
    }

    // 3. Filter by Department (case-insensitive)
    if (department && department.trim() !== '') {
      query.department = new RegExp(`^${department.trim()}$`, 'i');
    }

    // 4. Retrieve students whose marks are greater than a specified value
    const thresholdMarks = marksGreaterThan !== undefined ? marksGreaterThan : minMarks;
    if (thresholdMarks !== undefined && thresholdMarks !== '') {
      const parsedMarks = Number(thresholdMarks);
      if (!isNaN(parsedMarks)) {
        // "greater than a specified value" -> marks > thresholdMarks
        query.marks = { ...(query.marks || {}), $gt: parsedMarks };
      }
    }

    // 5. Find students within a given age range
    if (minAge !== undefined && minAge !== '') {
      const parsedMinAge = Number(minAge);
      if (!isNaN(parsedMinAge)) {
        query.age = { ...(query.age || {}), $gte: parsedMinAge };
      }
    }
    if (maxAge !== undefined && maxAge !== '') {
      const parsedMaxAge = Number(maxAge);
      if (!isNaN(parsedMaxAge)) {
        query.age = { ...(query.age || {}), $lte: parsedMaxAge };
      }
    }

    // 6. Sorting: Sort students by marks in ascending or descending order
    let sortOptions = { createdAt: -1 }; // default fallback

    if (sortBy === 'marks' || sort === 'marks' || sort === '-marks') {
      const isDesc = order === 'desc' || sort === '-marks';
      sortOptions = { marks: isDesc ? -1 : 1 };
    } else if (sortBy) {
      const isDesc = order === 'desc';
      sortOptions = { [sortBy]: isDesc ? -1 : 1 };
    }

    // 7. Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const totalStudents = await Student.countDocuments(query);
    const totalPages = Math.ceil(totalStudents / limitNum) || 1;

    const students = await Student.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      success: true,
      count: students.length,
      totalStudents,
      totalPages,
      currentPage: pageNum,
      limit: limitNum,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single student details by ID
 * @route   GET /api/students/:id
 * @access  Private (Admin & Student)
 */
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID ${req.params.id}`
      });
    }

    return res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a student record
 * @route   PUT /api/students/:id
 * @access  Private (Admin only)
 */
const updateStudent = async (req, res, next) => {
  try {
    const { name, email, age, marks, city, department, roll, phone, dateOfBirth } = req.body;

    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID ${req.params.id}`
      });
    }

    // If email is changing, check uniqueness
    if (email && email.toLowerCase().trim() !== student.email) {
      const existing = await Student.findOne({ email: email.toLowerCase().trim() });
      if (existing && existing._id.toString() !== req.params.id) {
        return res.status(409).json({
          success: false,
          message: 'Another student already has this email address'
        });
      }
    }

    const updateFields = {};
    if (name !== undefined) updateFields.name = name.trim();
    if (email !== undefined) updateFields.email = email.toLowerCase().trim();
    if (age !== undefined) updateFields.age = Number(age);
    if (marks !== undefined) updateFields.marks = Number(marks);
    if (city !== undefined) updateFields.city = city.trim();
    if (department !== undefined) updateFields.department = department.trim();
    if (roll !== undefined) updateFields.roll = roll.trim();
    if (phone !== undefined) updateFields.phone = phone.trim();
    if (dateOfBirth !== undefined) updateFields.dateOfBirth = dateOfBirth.trim();

    student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Student record updated successfully',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a student record
 * @route   DELETE /api/students/:id
 * @access  Private (Admin only)
 */
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID ${req.params.id}`
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Student record deleted successfully',
      id: req.params.id
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};
