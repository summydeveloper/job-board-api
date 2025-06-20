import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Job from '../models/job.model';
import { IUser } from '../models/user.model';
import { Types } from 'mongoose';

// Extend Express Request to include `user`
interface AuthenticatedRequest extends Request {
  user: IUser & { _id: Types.ObjectId };
}

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Employer)
export const createJob = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthenticatedRequest;
  const { title, description, company, location, salary, jobType } = req.body;

  if (!title || !description || !company || !location) {
    res.status(400).json({ message: 'Please fill in all required fields' });
    return;
  }

  const job = await Job.create({
    title,
    description,
    company,
    location,
    salary,
    jobType,
    createdBy: authReq.user._id,
  });

  res.status(201).json(job);
});

// @desc    Get jobs with filters, sorting, and pagination
// @route   GET /api/jobs
// @access  Public
export const getJobs = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const {
    jobType,
    location,
    minSalary,
    maxSalary,
    page = '1',
    limit = '10',
    sortBy = 'createdAt',
    order = 'desc',
  } = req.query;

  const query: any = {};

  if (jobType) query.jobType = jobType;
  if (location) query.location = { $regex: location, $options: 'i' };
  if (minSalary || maxSalary) {
    query.salary = {};
    if (minSalary) query.salary.$gte = Number(minSalary);
    if (maxSalary) query.salary.$lte = Number(maxSalary);
  }

  const pageNumber = Math.max(1, Number(page));
  const pageLimit = Math.max(1, Number(limit));
  const skip = (pageNumber - 1) * pageLimit;

  const sortOptions: any = {};
  sortOptions[sortBy as string] = order === 'desc' ? -1 : 1;

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
export const updateJob = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthenticatedRequest;

  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404).json({ message: 'Job not found' });
    return;
  }

  if (job.createdBy.toString() !== authReq.user._id.toString()) {
    res.status(403).json({ message: 'Not authorized to update this job' });
    return;
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
export const deleteJob = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const authReq = req as AuthenticatedRequest;

  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404).json({ message: 'Job not found' });
    return;
  }

  if (job.createdBy.toString() !== authReq.user._id.toString()) {
    res.status(403).json({ message: 'Not authorized to delete this job' });
    return;
  }

  await job.deleteOne();
  res.status(200).json({ message: 'Job deleted successfully' });
});
