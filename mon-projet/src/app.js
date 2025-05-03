require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const invoiceRoutes = require('./routes/invoiceRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://mouhaned372:99885567@cluster0.06hwl3a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/invoices', invoiceRoutes);

// Error handling
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Hey Mouhaned We Are Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`> > > Server running on port ${PORT} < < < `);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });