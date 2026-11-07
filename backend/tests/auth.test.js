const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

const TEST_DB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sms_test_auth_db';

beforeAll(async () => {
  await mongoose.connect(TEST_DB_URI);
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});

describe('POST /api/auth/register', () => {
  it('should successfully register a student user by default', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jane Doe',
        email: 'jane@sms.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({
      name: 'Jane Doe',
      email: 'jane@sms.com',
      role: 'student'
    });
    expect(res.body.user).not.toHaveProperty('password');
  });

  it('should register an admin user when role is specified as admin', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'superadmin@sms.com',
        password: 'adminpassword123',
        role: 'admin'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('admin');
  });

  it('should reject registration if email is already taken', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Existing User',
        email: 'duplicate@sms.com',
        password: 'password123'
      });

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another User',
        email: 'duplicate@sms.com',
        password: 'password456'
      });

    expect(res.statusCode).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should fail if required fields are missing', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Incomplete'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Login Tester',
        email: 'login@sms.com',
        password: 'correctpassword'
      });
  });

  it('should log in successfully with correct credentials and return JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@sms.com',
        password: 'correctpassword'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('login@sms.com');
  });

  it('should return 401 for incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@sms.com',
        password: 'wrongpassword'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 401 for non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nobody@sms.com',
        password: 'password123'
      });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('should return 400 if email or password is missing', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'login@sms.com'
      });

    expect(res.statusCode).toBe(400);
  });
});
