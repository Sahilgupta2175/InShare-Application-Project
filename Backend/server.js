const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const path = require('path');
const connectDB = require('./config/db');

// Connect to the database
connectDB();

// Template engine
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, '../Frontend')));
app.use(express.json());

// Routes
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});