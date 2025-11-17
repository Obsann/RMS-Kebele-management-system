const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const Router = require('./routes/authRoute.js');
const userRoute = require('./routes/userRoute.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB().catch(err => {
  console.error("Database connection failed:", err.message);
  process.exit(1);
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', Router);
app.use('/api/user', userRoute);

// Optional base route
app.get('/', (req, res) => res.send('API is running...'));

app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT}`);
});
