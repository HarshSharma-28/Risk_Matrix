const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/supabase');
const { validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');
const { registerSchema, loginSchema } = require('../schemas/validation.schemas');

// POST /auth/signup
router.post('/signup', authLimiter, validate(registerSchema), async (req, res, next) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    const assignedRole = role || 'customer';

    // First check if user already exists in our database
    const { data: existingUser } = await supabaseAdmin.from('users').select('id').eq('email', email).maybeSingle();
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'User already exists' }
      });
    }

    // 1. Create user in Supabase Auth WITH role metadata so JWT carries the role
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation for dev
      user_metadata: {
        role: assignedRole,
        first_name: firstName,
        last_name: lastName,
      }
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        error: { code: 'AUTH_SIGNUP_FAILED', message: authError.message }
      });
    }

    let generatedStaffId = null;

    // 2. Insert into custom 'users' table using ADMIN client to bypass RLS
    if (authData.user) {
      const { error: dbError } = await supabaseAdmin
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          password_hash: '',
          role: assignedRole,
          first_name: firstName,
          last_name: lastName
        });
        
      if (dbError) throw dbError;
      
      // 3. If customer, initialize an empty customer profile
      if (assignedRole === 'customer') {
        await supabaseAdmin.from('customer_profiles').insert({ user_id: authData.user.id });
      }

      // 4. If employee, generate a unique Staff ID and create employee profile
      if (assignedRole === 'employee') {
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        generatedStaffId = `EMP-${randomNum}`;
        
        // Ensure uniqueness (retry if collision)
        let { data: existingEmp } = await supabaseAdmin
          .from('employee_profiles')
          .select('employee_id')
          .eq('employee_id', generatedStaffId)
          .maybeSingle();

        while (existingEmp) {
          const newNum = Math.floor(1000 + Math.random() * 9000);
          generatedStaffId = `EMP-${newNum}`;
          const check = await supabaseAdmin
            .from('employee_profiles')
            .select('employee_id')
            .eq('employee_id', generatedStaffId)
            .maybeSingle();
          existingEmp = check.data;
        }

        await supabaseAdmin.from('employee_profiles').insert({
          user_id: authData.user.id,
          employee_id: generatedStaffId,
          department: 'General',
          designation: 'Staff'
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Registration successful. Please login.",
      data: {
        user: authData.user,
        staffId: generatedStaffId  // null for customers, "EMP-XXXX" for employees
      }
    });

  } catch (err) {
    next(err);
  }
});


// POST /auth/login
router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_LOGIN_FAILED', message: 'Invalid credentials' }
      });
    }
    
    // Fetch user role
    const { data: profile } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', data.user.id)
      .single();

    let staffId = null;
    let department = 'General';
    let designation = 'Staff';

    if (profile?.role === 'employee' || profile?.role === 'admin') {
      const { data: empProfile } = await supabaseAdmin
        .from('employee_profiles')
        .select('employee_id, department, designation')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (empProfile) {
        staffId = empProfile.employee_id;
        department = empProfile.department;
        designation = empProfile.designation;
      }
    }

    res.status(200).json({
      success: true,
      data: {
        session: data.session,
        user: { 
          ...data.user, 
          role: profile?.role || 'customer',
          staffId,
          department,
          designation
        }
      }
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
