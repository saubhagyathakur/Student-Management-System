const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Student email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address'
      ]
    },
    age: {
      type: Number,
      required: [true, 'Student age is required'],
      min: [3, 'Age must be at least 3'],
      max: [120, 'Age cannot exceed 120']
    },
    marks: {
      type: Number,
      required: [true, 'Marks are required'],
      min: [0, 'Marks cannot be less than 0'],
      max: [100, 'Marks cannot exceed 100']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    roll: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    dateOfBirth: {
      type: String,
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast searching, filtering, and sorting
studentSchema.index({ city: 1 });
studentSchema.index({ department: 1 });
studentSchema.index({ marks: 1 });
studentSchema.index({ age: 1 });
studentSchema.index({ name: 'text', email: 'text' });

studentSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Student', studentSchema);
