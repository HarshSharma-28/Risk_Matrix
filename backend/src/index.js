require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth.routes');
const riskRoutes = require('./routes/risk.routes');
const marketplaceRoutes = require('./routes/marketplace.routes');
const employeeRoutes = require('./routes/employee.routes');
const aiRoutes = require('./routes/ai.routes');

const app = express();

// Security mechanisms
app.use(helmet());
app.use(cors({
  origin: true,
  credentials: true
}));

// Payload limitation
app.use(express.json({ limit: '10kb' })); 

// Rate limiting
app.use(rateLimiter);

// Routes mounting
app.use('/auth', authRoutes);
app.use('/risk', riskRoutes);
app.use('/customer', marketplaceRoutes);
app.use('/employee', employeeRoutes);
app.use('/ai', aiRoutes);

// Simple health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 RiskMatrix Backend API listening on port ${PORT}`);
});
