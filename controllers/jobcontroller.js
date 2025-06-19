const Job = require('../models/job');
const asyncHandler = require('express-async-handler');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Employer)
exports.createJob = asyncHandler(async (req, res) => {
  const { title, description, company, location, salary, jobType } = req.body;

  if (!title || !description || !company || !location) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }

  const job = await Job.create({
    title,
    description,
    company,
    location,
    salary,
    jobType,
    createdBy: req.user._id,
  });

  res.status(201).json(job);
});

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find().populate('createdBy', 'name email');
  res.status(200).json(jobs);
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Employer only if owner)
exports.updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  // Only the creator of the job can update it
  if (job.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this job' });
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedJob);
});

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only if owner)
exports.deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  // Only the creator of the job can delete it
  if (job.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this job' });
  }

  await job.deleteOne(); // .remove() is deprecated in newer Mongoose
  res.status(200).json({ message: 'Job deleted successfully' });
});
