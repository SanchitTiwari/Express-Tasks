const express = require('express');
const connectDB = require('./src/database/database');
const userRoutes = require('./app');
const app = express();
const PORT = 4000;

app.use(express.json());
app.use('/user', userRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
