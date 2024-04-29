require('dotenv').config();
const express = require('express');
const connectDB = require('./src/database/database');
const userRoutes = require('./src/routes/routes');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/user', userRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
