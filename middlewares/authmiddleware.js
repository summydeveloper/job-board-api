// const jwt = require('jsonwebtoken');
 
// const User = require('../models/User');
// const asyncHandler = require('express-async-handler');

// const authenticate = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   const token = authHeader.split(' ')[1];
//   try {
//     const payload = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = payload;
//     next();
//   } catch (err) {
//     res.status(401).json({ error: 'Token invalid' });
//   }
// };

// const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ error: 'Forbidden' });
//     }
//     next();
//   };
// };

// module.exports = { authenticate, authorizeRoles };

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// Protect routes - verify token and attach user
const authenticate = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Optional: load user from DB if you need fresh data
    req.user = await User.findById(decoded.id).select('-password');

    // Or, if you trust the token payload:
    // req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token invalid' });
  }
});

// Authorize roles - e.g., 'admin', 'recruiter'
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Access denied' });
    }
    next();
  };
};

module.exports = { authenticate, authorizeRoles };
