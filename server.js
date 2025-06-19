require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authroutes');
const protectedRoutes = require('./routes/protectedroutes');

const app = express();

connectDB(); // connect to MongoDB

// 🔥 Add this line!
app.use(express.json());

app.use(cors());

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/protected', protectedRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
