const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Student = require('../src/models/Student');

const TEST_DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sms_test_student_db';

let adminToken;
let studentToken;
let createdStudentId;

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
  await User.deleteMany({});
  await Student.deleteMany({});

  // Create Admin
  const adminRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Admin Tester',
      email: 'admin_test@sms.com',
      password: 'password123',
      role: 'admin'
    });
  adminToken = adminRes.body.token;

  // Create Student
  const studentRes = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Student Tester',
      email: 'student_test@sms.com',
      password: 'password123',
      role: 'student'
    });
  studentToken = studentRes.body.token;
});

afterAll(async () => {
  await User.deleteMany({});
  await Student.deleteMany({});
  await mongoose.connection.close();
});

describe('Student Management API', () => {
  describe('POST /api/students (Add a student)', () => {
    it('should reject request when unauthenticated', async () => {
      const res = await request(app)
        .post('/api/students')
        .send({
          name: 'Unauthorized Student',
          email: 'unauth@sms.com',
          age: 20,
          marks: 85,
          city: 'Mumbai',
          department: 'Computer Science'
        });

      expect(res.statusCode).toBe(401);
    });

    it('should FORBID student role from creating a student record (RBAC check)', async () => {
      const res = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          name: 'Forbidden Student',
          email: 'forbidden@sms.com',
          age: 20,
          marks: 85,
          city: 'Mumbai',
          department: 'Computer Science'
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Forbidden');
    });

    it('should allow Admin to successfully create a new student record', async () => {
      const res = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Alice Johnson',
          email: 'alice@sms.com',
          age: 21,
          marks: 92,
          city: 'Boston',
          department: 'Computer Science'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        name: 'Alice Johnson',
        email: 'alice@sms.com',
        age: 21,
        marks: 92,
        city: 'Boston',
        department: 'Computer Science'
      });
      createdStudentId = res.body.data._id;
    });

    it('should reject duplicate email when creating a student', async () => {
      const res = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Alice Duplicate',
          email: 'alice@sms.com',
          age: 22,
          marks: 75,
          city: 'New York',
          department: 'Physics'
        });

      expect(res.statusCode).toBe(409);
    });

    it('should reject creation if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Missing Fields'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/students and GET /api/students/:id', () => {
    beforeAll(async () => {
      // Seed a dataset for filtering, sorting and pagination tests
      await Student.deleteMany({});
      const seedStudents = [
        { name: 'John Doe', email: 'john@sms.com', age: 19, marks: 60, city: 'Chicago', department: 'Arts' },
        { name: 'Mary Smith', email: 'mary@sms.com', age: 20, marks: 95, city: 'New York', department: 'Engineering' },
        { name: 'Bob Wilson', email: 'bob@sms.com', age: 22, marks: 78, city: 'Chicago', department: 'Engineering' },
        { name: 'Sarah Lee', email: 'sarah@sms.com', age: 23, marks: 88, city: 'San Francisco', department: 'Business' },
        { name: 'David Kim', email: 'david@sms.com', age: 25, marks: 50, city: 'Seattle', department: 'Arts' }
      ];

      for (const s of seedStudents) {
        await request(app)
          .post('/api/students')
          .set('Authorization', `Bearer ${adminToken}`)
          .send(s);
      }
    });

    it('should allow Student role to view all students', async () => {
      const res = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(5);
    });

    it('should find students by city (e.g. Chicago)', async () => {
      const res = await request(app)
        .get('/api/students?city=Chicago')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data.every((s) => s.city.toLowerCase() === 'chicago')).toBe(true);
    });

    it('should find students by department (e.g. Engineering)', async () => {
      const res = await request(app)
        .get('/api/students?department=Engineering')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data.every((s) => s.department === 'Engineering')).toBe(true);
    });

    it('should retrieve students whose marks are greater than a specified value (marks > 75)', async () => {
      const res = await request(app)
        .get('/api/students?marksGreaterThan=75')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(3); // 78, 88, 95
      expect(res.body.data.every((s) => s.marks > 75)).toBe(true);
    });

    it('should find students within a given age range (20 to 23)', async () => {
      const res = await request(app)
        .get('/api/students?minAge=20&maxAge=23')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.data.length).toBe(3); // 20, 22, 23
      expect(res.body.data.every((s) => s.age >= 20 && s.age <= 23)).toBe(true);
    });

    it('should sort students by marks in descending order', async () => {
      const res = await request(app)
        .get('/api/students?sortBy=marks&order=desc')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      const marksList = res.body.data.map((s) => s.marks);
      expect(marksList).toEqual([95, 88, 78, 60, 50]);
    });

    it('should sort students by marks in ascending order', async () => {
      const res = await request(app)
        .get('/api/students?sortBy=marks&order=asc')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      const marksList = res.body.data.map((s) => s.marks);
      expect(marksList).toEqual([50, 60, 78, 88, 95]);
    });

    it('should implement pagination with page and limit parameters', async () => {
      const res = await request(app)
        .get('/api/students?page=1&limit=2')
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.currentPage).toBe(1);
      expect(res.body.limit).toBe(2);
      expect(res.body.totalStudents).toBe(5);
      expect(res.body.totalPages).toBe(3);
      expect(res.body.data.length).toBe(2);
    });

    it('should retrieve individual student details by ID', async () => {
      const allRes = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${studentToken}`);
      const studentId = allRes.body.data[0]._id;

      const singleRes = await request(app)
        .get(`/api/students/${studentId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(singleRes.statusCode).toBe(200);
      expect(singleRes.body.data._id).toBe(studentId);
    });

    it('should return 404 for non-existent student ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/students/${nonExistentId}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(404);
    });
  });

  describe('PUT /api/students/:id (Update student)', () => {
    let studentToUpdate;

    beforeAll(async () => {
      const student = await Student.findOne();
      studentToUpdate = student._id.toString();
    });

    it('should FORBID student role from updating records (RBAC check)', async () => {
      const res = await request(app)
        .put(`/api/students/${studentToUpdate}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({ marks: 100 });

      expect(res.statusCode).toBe(403);
    });

    it('should allow Admin to update student information', async () => {
      const res = await request(app)
        .put(`/api/students/${studentToUpdate}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Name',
          marks: 99
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Updated Name');
      expect(res.body.data.marks).toBe(99);
    });
  });

  describe('DELETE /api/students/:id (Delete student)', () => {
    let studentToDelete;

    beforeAll(async () => {
      const student = await Student.findOne();
      studentToDelete = student._id.toString();
    });

    it('should FORBID student role from deleting records (RBAC check)', async () => {
      const res = await request(app)
        .delete(`/api/students/${studentToDelete}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(403);
    });

    it('should allow Admin to delete a student record', async () => {
      const res = await request(app)
        .delete(`/api/students/${studentToDelete}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify it's actually removed
      const checkRes = await request(app)
        .get(`/api/students/${studentToDelete}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(checkRes.statusCode).toBe(404);
    });
  });
});
