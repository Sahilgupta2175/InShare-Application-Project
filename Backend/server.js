const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const connectDB = require('./config/db');

// Connect to the database
connectDB();

// Routes
app.use('/api/files', require('./routes/files'));

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});