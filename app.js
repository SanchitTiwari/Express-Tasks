require('dotenv').config();
const express = require('express');
const connectDB = require('./src/database/database');
const userRoutes = require('./src/routes/routes');
const app = express();
const PORT = process.env.PORT || 3000; // updated port to import it from .env file and created .gitignore to exclude modules and env from the repository

app.use(express.json());
app.use('/user', userRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
