const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase');
const { authenticate } = require('../middleware/auth');

// Middleware to ensure user is an employee/admin
const isEmployee = (req, res, next) => {
    if (req.user.role === 'employee' || req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied. Staff only.' });
    }
};

// GET all applications (saved quotes)
router.get('/applications', authenticate, isEmployee, async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('saved_quotes')
            .select(`
                *,
                users (
                    email,
                    first_name,
                    last_name
                )
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
});

// POST decision (Approve/Reject)
router.post('/decide', authenticate, isEmployee, async (req, res, next) => {
    try {
        const { applicationId, customerId, decision, explanation } = req.body;

        const { data, error } = await supabase
            .from('risk_assessments')
            .insert([{
                customer_id: customerId,
                assessed_by: req.user.id,
                decision: decision,
                explanation: explanation,
                assessment_date: new Date()
            }]);

        if (error) throw error;

        // Optionally delete the quote from saved_quotes if approved/rejected to clear the queue
        await supabase.from('saved_quotes').delete().match({ id: applicationId });

        res.status(200).json({ success: true, message: `Application ${decision.toLowerCase()}ed successfully.` });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
