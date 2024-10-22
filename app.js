require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const questionRoutes = require('./routes/question.routes');
require('./config/cron'); // Ensure cron jobs run

const app = express();
console.log(process.env.MONGO_URI)

// Connect to the database
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/api', questionRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
