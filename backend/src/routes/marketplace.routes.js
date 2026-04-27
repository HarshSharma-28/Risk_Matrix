const express = require('express');
const router = express.Router();
const { supabase } = require('../config/supabase'); 
const { authenticate } = require('../middleware/auth');

// GET all saved quotes for the current user
router.get('/saved-quotes', authenticate, async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('saved_quotes')
            .select('*')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
});

// SAVE a new quote
router.post('/save-quote', authenticate, async (req, res, next) => {
    try {
        const { bank_name, loan_type, interest_rate, max_amount } = req.body;

        const { data, error } = await supabase
            .from('saved_quotes')
            .insert([
                { 
                    user_id: req.user.id, 
                    bank_name, 
                    loan_type, 
                    interest_rate, 
                    max_amount 
                }
            ])
            .select();

        if (error) throw error;

        res.status(201).json({ success: true, data: data[0] });
    } catch (err) {
        next(err);
    }
});

// DELETE a quote
router.delete('/delete-quote/:id', authenticate, async (req, res, next) => {
    try {
        const { error } = await supabase
            .from('saved_quotes')
            .delete()
            .match({ id: req.params.id, user_id: req.user.id });

        if (error) throw error;
        
        res.status(200).json({ success: true, message: 'Quote revoked securely.' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
