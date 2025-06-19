const User = require('../models/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    console.log('Register hit, body:', req.body);  
  const { name, email, password, role } = req.body;
  const user = await User.create({ name, email, password, role });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.status(201).json({ user: { name: user.name, role: user.role }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.status(200).json({ user: { name: user.name, role: user.role }, token });
};

module.exports = { register, login };
