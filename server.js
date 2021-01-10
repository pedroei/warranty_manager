const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const app = express();

// connect to db
connectDB();

// middleware
app.use(express.json());

// routes
// app.use('/api/users', require('./routes/users'));
// app.use('/api/transactions', require('./routes/transactions'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
