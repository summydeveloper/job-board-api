const express = require('express');
const { authenticate, authorizeRoles } = require('../middlewares/authmiddleware');

const router = express.Router();

router.get('/dashboard', authenticate, authorizeRoles('employer'), (req, res) => {
  res.json({ message: `Welcome, ${req.user.role} ${req.user.id}` });
});

module.exports = router;
 
