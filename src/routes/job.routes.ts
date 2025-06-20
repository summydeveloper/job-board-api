import express from 'express';
import {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
} from '../controllers/job.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', getJobs);

// Protected & role-restricted routes (only employers can create/update/delete jobs)
router.post('/', authenticate, authorizeRoles('employer'), createJob);
router.put('/:id', authenticate, authorizeRoles('employer'), updateJob);
router.delete('/:id', authenticate, authorizeRoles('employer'), deleteJob);

export default router;
