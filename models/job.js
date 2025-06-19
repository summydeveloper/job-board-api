const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a job description'],
    },
    company: {
      type: String,
      required: [true, 'Please specify the company'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide a location'],
    },
    salary: {
      type: Number,
      default: 0,
    },
    jobType: {
      type: String,
      enum: ['Full-Time', 'Part-Time', 'Contract'],
      default: 'Full-Time',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', jobSchema);
