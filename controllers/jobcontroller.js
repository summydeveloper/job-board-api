
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

// @desc    Get jobs with filters, sorting, and pagination
// @route   GET /api/jobs
// @access  Public
exports.getJobs = asyncHandler(async (req, res) => {
  const {
    jobType,
    location,
    minSalary,
    maxSalary,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  // Build query object
  const query = {};
  if (jobType) query.jobType = jobType;
  if (location) query.location = { $regex: location, $options: 'i' };
  if (minSalary || maxSalary) {
    query.salary = {};
    if (minSalary) query.salary.$gte = Number(minSalary);
    if (maxSalary) query.salary.$lte = Number(maxSalary);
  }

  // Pagination
  const pageNumber = Math.max(1, Number(page));
  const pageLimit = Math.max(1, Number(limit));
  const skip = (pageNumber - 1) * pageLimit;

  // Sorting
  const sortOptions = {};
  sortOptions[sortBy] = order === 'desc' ? -1 : 1;

  // Query DB
  const jobs = await Job.find(query)
    .populate('createdBy', 'name email')
    .sort(sortOptions)
    .skip(skip)
    .limit(pageLimit);

  const totalJobs = await Job.countDocuments(query);
  const totalPages = Math.ceil(totalJobs / pageLimit);

  res.status(200).json({
    data: jobs,
    pagination: {
      totalJobs,
      totalPages,
      currentPage: pageNumber,
    },
  });
});

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private (Employer only if owner)
exports.updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  // Check ownership
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

  // Check ownership
  if (job.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this job' });
  }

  await job.deleteOne();
  res.status(200).json({ message: 'Job deleted successfully' });
});
