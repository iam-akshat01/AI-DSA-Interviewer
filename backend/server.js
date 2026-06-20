const express = require('express');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

// Routes
const interviewRoutes = require('./routes/interviewRoutes');

dotenv.config();

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running'
    });
});

// Routes
app.use('/api/interview', interviewRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(
                `Server running on port ${PORT}`
            );
        });
    } catch (error) {
        console.error(
            'Failed to start server:',
            error
        );

        process.exit(1);
    }
};

startServer();