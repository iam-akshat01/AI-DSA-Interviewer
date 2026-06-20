const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error(error);
    }
};

startServer();

const app = express();

app.use(express.json());    

const PORT = process.env.PORT || 5000;

app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: "Server is running"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});