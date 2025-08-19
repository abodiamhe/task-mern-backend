const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./connect/database');
const Cors = require('cors');

const { errorHandler } = require('./middleware/errorMiddleware');

const port = process.env.PORT || 5000;

//Connecting to database when our app start
connectDB();

const app = express();

//middleware to parse incoming json body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(Cors());

//
app.use('/api/tasks', require('./routes/taskRoutes'));

app.use('/api/users', require('./routes/userRoutes'));

//Error middleware handler
app.use(errorHandler);

app.listen(port, () => console.log(`Server listening on port ${port}.`));
