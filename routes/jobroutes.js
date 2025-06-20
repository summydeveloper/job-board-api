const express = require('express');
const router = express.Router();

const {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
} = require('../controllers/jobcontroller');

const { authenticate, authorizeRoles } = require('../middlewares/authmiddleware');

 
router.get('/', getJobs);

// Protected & role-restricted routes (only employers can create/update/delete jobs)
router.post('/', authenticate, authorizeRoles('employer'), createJob);
router.put('/:id', authenticate, authorizeRoles('employer'), updateJob);
router.delete('/:id', authenticate, authorizeRoles('employer'), deleteJob);

module.exports = router;
