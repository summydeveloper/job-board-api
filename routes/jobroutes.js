const express = require('express');
const router = express.Router();

const {
  createJob,
  getAllJobs,
  updateJob,
  deleteJob,
} = require('../controllers/jobcontroller');

const { authenticate, authorizeRoles } = require('../middlewares/authmiddleware');

// Public route
router.get('/', getAllJobs);

// Protected & role-restricted routes (only employers can create/update/delete jobs)
router.post('/', authenticate, authorizeRoles('employer'), createJob);
router.put('/:id', authenticate, authorizeRoles('employer'), updateJob);
router.delete('/:id', authenticate, authorizeRoles('employer'), deleteJob);

module.exports = router;
