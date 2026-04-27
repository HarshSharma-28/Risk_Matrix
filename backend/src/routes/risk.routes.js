const express = require('express');
const router = express.Router();
const axios = require('axios');
const { validate } = require('../middleware/validate');
const { riskRequestSchema } = require('../schemas/validation.schemas');

const { authenticate } = require('../middleware/auth');

// Expose the unified endpoint to the frontend
router.post('/evaluate', authenticate, validate(riskRequestSchema), async (req, res, next) => {
    try {
        const payload = {
            ...req.body,
            userId: req.user.id // Inject authenticated User ID for JDBC persistence
        };
        
        // API Bridge: Forward mathematically intense logic to Java Core Engine running on port 8080
        const javaEngineUrl = 'http://localhost:8080/api/v1/evaluate';
        
        const response = await axios.post(javaEngineUrl, payload);
        
        return res.status(200).json({
            success: true,
            data: response.data
        });
    } catch (err) {
        if (err.response) {
             // Java Engine threw a math or validation exception natively
             return res.status(err.response.status).json({
                 success: false,
                 error: err.response.data
             });
        }
        // Connection refused (Java server is down)
        err.message = "Failed to communicate with Core Java Engine. Ensure the Spring Boot microservice is running.";
        next(err);
    }
});

module.exports = router;
