const express = require('express');
const connectDB = require('./database');
const userRoutes = require('./app');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/user', userRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
