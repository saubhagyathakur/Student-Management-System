const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Student = require('../models/Student');

dotenv.config();

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/student_management_db';
    await mongoose.connect(uri);
    console.log('[Seed] Connected to MongoDB for database seeding...');

    // Clear existing collections if desired
    await User.deleteMany({});
    await Student.deleteMany({});
    console.log('[Seed] Cleared existing Users and Students');

    // 1. Create Default Users (Admin and Student)
    const adminUser = await User.create({
      name: 'System Administrator',
      email: 'admin@sms.com',
      password: 'password123',
      role: 'admin'
    });

    const studentUser = await User.create({
      name: 'John Student',
      email: 'student@sms.com',
      password: 'password123',
      role: 'student'
    });

    console.log('[Seed] Created default users:');
    console.log('       Admin: admin@sms.com / password123');
    console.log('       Student: student@sms.com / password123');

    // 2. Create Initial Students (modeled after the screenshot and specs)
    const sampleStudents = [
      {
        name: 'Arman Khan',
        email: 'arman.khan@sms.edu',
        age: 20,
        marks: 88,
        city: 'Mumbai',
        department: 'Computer Science',
        roll: 'CS-101',
        phone: '+91 9876543210',
        dateOfBirth: '2004-05-12',
        createdBy: adminUser._id
      },
      {
        name: 'Avani Sharma',
        email: 'avani.sharma@sms.edu',
        age: 21,
        marks: 94,
        city: 'Delhi',
        department: 'Information Technology',
        roll: 'IT-102',
        phone: '+91 9812345678',
        dateOfBirth: '2003-08-20',
        createdBy: adminUser._id
      },
      {
        name: 'Ajay Verma',
        email: 'ajay.verma@sms.edu',
        age: 19,
        marks: 76,
        city: 'Bangalore',
        department: 'Electronics',
        roll: 'EC-103',
        phone: '+91 9711223344',
        dateOfBirth: '2005-02-14',
        createdBy: adminUser._id
      },
      {
        name: 'Ajeet Singh',
        email: 'ajeet.singh@sms.edu',
        age: 22,
        marks: 65,
        city: 'Pune',
        department: 'Mechanical',
        roll: 'ME-104',
        phone: '+91 9654321987',
        dateOfBirth: '2002-11-05',
        createdBy: adminUser._id
      },
      {
        name: 'Alok Gupta',
        email: 'alok.gupta@sms.edu',
        age: 20,
        marks: 82,
        city: 'Delhi',
        department: 'Computer Science',
        roll: 'CS-105',
        phone: '+91 9543216789',
        dateOfBirth: '2004-03-30',
        createdBy: adminUser._id
      },
      {
        name: 'Aman Patel',
        email: 'aman.patel@sms.edu',
        age: 21,
        marks: 91,
        city: 'Ahmedabad',
        department: 'Information Technology',
        roll: 'IT-106',
        phone: '+91 9432109876',
        dateOfBirth: '2003-07-18',
        createdBy: adminUser._id
      },
      {
        name: 'Ayush Kumar',
        email: 'ayush.kumar@sms.edu',
        age: 23,
        marks: 70,
        city: 'Bangalore',
        department: 'Civil Engineering',
        roll: 'CE-107',
        phone: '+91 9321098765',
        dateOfBirth: '2001-09-25',
        createdBy: adminUser._id
      },
      {
        name: 'Ayush Parashar',
        email: 'ayush.parashar@sms.edu',
        age: 20,
        marks: 85,
        city: 'Jaipur',
        department: 'Computer Science',
        roll: 'CS-108',
        phone: '+91 9210987654',
        dateOfBirth: '2004-12-01',
        createdBy: adminUser._id
      },
      {
        name: 'Riya Sen',
        email: 'riya.sen@sms.edu',
        age: 22,
        marks: 96,
        city: 'Kolkata',
        department: 'Electronics',
        roll: 'EC-109',
        phone: '+91 9109876543',
        dateOfBirth: '2002-04-15',
        createdBy: adminUser._id
      },
      {
        name: 'Kunal Joshi',
        email: 'kunal.joshi@sms.edu',
        age: 19,
        marks: 58,
        city: 'Mumbai',
        department: 'Mechanical',
        roll: 'ME-110',
        phone: '+91 9098765432',
        dateOfBirth: '2005-01-28',
        createdBy: adminUser._id
      },
      {
        name: 'Pooja Reddy',
        email: 'pooja.reddy@sms.edu',
        age: 21,
        marks: 79,
        city: 'Hyderabad',
        department: 'Information Technology',
        roll: 'IT-111',
        phone: '+91 8987654321',
        dateOfBirth: '2003-10-10',
        createdBy: adminUser._id
      },
      {
        name: 'Siddharth Nair',
        email: 'siddharth.nair@sms.edu',
        age: 24,
        marks: 89,
        city: 'Chennai',
        department: 'Computer Science',
        roll: 'CS-112',
        phone: '+91 8876543210',
        dateOfBirth: '2000-06-08',
        createdBy: adminUser._id
      }
    ];

    await Student.insertMany(sampleStudents);
    console.log(`[Seed] Seeded ${sampleStudents.length} student records successfully`);

    await mongoose.connection.close();
    console.log('[Seed] Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;
